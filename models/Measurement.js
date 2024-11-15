import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  sensors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SensorData",
    },
  ],
});

const Measurement = mongoose.model("Measurement", measurementSchema);
export default Measurement;
