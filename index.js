const express = require("express");
const http = require("http");
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const router = require("./routers/patient/index_router");
const routerAdmin = require('./routers/doctor/index_router');
const database = require("./config/database");
const PORT = process.env.PORT;
const bodyParser = require("body-parser");
const cors = require("cors");
const { initSocketIO } = require("./socket-io.js");

const app = express();
const server = http.createServer(app);
initSocketIO(server);

const client = require("./mqttClient.js");

// Ket noi CSDL
database.connect();

// Cấu hình Express

app.use(express.static("public"));
app.use(express.json());
app.set("views", `${__dirname}/views`);
app.use(express.static("public"));
app.set("view engine", "pug");
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// end body-parser

//cors
app.use(cors());
//end cors

// flash
app.use(cookieParser("123"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// end flash

router(app);
routerAdmin(app);

// Start server

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
