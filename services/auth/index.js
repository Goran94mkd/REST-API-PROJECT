const express = require("express");
const app = express();
const mongoose = require("mongoose");
const v1 = require('./routers/v1');
const usersRouter = require('./routers/users');
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
}).unless({
  path: [
    {
      url: '/api/v1/auth/login', methods: ['POST']
    },
    {
      url: '/api/v1/auth/register', methods: ['POST']
    }
  ]
}));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    errorResponse(res, 401, `You need to log in to perform this action. ${err.message}`);
  }
});

app.use('/api/v1/auth', v1);
app.use('/users', usersRouter);


app.listen("3003", (error) => {
  if (error) {
    return console.log(
      "Error happened while starting the app on port 3003: ",
      error
    );
  }
  console.log("Auth service successfully started on port 3003");
});
