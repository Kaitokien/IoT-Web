const mqtt = require("mqtt");
const dotenv = require("dotenv");
const SensorData = require("./models/SensorData");
const Measurement = require("./models/Measurement");
const { getSocketIOInstance } = require("./socket-io");
const Patient = require("./models/patient_model");

const io = getSocketIOInstance();

dotenv.config();

const options = {
  host: "2c41ea6628d949ec81f1c888f8ab3d76.s1.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: process.env.USERNAME_HIVEMQ,
  password: process.env.PASSWORD_HIVEMQ,
};

const client = mqtt.connect(options);

client.on("connect", () => {
  console.log("Connect HiveMQ Cloud successfully!");
  client.subscribe("sensor-data");
});

client.on("error", (error) => {
  console.log(error);
});

client.on("message", async (topic, message) => {
  try {
    const userId = global.userId;
    console.log(userId);
    const patient = await Patient.findOne({
      _id: userId,
    });

    console.log(patient);

    const dataList = JSON.parse(message.toString());
    console.log(dataList);
    const sensorDataList = [];
    const sensorListId = [];
    for (const data of dataList) {
      const sensorData = new SensorData({
        sensorType: data.sensorType,
        metric: data.metric,
        value: data.value.toString(),
      });
      sensorDataList.push(data);
      await sensorData.save();
      sensorListId.push(sensorData.id);
    }

    io.emit("sensor-data", sensorDataList);

    const measurement = new Measurement({
      sensors: sensorListId,
    });
    await measurement.save();
    patient.measurement.push(measurement.id);
    await patient.save();
  } catch (error) {
    console.log(error);
  }
});

module.exports.client;
