import express from 'express';
import { Feedback } from '../Model/Feedback.js';

import mongoose from 'mongoose';


const router = express.Router();

// Create a new feedback
router.post('/', async (req, res) => {
    const { cusID, name, email, phone_number, employee, message, star_rating } = req.body;

    if (!name || !email || !phone_number || !employee || !message || star_rating === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const feedback = new Feedback({ cusID, name, email, phone_number, employee, message, star_rating });
        await feedback.save();
        res.status(201).json(feedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all feedback entries
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single feedback by ID
router.get('/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;

        // Check if the identifier is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            const feedbackByID = await Feedback.findById(identifier);
            if (feedbackByID) {
                return res.json(feedbackByID);
            }
        }

        // If not an ObjectId, check for cusID
        const feedbackByCUSID = await Feedback.find({ cusID: identifier });
        if (feedbackByCUSID.length > 0) {
            return res.json(feedbackByCUSID);
        }

        // If no feedback found
        return res.status(404).json({ message: 'Feedback not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Update a feedback entry
router.put('/:id', async (req, res) => {
    const { name, email, phone_number, employee, message, star_rating } = req.body;

    // Ensure that at least one field is present to update
    if (!name && !email && !phone_number && !employee && !message && star_rating === undefined) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    try {
        // Find the feedback by ID and update the fields that are present in the request body
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { name, email, phone_number, employee, message, star_rating },
            { new: true, runValidators: true } // `new: true` returns the updated document
        );

        if (!updatedFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.json(updatedFeedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Delete a feedback entry
router.delete('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        res.json({ message: 'Feedback deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
