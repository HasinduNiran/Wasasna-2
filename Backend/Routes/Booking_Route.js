import express from 'express';
import mongoose from 'mongoose';
import { Booking } from '../Model/Booking.js';


const router = express.Router();

// Route to save a new booking
router.post('/', async (req, res) => {
    try {
        const { Customer_Name, Vehicle_Type, Vehicle_Number, Contact_Number, Email, Booking_Date } = req.body;

        if (!Customer_Name || !Vehicle_Type || !Vehicle_Number || !Contact_Number || !Email) {
            return res.status(400).send({ message: 'Please provide all required fields' });
        }

        const bookingDate = new Date(Booking_Date);
       
        

        const bookingsCount = await Booking.countDocuments({ Booking_Date: bookingDate });

       

        const newBooking = {
            cusID: req.body.cusID,
            Booking_Date: req.body.Booking_Date,
            Customer_Name: req.body.Customer_Name,
            Vehicle_Type: req.body.Vehicle_Type,
            Vehicle_Number: req.body.Vehicle_Number,
            Contact_Number: req.body.Contact_Number,
            Email: req.body.Email,
            selectedPackage: req.body.selectedPackage,
            selectedServices: req.body.selectedServices,
            status: req.body.status || 'Pending'
        };

        const booking = await Booking.create(newBooking);

        // Add email sending logic here if needed
        // sendBookingConfirmationEmail(req.body.Email, req.body);

        res.status(201).send(booking);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.status(200).json(bookings);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to get a booking by ID or cusID
router.get('/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;

        if (mongoose.Types.ObjectId.isValid(identifier)) {
            const bookingByID = await Booking.findById(identifier);
            if (bookingByID) {
                return res.status(200).json(bookingByID);
            }
        }

        const bookingByCUSID = await Booking.find({ cusID: identifier });
        if (bookingByCUSID.length > 0) {
            return res.status(200).json(bookingByCUSID);
        }

        res.status(404).json({ message: 'Booking not found' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching booking: ' + error.message });
    }
});

// Route to update a booking
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body.Customer_Name || !req.body.Vehicle_Type || !req.body.Vehicle_Number || !req.body.Contact_Number || !req.body.Email) {
            return res.status(400).send({ message: 'Please provide all required fields' });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).send({ message: 'Booking updated successfully', updatedBooking });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to delete a booking
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).send({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).send({ message: 'Please provide a valid status' });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).send({ message: 'Booking status updated successfully', updatedBooking });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});


export default router;
