// ✅ CREATE PENDING SUBSCRIPTION (waiting for offline payment approval)
const expiryDate = new Date();
expiryDate.setFullYear(expiryDate.getFullYear() + 1);

await Subscription.create({
  userId: user.id,
  planName: 'Basic Plan',
  amount: 99.00,
  status: 'pending',  // ✅ Pending approval
  paymentMethod: 'offline',
  startDate: null,  // Will be set when approved
  expiryDate: null   // Will be set when approved
});

const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

const { password: _, ...userData } = user.toJSON();

res.status(201).json({
  message: 'User created successfully. Subscription pending approval.',
  user: userData,
  token,
  subscription: {
    planName: 'Basic Plan',
    amount: 99,
    status: 'pending',
    message: 'Please contact admin for payment approval'
  }
});
