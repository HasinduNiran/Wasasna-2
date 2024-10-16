import mongoose from "mongoose";

const employeeAttendenceSchema = mongoose.Schema({
  EmpID: {
    type: String,
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,  // Changed from String to Date
    required: true,
  },
  InTime: {
    type: String,
  },
  OutTime: {
    type: String,
  },
  WorkingHours: {
    type: Number,
  },
  OThours: {
    type: Number,
  },
});

export const EmployeeAttendence = mongoose.model('EmployeeAttendence', employeeAttendenceSchema);
