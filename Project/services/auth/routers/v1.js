const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/auth');

router.post('/register', controller.register)
      .post('/login', controller.login)
      .get('/refresh-token', controller.refreshToken)
      .get('/users', controller.fetchAll)
      .get('/users/:id', controller.fetchOne)

module.exports = router;