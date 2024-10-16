import mongoose from "mongoose";
import express from 'express';
import { Vacancy } from '../Model/Vacancy.js';

const router = express.Router();

// Route for creating a new Vacancy
router.post('/', async (request, response) => {
    try {
        const { VacancyID, Name, Description } = request.body;
        if (!Name || !Description) {
            return response.status(400).json({ message: 'Please provide all required fields.' });
        }

        const newVacancy = { VacancyID, Name, Description };
        const vacancy = await Vacancy.create(newVacancy);
        return response.status(201).json(vacancy);
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Route for retrieving all Vacancy items from the database
router.get('/', async (request, response) => {
    try {
        const vacancies = await Vacancy.find({});
        response.status(200).json(vacancies);
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Route for retrieving a specific Vacancy by ID
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const vacancy = await Vacancy.findById(id);
        if (!vacancy) {
            return response.status(404).json({ message: 'Vacancy not found' });
        }
        response.status(200).json(vacancy);
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Route for updating an existing Vacancy by ID
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { Name, Description } = request.body;

        if (!Name || !Description) {
            return response.status(400).json({ message: 'Please provide all required fields.' });
        }

        const updatedVacancy = await Vacancy.findByIdAndUpdate(
            id,
            { Name, Description },
            { new: true, runValidators: true } // 'new' returns the updated document
        );

        if (!updatedVacancy) {
            return response.status(404).json({ message: 'Vacancy not found' });
        }

        response.status(200).json(updatedVacancy);
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Route for deleting a Vacancy by ID
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const deletedVacancy = await Vacancy.findByIdAndDelete(id);

        if (!deletedVacancy) {
            return response.status(404).json({ message: 'Vacancy not found' });
        }

        response.status(200).json({ message: 'Vacancy deleted successfully' });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: error.message });
    }
});

export default router;
