const mongoose = require('mongoose');


    const orderItemSchema = new mongoose. Schema ({
        name: {
        type: String,
        required: true
    },
        price: {
        type: Number, required: true,
        },
        quantity: {
        type: Number, 
        required: true,
        }
        }, {_id: false });

    const shippingAddressSchema = new mongoose. Schema ({
        address: {
        type: String, 
        required: true,
        },
        city: {
            type: String, 
            required: true,
        },
        postalCode: {
            type: String, 
            required: true,
        },
        country: {
            type: String, 
            required: true,
        }
    }, {_id: false });

    const orderSchema= new mongoose.Schema({
        orderItems: [orderItemSchema],
        shippingAddress: [shippingAddressSchema],
        paymentMethod : {
            type: String, 
            required: true, 
            enum: ['card', 'stripe'],
            default: 'card'
        },
        itemPrice: {
            type: Number, 
            required: true,
            default: 0.0,
        },
        taxPrice: {
            type: Number, 
            required: true, 
            default: 0.0,
        },
        totalPrice: {
            type: Number, 
            required: true, 
            default: 0.0,
        },
        note: {
            type: String,
            required: false
        },
        isPaid: { 
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date
        },
        deliveredAt: {
            type: Date,
        },
        stripePaymentIntentId: {
            type: String,
        },
        stripeSessionId:{
            type: String,
        }

    }, {
        timestamps: true, 
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    });

    const Order = mongoose.model('Order', orderSchema);
module.exports = Order;