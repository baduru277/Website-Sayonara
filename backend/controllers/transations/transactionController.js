const Transaction = require("../../models/transactionModel");
const Dispute = require("../../models/disputeModel");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorhandler");
const _response_message = require("../../utils/messages");
const sendEmail = require("../../utils/sendEmail"); // Import sendEmail function
const User = require('../../models/userModel'); // MongoDB User model
const { encryptData, decryptData } = require('../../utils/encryptionUtils'); // Your encryption utility
exports.createTransaction = catchAsyncErrors(async (req, res, next) => {
  const { userId, productId, transactionType, amount, description } = req.body;

  // Validate required fields
  if (!userId || !productId || !transactionType || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: userId, productId, transactionType, or amount.',
    });
  }

  // Validate that amount and description are not undefined
  if (amount === undefined || description === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Amount and description are required.',
    });
  }

  // Encrypt sensitive data (amount and description)
  let encryptedAmount, encryptedDescription, amountIv, descriptionIv;
  try {
    // Destructure to get both encryptedData and iv for amount
    const { encryptedData: encryptedAmountData, iv: amountIvData } = encryptData(amount.toString());
    encryptedAmount = encryptedAmountData;
    amountIv = amountIvData;

    // Destructure to get both encryptedData and iv for description
    const { encryptedData: encryptedDescriptionData, iv: descriptionIvData } = encryptData(description);
    encryptedDescription = encryptedDescriptionData;
    descriptionIv = descriptionIvData;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error during encryption: ' + error.message,
    });
  }

  // Create the transaction with encrypted data
  const transaction = await Transaction.create({
    userId,
    productId,
    transactionType,
    amount: encryptedAmount, // Encrypted amount
    description: encryptedDescription, // Encrypted description
    amountIv, // Store the IV for decryption later
    descriptionIv, // Store the IV for decryption later
  });

  // Fetch user email from database using userId
  const user = await User.findById(userId); // Ensure you import the User model
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.',
    });
  }

  const userEmail = user.email; // Now you have the user's email

  // Decrypt amount and description for the email
  const decryptedAmount = decryptData(transaction.amount, transaction.amountIv);
  const decryptedDescription = decryptData(transaction.description, transaction.descriptionIv);

  // Define email message with decrypted fields
  const emailMessage = `
    A new transaction has been created:
    User ID: ${userId}
    Transaction Type: ${transactionType}
    Product ID: ${productId}
    Amount: ${decryptedAmount}
    Description: ${decryptedDescription}
  `;

  // Fetch admins (users with role 'admin')
  const admins = await User.find({ role: 'Admin' }); // Adjust this query based on your role field
  if (!admins || admins.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No admins found.',
    });
  }

  try {
    const emailPromises = [
      sendEmail({
        email: userEmail, 
        subject: 'Transaction Created Successfully',
        message: `Hello, your transaction has been successfully created.\n\n${emailMessage}`,
      }),
    ];

    admins.forEach((admin) => {
      emailPromises.push(
        sendEmail({
          email: admin.email, 
          subject: 'New Transaction Alert',
          message: `Admin Alert:\n\n${emailMessage}`,
        })
      );
    });

    await Promise.all(emailPromises);
    console.log('Emails sent successfully');

    const io = req.app.get('socketio');
    const transactionData = {
      userId,
      productId,
      transactionType,
      amount: decryptedAmount,
      description: decryptedDescription,
    };


    io.emit('transactionCreated', { transaction: transactionData });



    io.to(userId).emit('transactionCreated', { transaction: transactionData });

    admins.forEach((admin) => {
      io.to(admin._id.toString()).emit('transactionCreated', { transaction: transactionData });
    });
  } catch (error) {
    console.error('Error sending emails:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Transaction created successfully and notifications sent!',
    transaction,
  });
});


// -------------------------- Get Transactions --------------------------
exports.getTransactions = catchAsyncErrors(async (req, res, next) => {
  const { transactionType, user, status } = req.query;

  const filters = {};
  if (transactionType) filters.transactionType = transactionType;
  if (user) filters.userId = user;
  if (status) filters.status = status;

  const transactions = await Transaction.find(filters).populate('userId productId');

  if (!transactions || transactions.length === 0) {
    return next(new ErrorHandler(_response_message._error.notFound("Transactions"), 404));
  }

  res.status(200).json({
    success: true,
    message: _response_message._query.fetch("Transactions"),
    transactions,
  });
});

// -------------------------- Update Transaction Status -------------------------
exports.updateTransactionStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  if (!['completed', 'cancelled', 'failed'].includes(status)) {
    return next(new ErrorHandler(_response_message._error.invalidStatus("Transaction status"), 400));
  }

  const transaction = await Transaction.findById(id).populate('userId productId');

  if (!transaction) {
    return next(new ErrorHandler(_response_message._error.notFound("Transaction"), 404));
  }


  transaction.status = status;
  transaction.updatedAt = Date.now();
  await transaction.save();

  const message = `Your transaction for product ${transaction.productId.title} has been ${status}.`;  // Assuming `name` is a field in your product model

  try {
    await sendEmail({
      email: transaction.userId.email,  // Send email to the user's email
      subject: "Transaction Status Update",
      message: message,  // Transaction status message
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to send email notification", 500));
  }

  // Send success response
  res.status(200).json({
    success: true,
    message: _response_message._query.update("Transaction status"),
    transaction,
  });
});


