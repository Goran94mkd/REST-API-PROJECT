const Competition = require('../models/competition')
const successResponse = require('../lib/success-response-sender');
const errorResponse = require('../lib/error-response-sender');
const footballCompetitionsData = require('../lib/football-data-api/football-competition')

module.exports = {
  fetchAll: async (req, res) => {
    try {
      const competitions = await Competition.find();
      successResponse(res, 'List of all football competitions', competitions);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  },
  fetchOne: async (req, res) => {
    try {
      let competition = await Competition.findById(req.params.id);
      if (!competition) errorResponse(res, 400, 'No competition with the provided id')

      competition = competition.toObject();
      competition = {
        ...competition,
        table: await footballCompetitionsData(competition.name),
      }

      successResponse(res, `competition with id #${req.params.id}`, competition);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  },
  create: async (req, res) => {
    try {
      const competition = await Competition.create(req.body);
      successResponse(res, 'New competition added', competition);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  }
}