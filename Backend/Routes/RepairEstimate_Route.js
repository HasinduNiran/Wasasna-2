import express, { request } from "express";
import mongoose from "mongoose";
import { RepairEstimate } from "../Model/RepairEstimate.js";

const router = express.Router();

// Route to save a new RepairEstimate
router.post("/add", async (req, res) => {
  try {
    const repairEstimate = new RepairEstimate(req.body);
    await repairEstimate.save();

    return res.status(201).send({
      sucess: true,
      message: "Repair Estimate Successfully Created",
      repairEstimate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      sucess: false,
      message: error,
      error,
    });
  }
});

// Route to get RepairEstimateLogs
router.get("/", async (req, res) => {
  try {
    const repairEstimates = await RepairEstimate.find({});
    res.status(200).json(repairEstimates);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route to get a Repair Estimate Log by ID
router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      const repairEstimate = await RepairEstimate.findById(identifier);
      if (repairEstimate) {
        return res.status(200).json(repairEstimate);
      }
    }

    res.status(404).json({ message: "Booking not found" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error fetching booking: " + error.message });
  }
});

router.delete("/del/:id", async (req, res) => {
  try {
    const deleteRepairEstLog = await RepairEstimate.findByIdAndDelete(
      req.params.id
    );

    if (!deleteRepairEstLog) {
      return res.status(404).json({ message: "Est log not found" });
    }
    res.status(200).send({ message: "Est log deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.put("/upd/:id", async (req, res) => {
  try {
    const status = req.body;
    // console.log(status);
    const updatedEstimate = await RepairEstimate.findByIdAndUpdate(
      req.params.id,
      status, // Updated data
      { new: true } // Return updated document
    );

    if (!updatedEstimate) {
      return res.status(404).json({
        success: false,
        message: "Repair Estimate Log not found",
        transactionID,
      });
    }

    res.status(200).json({ success: true, data: updatedEstimate });
  } catch (error) {
    console.error("Error updating Repair Estimate Log:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      transactionID,
    });
  }
});

export default router;
