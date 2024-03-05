require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const app = express();

// all middlewares & configurations here
app.use(logger("dev"));
app.use(express.static("public"));

// below two configurations will help express routes at correctly receiving data. 
app.use(express.json()); // recognize an incoming Request Object as a JSON Object
app.use(express.urlencoded({ extended: false })); // recognize an incoming Request Object as a string or array

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: [FRONTEND_URL]
  })
);


// all routes here...
app.get("/", (req, res, next) => {
  res.json({ message: "all good here!" })
})


// server listen & PORT
const PORT = process.env.PORT || 5005

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});