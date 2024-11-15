import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
  sensorType: {
    type: String,
    required: true,
  },
  metric: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const SensorData = mongoose.model("SensorData", sensorSchema);

export default SensorData;
