const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// db connection
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB connected!!!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// middlewares

app.use(bodyParser.json());

// cors error handler
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
} else {
  app.use(cors());
}

// Error Handler
app.use(() => {
  const error = new HttpError("page not found!", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    // when headers already sent, we can't output a error. because response already sent. so just return next
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ error: error.message || "An unknown error occurred !!" });
  return next();
});

// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
