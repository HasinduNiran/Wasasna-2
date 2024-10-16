import express from 'express';
import { EmployeeAttendence } from '../Model/EmployeeAttendence.js';


const router = express.Router();

// Route to Save a new EmployeeAttendence
router.post('/', async (req, res) => {
  try {
    const { EmpID, employeeName, date, InTime, OutTime, WorkingHours, OThours } = req.body;

    if (!EmpID || !employeeName || !date) {
      return res.status(400).send({
        message: 'Send all required fields: EmpID, employeeName, date',
      });
    }

    const newEmployeeAttendence = new EmployeeAttendence({
      EmpID,
      employeeName,
      date,
      InTime: InTime || null,
      OutTime: OutTime || null,
      WorkingHours: WorkingHours || null,
      OThours: OThours || null,
    });

    const employeeAttendence = await newEmployeeAttendence.save();
    res.status(201).send(employeeAttendence);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route to Get All EmployeeAttendence
router.get('/', async (req, res) => {
  try {
    const employeesattendence = await EmployeeAttendence.find({});
    res.status(200).json({ count: employeesattendence.length, data: employeesattendence });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route to Get One EmployeeAttendence by ID
router.get('/:id', async (req, res) => {
  try {
    const employeeAttendence = await EmployeeAttendence.findById(req.params.id);
    if (!employeeAttendence) return res.status(404).send({ message: 'Attendance record not found' });
    res.status(200).json(employeeAttendence);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route to Update an EmployeeAttendence
router.put('/:id', async (req, res) => {
  try {
    const existingAttendance = await EmployeeAttendence.findById(req.params.id);
    if (!existingAttendance) return res.status(404).send({ message: 'Attendance record not found' });

    Object.assign(existingAttendance, req.body); // Update with provided fields

    const updatedAttendance = await existingAttendance.save();
    res.status(200).send(updatedAttendance);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route to Delete an EmployeeAttendence
router.delete('/:id', async (req, res) => {
  try {
    const result = await EmployeeAttendence.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ message: 'Attendance record not found' });
    res.status(200).send({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for searching, pagination, and sorting EmployeeAttendence
router.get("/searchEmployeeAttendence", async (req, res) => {
  try {
    const { page = 1, limit = 7, search = "", sort = "EmpID" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Ensure sort field is valid
    const sortField = ["EmpID", "employeeName", "date", "InTime", "OutTime", "WorkingHours", "OThours"].includes(sort) ? sort : "EmpID";

    const query = {
      $or: [
        { EmpID: { $regex: new RegExp(search, 'i') } },
        { employeeName: { $regex: new RegExp(search, 'i') } },
        { date: { $regex: new RegExp(search, 'i') } },
        { InTime: { $regex: new RegExp(search, 'i') } },
        { OutTime: { $regex: new RegExp(search, 'i') } },
        { WorkingHours: { $regex: new RegExp(search, 'i') } },
        { OThours: { $regex: new RegExp(search, 'i') } },
      ],
    };

    const employeesAttendence = await EmployeeAttendence.find(query)
      .sort({ [sortField]: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({ count: employeesAttendence.length, data: employeesAttendence });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

export default router;
