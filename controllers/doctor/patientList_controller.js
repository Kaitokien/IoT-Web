const Patient = require('../../models/patient_model');
const Measurement = require('../../models/Measurement');
const SensorData = require('../../models/SensorData');

module.exports.list = async (req, res) => {
  const patients = await Patient.find({});
  // console.log(patients);
  res.render('doctor/pages/patientList/index', {
    patients: patients
  })
}

module.exports.history = async (req, res) => {
  // console.log(req.params.id);
  const patient = await Patient.findOne({ _id: req.params.id });
  const measurementList = patient.measurement;
  let Metrics = [];
  for (let measurement of measurementList) {
    // let data = await SensorData.find({_id: ms.id});
    let measurementData = await Measurement.findById(measurement);
    let roomTemp = await SensorData.findById(measurementData.sensors[0]);
    let moisture = await SensorData.findById(measurementData.sensors[1]);
    let bodyTemp = await SensorData.findById(measurementData.sensors[2]);
    let heartBeat = await SensorData.findById(measurementData.sensors[3]);
    Metrics.push({
      timestamp: measurementData.timestamp,
      roomTemp: roomTemp,
      moisture: moisture,
      bodyTemp: bodyTemp.value,
      heartBeat: heartBeat.value,
    });
  }
  // console.log(humanMetrics);
  res.render("doctor/pages/patientList/history", {
    Metrics: Metrics,
    patient: patient
  });
}