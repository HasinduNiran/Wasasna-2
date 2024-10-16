import express from 'express';
import { EmployeeSalary } from '../Model/EmployeeSalary.js';

const router = express.Router();

// Create a new employee salary record
router.post('/', async (req, res) => {
    try {
        const employeeSalary = new EmployeeSalary(req.body);
        await employeeSalary.save();
        res.status(201).json(employeeSalary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a single employee salary record by ID
router.get('/:id', getEmployeeSalary, (req, res) => {
    res.json(res.employeeSalary);
});

async function getEmployeeSalary(req, res, next) {
    let employeeSalary;

    try {
        employeeSalary = await EmployeeSalary.findById(req.params.id);
        if (!employeeSalary) {
            return res.status(404).json({ message: 'Cannot find employee salary record' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.employeeSalary = employeeSalary;
    next();
}

// Update an existing employee salary record
router.put('/:id', getEmployeeSalary, async (req, res) => {
    if (req.body.EmpID != null) {
        res.employeeSalary.EmpID = req.body.EmpID;
    }
    if (req.body.employeeName != null) {
        res.employeeSalary.employeeName = req.body.employeeName;
    }
    if (req.body.fromDate != null) {
        res.employeeSalary.fromDate = req.body.fromDate;
    }
    if (req.body.toDate != null) {
        res.employeeSalary.toDate = req.body.toDate;
    }
    if (req.body.totalOThours != null) {
        res.employeeSalary.totalOThours = req.body.totalOThours;
    }
    if (req.body.totalOTpay != null) {
        res.employeeSalary.totalOTpay = req.body.totalOTpay;
    }
    if (req.body.BasicSalary != null) {
        res.employeeSalary.BasicSalary = req.body.BasicSalary;
    }
    if (req.body.TotalSalary != null) {
        res.employeeSalary.TotalSalary = req.body.TotalSalary;
    }

    try {
        const updatedEmployeeSalary = await res.employeeSalary.save();
        res.json(updatedEmployeeSalary);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all employee salary records
router.get('/', async (req, res) => {
    try {
        const employeeSalaries = await EmployeeSalary.find();
        res.json(employeeSalaries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete an employee salary record
router.delete('/:id', async (req, res) => {
    try {
        const employeeSalary = await EmployeeSalary.findByIdAndDelete(req.params.id);
        if (!employeeSalary) {
            return res.status(404).json({ message: 'Cannot find employee salary record' });
        }
        res.json({ message: 'Employee salary record deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
