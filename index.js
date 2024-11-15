const express = require('express');
const flash = require('express-flash');
// const mqtt = require('mqtt');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http').createServer(app);
require('dotenv').config();
const io = require('socket.io')(http);
const router = require('./routers/patient/index_router');
const database = require('./config/database');
const PORT = process.env.PORT;
const bodyParser = require('body-parser');
const cors = require('cors');
// const routerAdmin = require('./routers/admin/index_router');

// Thiết lập MQTT client
// const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');
// const topic = 'health/sensors';

// Ket noi CSDL
database.connect();

// Cấu hình Express

app.use(express.static('public'));
app.use(express.json());
app.set('views', `${__dirname}/views`);
app.use(express.static('public'));
app.set('view engine', 'pug');
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// end body-parser

//cors
app.use(cors());
//end cors

// flash
app.use(cookieParser("123"));
app.use(session({ cookie: {maxAge: 60000} }));
app.use(flash());
// end flash

// Xử lý kết nối MQTT
// mqttClient.on('connect', () => {
//   console.log('Connected to MQTT broker');
//   mqttClient.subscribe(topic);
// });

// mqttClient.on('message', (topic, message) => {
//     try {
//         const data = JSON.parse(message.toString());
//         latestData = { ...latestData, ...data };
//         io.emit('sensorUpdate', latestData);
//     } catch (error) {
//         console.error('Error parsing MQTT message:', error);
//     }
// });

// // Socket.IO cho real-time updates
// io.on('connection', (socket) => {
//   console.log('Client connected');
//   socket.emit('sensorUpdate', latestData);
// });

router(app);

// Start server

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});