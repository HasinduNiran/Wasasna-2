// Importing the Express library
import express from 'express';
import mongoose from 'mongoose';

import { Inquire } from '../Model/Inquire.js';

// Creating an Express router
const router = express.Router();

// Route for creating a new Inquire item
router.post('/', async (request, response) => {
    try {
        // Validate request body fields
        const { Name, Number, Email, ServiceType, VehicleNumber, Message,cusID} = request.body;

     

        // Creating a new Inquire item with the provided data
        const newInquire = {
            Name,
            cusID,
            Number,
            Email,
            ServiceType,
            VehicleNumber,
            Message
         
        };

        // Adding the new Inquire item to the database
        const inquire = await Inquire.create(newInquire);

        // Sending the created Inquire item as a JSON response
        return response.status(201).json(inquire);
    } catch (error) {
        // Handling errors and sending an error response
        console.error(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Route for retrieving all inquire items from the database
router.get('/', async (request, response) => {
    try {
        // Fetching all inquire items from the database
        const inquire = await Inquire.find({});
        
        // Sending the fetched inquire items as a JSON response
        response.status(200).json({
            count: inquire.length,
            data: inquire
        });
    } catch (error) {
        // Handling errors and sending an error response
        console.error(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Route for retrieving a specific inquire item by ID or cusID
router.get('/:identifier', async (request, response) => {
    try {
        const { identifier } = request.params;

        // Check if the identifier is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            const inquireByID = await Inquire.findById(identifier);
            if (inquireByID) {
                return response.status(200).json(inquireByID);
            }
        }

        // If not an ObjectId, check for cusID
        const inquireByCUSID = await Inquire.find({ cusID: identifier });
        if (inquireByCUSID.length > 0) {
            return response.status(200).json(inquireByCUSID);
        }

        response.status(404).json({ message: 'Inquire not found' });
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: 'Error fetching inquire: ' + error.message });
    }
});


// Route for updating a inquire item by ID
router.put('/:id', async (request, response) => {
    try {
        // Extracting the inquire item ID from the request parameters
        const { id } = request.params;
        
        // Find the inquire item by ID
        const inquire = await Inquire.findById(id);

        if (!inquire) {
            return response.status(404).json({ message: 'inquire not found' });
        }

        // Update the fields of the inquire item
        inquire.Name = request.body.Name || inquire.Name;
        inquire.Number = request.body.Number || inquire.Number;
        inquire.Email = request.body.Email || inquire.Email;
        inquire.ServiceType = request.body.ServiceType || inquire.ServiceType;
        inquire.VehicleNumber = request.body.VehicleNumber || inquire.VehicleNumber;
        inquire.Message = request.body.Message || inquire.Message;
        
        // Save the updated inquire item
        await inquire.save();

        // Sending a success response
        return response.status(200).json({ message: 'inquire updated successfully', data: inquire });

    } catch (error) {
        // Handling errors and sending an error response
        console.error(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Route for deleting a inquire item by ID
router.delete('/:id', async(request, response) => {
    try {
        // Extracting the menu item ID from the request parameters
        const { id } = request.params;

        // Attempting to delete the menu item from the database
        await Inquire.findByIdAndDelete(id);

        // Sending a success response
        return response.status(200).json({ message: 'inquire deleted successfully' });

    } catch (error) {
        // Handling errors and sending an error response
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Exporting the Express router
export default router;

