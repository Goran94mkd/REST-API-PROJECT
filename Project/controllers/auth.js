const successResponse = require('../lib/success-response-sender');
const errorResponse = require('../lib/error-response-sender');
const { userModel } = require('../models/blog-post&user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const schedule = require('node-schedule');
const shell = require('shelljs');

module.exports = {
  register: async (req, res) => {
    try {
      if (!req.body.password || req.body.password != req.body.confirmation_password) {
        return errorResponse(res, 400, 'Bad request. Passwords do not match');
      }

      const user = await userModel.findOne({ email: req.body.email });
      if (user) {
        return errorResponse(res, 400, 'Bad request. User exists with the provided email.');
      }

      req.body.password = bcrypt.hashSync(req.body.password);

      await userModel.create(req.body);

      successResponse(res, 'User registered');
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  },
  login: async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });
      if (!user) {
        return errorResponse(res, 400, 'Bad request. User with the provided email does not exist.');
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return errorResponse(res, 401, 'Bad request. Incorrect password.');
      }

      const payload = {
        id: user._id,
        email: user.email
      }

      const token = jwt.sign(payload, '3218943205PADSOKDASI(*#$U(', {
        expiresIn: '50m'
      });

      successResponse(res, 'JWT successfully generated', token);
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  },
  refreshToken: (req, res) => {
    try {
      const payload = {
        id: req.user.id,
        email: req.user.email
      }

      const token = jwt.sign(payload, '3218943205PADSOKDASI(*#$U(', {
        expiresIn: '50m'
      });

      successResponse(res, 'JWT successfully refreshed', token);
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  },
  fetchAll: async (req, res) => {
    try {
      const user = await userModel.find()

      cron.schedule('*/30 * * * * *', () => {
        console.log('Scheduler running');
        shell.exec("node lib/cron.js")
      });

      successResponse(res, 'List of all users', user);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  },
  fetchOne: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) errorResponse(res, 400, 'No user with the provided id')

      const date = new Date('2021-05-16:40:00.000+1:30');

      const job = schedule.scheduleJob(date, function () {
        console.log('Node - Schedule: I jas si gazam');
        job.cancel()
      });

      successResponse(res, `User with id #${req.params.id}`, user);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  },
};