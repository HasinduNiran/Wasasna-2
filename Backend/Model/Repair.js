import mongoose from "mongoose";

const repairSchema = mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
        },
        customerEmail: {
            type: String,
            required: true,
            unique: true,
            // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        },
        customerPhone: {
            type: String,
            required: true,
            unique: true,
            //match: /^\+\d{1,3}\s\(\d{3}\)\s\d{3}-\d{4}$/,
        },
        vehicleMake: {
            type: String,
            required: true,
        },
        vehicleModel: {
            type: String,
            required: true,
        },
        vehicleNo: {
            type: String,
            required: true,
        },

        repairDescription: {
            type: String,
            required: true,
        },
        repairStatus: {
            type: String,
            required: true,
            enum: ["Pending", "In Progress", "Completed"],
        },Insuranceprovider: {
            type: String,
            required: true,
        },
        Agent:{
            type: String,
            required: true,
        },
        });

        export const Repair = mongoose.model('Repair', repairSchema);
     
