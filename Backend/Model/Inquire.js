import mongoose from "mongoose";

// Defining the Inquire Schema
const inquireSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true,
        
    },
    Number: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    ServiceType: {
        type: String,
        required: true,
    },
    VehicleNumber: {
        type: String,
        required: true,
    },
    Message: {
        type: String,
        required: true,
    }, cusID: {
        type: String,
    },
   
});


// Exporting the Inquire Model
export const Inquire = mongoose.model('Inquire', inquireSchema);

