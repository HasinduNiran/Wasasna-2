import mongoose from "mongoose";

// Defining the addToCartSchema Schema
const addToCartSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true,
        
    },
    Quantity: {
        type: String,
        required: true,
    },
    Price: {
        type: String,
        required: true,
    },
   
});


// Exporting the addToCartSchema Model
export const AddToCart = mongoose.model('AddToCart', addToCartSchema);

