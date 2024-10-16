import mongoose from "mongoose";

// Defining the service Schema
const serviceSchema = mongoose.Schema({
    cusID: {
        type: String,
        required:true,
        
    },

    Allocated_Employee: {
        type: String,
        required: true,
    },
    Vehicle_Number: {
        type: String,
        required: true,
    },
    Service_History: {
        type: String,
        required: true,
    },
    Service_Date: {
        type:String, // Changed to Date type for better representation
        required: true,
    },
    Milage: {
        type: Number, // Changed to Number type for better representation
        required: true,
    },
    Email: {
        type: String, // Changed to Email type for better representation
        required: true,
    },
    Package: {type:String}
    , // Removed 'required: true' since it's optional
     selectedServices: {
        type: [String],
        required: true
    },
    nextService: {
        type: String, // Changed to Date type for better representation
        required: true,
    }
});

export const serviceHistory = mongoose.model('serviceHistory', serviceSchema);