// -------------------------- Add Dispute --------------------------
exports.addDispute = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return next(new ErrorHandler("Please provide a reason for the dispute", 400));
  }

  const transaction = await Transaction.findById(id);

  if (!transaction) {
    return next(new ErrorHandler(_response_message._error.notFound("Transaction"), 404));
  }

  const dispute = await Dispute.create({
    transactionId: id,
    reason,
  });

  res.status(201).json({
    success: true,
    message: _response_message._query.add("Dispute"),
    dispute,
  });
});

// -------------------------- Resolve Dispute --------------------------
exports.resolveDispute = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Get dispute ID from request params
  const { status, resolution } = req.body; // Get status and resolution from request body

  // Validate status (must be either 'resolved' or 'denied')
  if (!['resolved', 'denied'].includes(status)) {
    return next(new ErrorHandler("Invalid status for dispute resolution", 400));
  }

  // Find the dispute by ID
  const dispute = await Dispute.findById(id);

  // If dispute not found, return an error
  if (!dispute) {
    return next(new ErrorHandler(_response_message._error.notFound("Dispute"), 404));
  }

  // Update the dispute status and resolution
  dispute.status = status;
  dispute.resolution = resolution || 'No resolution provided'; // If no resolution provided, set default value

  // Save the updated dispute document
  await dispute.save();

  // Respond with success message and updated dispute details
  res.status(200).json({
    success: true,
    message: _response_message._query.update("Dispute"),
    dispute,
  });
});

// Approve Dispute
exports.approveDispute = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
  
    // Fetch the dispute, and populate the necessary fields
    const dispute = await Dispute.findById(id).populate({
        path: 'transactionId',
        select: 'userId',
        populate: { path: 'userId', select: 'email' }
      });

  
    // If dispute is not found, return an error
    if (!dispute) {
      return next(new ErrorHandler('Dispute not found', 404));
    }
  
    // Ensure email is available
    if (!dispute.transactionId || !dispute.transactionId.userId || !dispute.transactionId.userId.email) {
      return next(new ErrorHandler('Transaction or user email information is missing', 400));
    }
  
    // Extract the user's email for sending the email notification
    const email = dispute.transactionId.userId.email || "saurabhdokade77@gmail.com";
    
    console.log('Dispute Object:', dispute); // Debug: Log dispute object
    console.log('Email Address:', email); // Debug: Log email
  
    // Set dispute status and resolution
    dispute.status = 'resolved';
    dispute.resolution = 'Approved by admin';
    await dispute.save();
  
    // Prepare the email details
    const subject = 'Your Dispute has been Resolved';
    const message = `
      Dear User,
      
      Your dispute regarding transaction #${dispute.transactionId._id} has been resolved and approved by the admin.
      
      Resolution: Approved by admin.
      
      Thank you for your patience.
    `;
  
    // Validate the email before sending
    if (!email || !email.includes('@')) {
      return next(new ErrorHandler('Invalid email address', 400));
    }
  
    // Try to send the email notification
    try {
      await sendEmail({
        email, subject, message});
      console.log('Email sent successfully to:', email); // Log success
    } catch (error) {
      console.error('Error sending email:', error); // Log error if email sending fails
      return next(new ErrorHandler('Failed to send email notification', 500));
    }
  
    // Return response indicating successful resolution
    res.status(200).json({
      success: true,
      message: 'Dispute resolved and approved successfully',
      dispute,
    });
  });
  

// Deny Dispute
exports.denyDispute = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
  
    const dispute = await Dispute.findById(id).populate({
      path: 'transactionId',
      select: 'userId',
      populate: { path: 'userId', select: 'email' }
    });
  
    if (!dispute) {
      return next(new ErrorHandler("Dispute not found", 404));
    }
  
    // Mark dispute as denied
    dispute.status = 'denied';
    dispute.resolution = "Denied by admin";
  
    await dispute.save();
  
    // Check if user email exists before sending the email
    const email = dispute.transactionId.userId.email;
    if (!email || !email.includes('@')) {
      return next(new ErrorHandler('Invalid email address for the user', 400));
    }
  
    const subject = "Your Dispute has been Denied";
    const message = `Dear User, your dispute regarding transaction #${dispute.transactionId._id} has been denied by the admin.`;
  
    // Send email and handle errors
    try {
      await sendEmail({email, subject, message});
      console.log('Email sent successfully to:', email); // Log success
    } catch (error) {
      console.error('Error sending email:', error); // Log error if email sending fails
      return next(new ErrorHandler('Failed to send email notification', 500));
    }
  
    res.status(200).json({
      success: true,
      message: "Dispute denied successfully",
      dispute,
    });
  });
  