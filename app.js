const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
//routes
const contactsRouter = require("./api/routes/contacts.route");
//initialize app
const app = express();
app.use(cors()); //to enable CORS 'cross-origin resource sharing'
mongoose.connect("mongodb://localhost:27017/task", () => {
  console.log("connected to DB");
});
//middle wares
app.use(morgan("dev"));
app.use(express.json());
//Routes
app.use("/contacts", contactsRouter);

app.use((req, res, next) => {
  //if we reached this middleware ,it means client requesting non found page
  const error = new Error("Page not found");
  error.status = 404; //not found
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message
  });
});
module.exports = app;
