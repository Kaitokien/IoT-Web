document.addEventListener('DOMContentLoaded', async () => {
  const bodyTempElement = document.getElementById('bodyTemp');
  const humidityElement = document.getElementById('humidity');
  const heartRateElement = document.getElementById('heartRate');
  const roomTempElement = document.getElementById('roomTemp');

  const fetchMeasurementData = async () => {
    try {
      // Lấy danh sách các mục dữ liệu (để lấy các sensor ID)
      const measurementResponse = await fetch('http://localhost:3000/api/measurement');
      if (!measurementResponse.ok) throw new Error('Failed to fetch measurement data');
      
      const measurements = await measurementResponse.json();

      if (measurements.length === 0) {
        console.log("No measurement data available.");
        return;
      }

      // Sử dụng mục dữ liệu mới nhất
      const latestMeasurement = measurements[0];
      const sensorIds = latestMeasurement.sensors;

      // Lấy dữ liệu từ từng sensor ID trong mục dữ liệu
      const sensorDataPromises = sensorIds.map(async (sensorId) => {
        const sensorResponse = await fetch(`http://localhost:3000/api/sensor/${sensorId}`);
        if (!sensorResponse.ok) throw new Error(`Failed to fetch data for sensor ID ${sensorId}`);
        return sensorResponse.json();
      });

      const sensorsData = await Promise.all(sensorDataPromises);
      console.log(sensorsData)
      bodyTempElement.textContent = `${sensorsData[2].value} °C`;
      roomTempElement.textContent = `${sensorsData[0].value} °C`;
      humidityElement.textContent = `${sensorsData[1].value} %`
      heartRateElement.textContent = `${sensorsData[3].value} bpm`;
      // Duyệt qua từng bản ghi cảm biến và cập nhật vào giao diện

      // sensorsData.forEach(sensor => {
      //   if (sensor.metric === 'temperature' && sensor.sensorType === 'LM35') {
      //     bodyTempElement.textContent = `${sensor.value} °C`;
      //   } else if (sensor.metric === 'temperature' && sensor.sensorType === 'DHT11') {
      //     roomTempElement.textContent = `${sensor.value} °C`;
      //   } else if (sensor.metric === 'humidity' && sensor.sensorType === 'DHT11') {
      //     humidityElement.textContent = `${sensor.value} %`;
      //   } else if (sensor.sensorType === 'Pulse Senor') {
      //     heartRateElement.textContent = `${sensor.value} bpm`;
      //   }
      // });
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  // Thiết lập cập nhật định kỳ mỗi 10 giây
  fetchMeasurementData();
  setInterval(fetchMeasurementData, 10000);
});
