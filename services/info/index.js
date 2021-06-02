const express = require("express");
const app = express();
const mongoose = require("mongoose");
const basketballRouter = require('./routers/basketball');
const footballRouter = require('./routers/football')
const newsRouter = require('./routers/news');
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

app.use('/basketball', basketballRouter);
app.use('/football', footballRouter)
app.use('/news', newsRouter)

app.listen(`${process.env.INFO_API_PORT}`, (error) => {
  if (error) {
    return console.log(
      `Error happened while starting the app on port ${process.env.INFO_API_PORT}: `,
      error
    );
  }
  console.log(`Info service successfully started on port ${process.env.INFO_API_PORT}`);
});
