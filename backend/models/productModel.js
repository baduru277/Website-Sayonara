const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a product title'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a product price'],
        min: [0, 'Price must be positive'],
    },
    category: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Books', 'Furniture', 'Toys', 'Food'],
        default: "Clothing",
      },
    status: {
        type: String,
        enum: ['pending','active', 'inactive',"approved","resolve","rejected",'discontinued'],
        default: 'active',
    },
    images: [
        {
            type: String,
            required: true,
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
