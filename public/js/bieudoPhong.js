console.log(typeof chiSoPhong);
// Lấy dữ liệu cho biểu đồ
const labels = chiSoPhong.map(measure => new Date(measure.timestamp).toLocaleTimeString('vi-VN'));
const roomTemps = chiSoPhong.map(measure => measure.roomTemp);
const moisture = chiSoPhong.map(measure => measure.moisture);


// Dữ liệu biểu đồ
const dataNhietDo = {
  labels: labels,
  datasets: [{
    label: 'Nhiệt độ phòng (°C)',
    data: roomTemps,
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};

const dataDoAm = {
  labels: labels,
  datasets: [{
    label: 'Độ ẩm (%)',
    data: moisture,
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
        min: 20,
        max: 40,
        ticks: {
          stepSize: 2,
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

const config_do_am = {
  type: 'line',
  data: dataDoAm,
  options: {
    scales: {
      y: {
        min: 50,
        max: 100,
        ticks: {
          stepSize: 5,
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
  document.getElementById('bieu-do-nhiet-do'),
  config_nhiet_do
);

const bieuDoDoAm = new Chart(
  document.getElementById('bieu-do-do-am'),
  config_do_am
);