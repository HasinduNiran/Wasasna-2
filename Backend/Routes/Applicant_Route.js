import express from 'express';

import mongoose from'mongoose';
import { Applicant } from '../Model/Applicant.js';

const router = express.Router();

// Create a new applicant
router.post('/', async (req, res) => {
    try {
        const { FirstName, LastName, Number, Email, JobType, image,cusID } = req.body;

        // Checking if all required fields are present in the request body
        if (!FirstName || !LastName || !Number || !Email || !JobType || !image) {
            return res.status(400).send({ message: 'Please provide all required fields' });
        }

        // Creating a new Applicant item with the provided data
        const newApplicant = {
            cusID: req.body.cusID,
            FirstName,
            LastName,
            Number,
            Email,
            JobType,
            image
        };

        // Adding the new Applicant item to the database
        const createdApplicant = await Applicant.create(newApplicant);

        // Sending the created Applicant item as a JSON response
        return res.status(201).send(createdApplicant);
    } catch (error) {
        // Handling errors and sending an error response
        console.error(error.message);
        return res.status(500).send({ message: 'Error creating new applicant' });
    }
});

// Get a single applicant by ID
router.get('/:identifier', getApplicant, (req, res) => {
    res.json(res.applicant);
});

async function getApplicant(req, res, next) {
    try {
        const { identifier } = req.params;

        // Check if the identifier is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            const applicant = await Applicant.findById(identifier);
            if (applicant) {
                res.applicant = applicant;
                return next();
            }
        }

        // If not an ObjectId, check for cusID
        const applicantByCUSID = await Applicant.find({ cusID: identifier });
        if (applicantByCUSID.length > 0) {
            res.applicant = applicantByCUSID;
            return next();
        }

        // If no applicant found
        return res.status(404).json({ message: 'Cannot find applicant' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


// Update an existing applicant
router.put('/:id', async (req, res) => {
    try {
        const { FirstName, LastName, Number, Email, JobType, image } = req.body;

        // Find applicant by ID
        const applicant = await Applicant.findById(req.params.id);
        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found' });
        }

        // Update the fields if they are provided
        if (FirstName != null) applicant.FirstName = FirstName;
        if (LastName != null) applicant.LastName = LastName;
        if (Number != null) applicant.Number = Number;
        if (Email != null) applicant.Email = Email;
        if (JobType != null) applicant.JobType = JobType;
        if (image != null) applicant.image = image;

        const updatedApplicant = await applicant.save();
        res.json(updatedApplicant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all applicants
router.get('/', async (req, res) => {
    try {
        const applicants = await Applicant.find();
        res.json(applicants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete an applicant
router.delete('/:id', async (req, res) => {
    try {
        const applicant = await Applicant.findByIdAndDelete(req.params.id);
        if (!applicant) {
            return res.status(404).json({ message: 'Cannot find applicant' });
        }
        res.json({ message: 'Applicant deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
