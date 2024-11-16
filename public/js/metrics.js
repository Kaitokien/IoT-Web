const socket = io();

let sensorData;

socket.on("sensor-data", function (data) {
  sensorData = data;

  const bodyTempElement = document.getElementById("bodyTemp");
  const humidityElement = document.getElementById("humidity");
  const heartRateElement = document.getElementById("heartRate");
  const roomTempElement = document.getElementById("roomTemp");

  sensorData.forEach((sensor) => {
    if (sensor.metric === "temperature" && sensor.sensorType === "LM35") {
      bodyTempElement.textContent = `${sensor.value} °C`;
    } else if (
      sensor.metric === "temperature" &&
      sensor.sensorType === "DHT11"
    ) {
      roomTempElement.textContent = `${sensor.value} °C`;
    } else if (sensor.metric === "humidity" && sensor.sensorType === "DHT11") {
      humidityElement.textContent = `${sensor.value} %`;
    } else if (sensor.sensorType === "Pulse senor") {
      heartRateElement.textContent = `${sensor.value} bpm`;
    }
  });
});
