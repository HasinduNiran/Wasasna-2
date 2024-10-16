import mongoose from "mongoose";

// Defining the repairEstimateSchema
const repairEstimateSchema = mongoose.Schema(
  {
    Register_Number: {
      type: String,
      required: true,
    },
    Make: {
      type: String,
      required: true,
    },
    Model: {
      type: String,
      required: true,
    },
    Year: {
      type: String,
      required: true,
    },
    Engine_Details: {
      type: String,
      required: true,
    },
    Transmission_Details: {
      type: String,
      required: true,
    },
    Vehicle_Color: {
      type: String,
      required: true,
    },
    cusID: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    NIC: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    insuranceProvider: {
      type: String,
      required: true,
    },
    agentName: {
      type: String,
      required: true,
    },
    agentEmail: {
      type: String,
      required: true,
    },
    agentContact: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    photoURL: { type: String },
    estimateList: [
      {
        name: {
          type: String,
          required: [true, "Product Name Required"],
        },
        unitPrice: {
          type: Number,
          required: [true, "Product Price Required"],
        },
        quantity: {
          type: Number,
          required: [true, "Product Quantity Required"],
          default: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Exporting the repairEstimateModel
export const RepairEstimate = mongoose.model(
  "RepairEstimate",
  repairEstimateSchema
);
