import express from 'express';
import { Repair } from '../Model/Repair.js';

const router = express.Router();

// Route for saving new repair
router.post('/', async (req, res) => {
    try {
        const repair = new Repair(req.body);
        await repair.save();
        res.status(201).json(repair);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route for getting all repairs
router.get('/', async (req, res) => {
    try {
        const repairs = await Repair.find();
        res.json(repairs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route for getting repair by id
router.get('/:id', getRepair, (req, res) => {
    res.json(res.repair);
});

// Route for updating repair by id
router.put('/:id', getRepair, async (req, res) => {
    if (req.body.repairStatus) {
        res.repair.repairStatus = req.body.repairStatus;
    }
    if (req.body.repairDescription) {
        res.repair.repairDescription = req.body.repairDescription;
    }
    if (req.body.customerName) {
        res.repair.customerName = req.body.customerName;
    }
    if (req.body.customerEmail) {
        res.repair.customerEmail = req.body.customerEmail;
    }
    if (req.body.customerPhone) {
        res.repair.customerPhone = req.body.customerPhone;
    }
    if (req.body.vehicleMake) {
        res.repair.vehicleMake = req.body.vehicleMake;
    }
    if (req.body.vehicleModel) {
        res.repair.vehicleModel = req.body.vehicleModel;
    }
    if (req.body.vehicleNo) {
        res.repair.vehicleNo = req.body.vehicleNo;
    }
    if (req.body.Insuranceprovider) {
        res.repair.Insuranceprovider = req.body.Insuranceprovider;
    }
    if (req.body.Agent) {
        res.repair.Agent = req.body.Agent;
    }

    try {
        await res.repair.save();
        res.json(res.repair);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const repair = await Repair.findById(req.params.id);
        if (!repair) {
            return res.status(404).json({ message: 'Repair not found' });
        }
        // Use deleteOne or findByIdAndDelete
        await Repair.deleteOne({ _id: req.params.id });
        // Or alternatively:
        // await Repair.findByIdAndDelete(req.params.id);
        res.json({ message: 'Repair deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



export default router;

// Middleware to get repair by ID
async function getRepair(req, res, next) {
    let repair;
    try {
        repair = await Repair.findById(req.params.id);
        if (repair == null) {
            return res.status(404).json({ message: 'Cannot find repair' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.repair = repair;
    next();
}
