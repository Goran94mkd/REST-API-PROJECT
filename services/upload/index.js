const express = require("express");
const app = express();
const mongoose = require("mongoose");
const uploadRouter = require('./routers/upload');
const jwt = require('express-jwt');
const errorResponse = require('../../lib/error-response-sender');

require('dotenv').config()

app.use(express.json());

mongoose.connect("mongodb://localhost/ws-gen-11-project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(jwt({
  secret: '3218943205PADSOKDASI(*#$U(',
  algorithms: ['HS256']
}));

app.use((err, req, res, next) => {
  console.log(err, err.name, err.name === 'UnauthorizedError')
  if (err.name === 'UnauthorizedError') {
    errorResponse(res, 401, 'You need to log in to perform this action');
  }
})

app.use('/upload', uploadRouter);

app.listen(`${process.env.UPLOAD_API_PORT}`, (error) => {
  if (error) {
    return console.log(
      `Error happened while starting the app on port ${process.env.UPLOAD_API_PORT}: `,
      error
    );
  }
  console.log(`Upload service successfully started on port ${process.env.UPLOAD_API_PORT}`);
});
