import mongoose, { Schema } from 'mongoose';

// Defining the Feedback Schema
const feedbackSchema = new Schema({
    cusID: {
        type: String,
        
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    employee: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    star_rating: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },
}, { timestamps: true });

// Exporting the Feedback Model
export const Feedback = mongoose.model('Feedback', feedbackSchema);
