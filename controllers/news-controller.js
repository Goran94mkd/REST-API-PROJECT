const News = require('../models/news')
const successResponse = require('../lib/success-response-sender');
const errorResponse = require('../lib/error-response-sender');
const newsData = require('../lib/news-api/news-helper')

module.exports = {
  fetchAll: async (req, res) => {
    try {
      const news = await News.find();
      successResponse(res, 'List of all news', news);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  },
  fetchOne: async (req, res) => {
    try {
      let news = await News.findById(req.params.id);
      if (!news) errorResponse(res, 400, 'No news with the provided id')

      news = news.toObject();
      news = {
        ...news,
        news: await newsData(news.country, news.category, news.results),
      }

      successResponse(res, `News with id #${req.params.id}`, news);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  },
  create: async (req, res) => {
    try {
      const news = await News.create(req.body);
      successResponse(res, 'New news added', news);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  }
}