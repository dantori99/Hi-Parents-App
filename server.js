require("dotenv").config();
const express = require("express"); // import express
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const http = require("http");
const cron = require("./cron");
const socket = require("socket.io");

// import routes
const users = require("./routes/users");
const appointments = require("./routes/appointments");
const parents = require("./routes/parents");
const children = require("./routes/children");
const nannies = require("./routes/nannies");
const activity = require("./routes/appointment_activities");

const errorHandler = require("./middlewares/errorHandlers/index");

const app = express();
const server = http.createServer(app);

cloudinary.config({
  cloud_name: "dantori99",
  api_key: "724822575738117",
  api_secret: "DzMiYD5cx2gK80xWbNFgfad7Ha8",
});

// enable req.body (json and urlencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- CORS setting
const corsOptions = {
  origin: "*",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Content-Length",
    "X-Requested-With",
    "Accept",
  ],
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Enable req.body (form-data)
app.use(fileUpload());

app.use(express.static("public"));

// make routes
app.use("/users", users);
app.use("/appointments", appointments);
app.use("/parents", parents);
app.use("/children", children);
app.use("/nannies", nannies);
app.use("/activity", activity);

app.all("*", function (req, res) {
  res.status(404);
  res.end(JSON.stringify({ message: "Endpoint does not exist" }));
});

app.use(errorHandler);

// cron();

const io = socket(server, {
  cors: corsOptions,
});

// run the server
const port = process.env.PORT || 3000; // define port
server.listen(port, () => console.log(`Server running on port ${port}...`));

module.exports.io = io;
