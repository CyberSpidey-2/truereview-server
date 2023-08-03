const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const errorHandler = require("./middleware/error");

// importing routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const shopauthRoutes = require("./routes/shopauthRoutes");
const shopRoutes = require("./routes/shopRoutes");
const addUidRoutes = require("./routes/shopUIDRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

//database connection//////////////////
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

////////middleware declarations
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "5mb" })); // parse form data
app.use(
  bodyParser.urlencoded({
    limit: "5mb",
    extended: "true",
  })
);
app.use(cookieParser());
app.use(cors());
app.use(fileUpload());

app.use("/api", authRoutes);
app.use("/api", shopauthRoutes);
app.use("/api", userRoutes);
app.use("/api", shopRoutes);
app.use("/api", addUidRoutes);
app.use("/api", reviewRoutes);

// error middleware
app.use(errorHandler);

//port
const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log("Server running on port " + port);
});
