const express = require("express");
const app = express();
const mongoose = require("mongoose");
const locationRouter = require('./routers/location');
const regionRouter = require('./routers/region')
const jwt = require('express-jwt');
const errorResponse = require('../../lib/error-response-sender');

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

app.use('/weather/locations', locationRouter);
app.use('/weather/regions', regionRouter)

app.listen("3004", (error) => {
  if (error) {
    return console.log(
      "Error happened while starting the app on port 3004: ",
      error
    );
  }
  console.log("Weather service successfully started on port 3004");
});
