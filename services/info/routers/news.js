const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/news-controller');

router.get('/', controller.fetchAll)
      .get('/:id', controller.fetchOne)
      .post('/', controller.create)

module.exports = router;