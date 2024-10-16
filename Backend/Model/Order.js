import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    orderId: {
        type: String,
        // required: true,
        // unique: true,
    },
    CusID: {
        type: String,
    },
    customerInfo: {
        FirstName: { type: String},
        Email: { type: String},
        ContactNo: { type: String},
    },
    items: [
        {
            ItemNo: { type: String},
            Name: { type: String},
            Description: { type: String},
            quantity: { type: Number},
            Price: { type: Number},
            photoURL: { type: String},
        },
    ],
    Total: {
        type: Number,
    },
    deliveryInfo: {
        address: { type: String},
        city: { type: String},
        postalCode: { type: String},
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    cardInfo: {
        cardNumber: { type: String },
        expiryDate: { type: String },
        cvv: { type: String },
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
