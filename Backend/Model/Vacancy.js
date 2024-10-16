import mongoose from "mongoose";

// Defining the vacency Schema
const vacancySchema = mongoose.Schema({

    VacancyID: {
        type: String,     
    },

    Name: {
        type: String,
        required: true,
        
    },
    
    Description: {
        type: String,
        required: true,
    },
   
});


// Exporting the vacency Model
export const Vacancy = mongoose.model('Vacancy', vacancySchema);

