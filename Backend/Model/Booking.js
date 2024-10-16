import mongoose from 'mongoose';

// Define the Booking Schema
const BookingSchema = mongoose.Schema({
    Booking_Date: {
        type: Date,
        required: true
    },
    Booking_Id: {
        type: String,
        unique: true
    },
    cusID: {
        type: String,
    },
    Customer_Name: {
        type: String,
        required: true
    },
    Vehicle_Type: {
        type: String,
        required: true
    },
    Vehicle_Number: {
        type: String,
        required: true
    },
    Contact_Number: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    selectedPackage: {
        type: String,
    },
    selectedServices: {
        type: [String],
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled' ],
        default: 'Pending'
    }
});

// Define a Counter Schema for generating unique Booking IDs
const counterSchema = mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Pre-save hook to generate a unique Booking ID
BookingSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const doc = await Counter.findOneAndUpdate(
                { _id: 'bookingID' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.Booking_Id = 'BKG' + doc.seq;
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Export the Booking model
export const Booking = mongoose.model('Booking', BookingSchema);
