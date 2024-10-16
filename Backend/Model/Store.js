import mongoose from "mongoose";

// Defining the Store Schema
const storeSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Quantity: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
  },
  Price: {
    type: String,
    required: true,
  },
  photoURL: {
    type: String,
  },
});

// Exporting the Store Model
export const Store = mongoose.model("Store", storeSchema);
