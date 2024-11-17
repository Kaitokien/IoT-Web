console.log(typeof chiSoCoThe);
// Lấy dữ liệu cho biểu đồ
const labels = chiSoCoThe.map(measure => new Date(measure.timestamp).toLocaleTimeString('vi-VN'));
const bodyTemps = chiSoCoThe.map(measure => {
  if (measure.bodyTemp < 50) {
    return measure.bodyTemp;
  } else {
    return null;
  }
});
const heartRates = chiSoCoThe.map(measure => {
  if (measure.heartBeat < 200 && measure.heartBeat >= 0) {
    return measure.heartBeat;
  } else {
    return null;
  }
});


// Dữ liệu biểu đồ
const dataNhietDo = {
  labels: labels,
  datasets: [{
    label: 'Nhiệt độ cơ thể (°C)',
    data: bodyTemps,
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};

const dataNhipTim = {
  labels: labels,
  datasets: [{
    label: 'Nhịp tim (bpm)',
    data: heartRates,
    fill: false,
    borderColor: 'rgb(255, 99, 132)',
    tension: 0.1
  }]
};

// Cấu hình biểu đồ
const config_nhiet_do = {
  type: 'line',
  data: dataNhietDo,
  options: {
    scales: {
      y: {
        min: 35,
        max: 50,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            if (Number.isInteger(value)) {
              return value;
            }
          }
        }
      }
    }
  }
};

const config_nhip_tim = {
  type: 'line',
  data: dataNhipTim,
  options: {
    scales: {
      y: {
        max: 200,
        ticks: {
          stepSize: 20,
          callback: function(value) {
            if (value % 20 == 0) {
              return value;
            }
          }
        }
      }
    }
  }
};

// Khởi tạo biểu đồ
const bieuDoNhietDo = new Chart(
  document.getElementById('bieu-do-suc-khoe'),
  config_nhiet_do
);

const bieuDoNhipTim = new Chart(
  document.getElementById('bieu-do-nhip-tim'),
  config_nhip_tim
);