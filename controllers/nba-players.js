const Player = require('../models/nba-player')
const successResponse = require('../lib/success-response-sender');
const errorResponse = require('../lib/error-response-sender');
const playersData = require('../lib/ball-dont-lie-api/players')

module.exports = {
  fetchAll: async (req, res) => {
    try {
      const players = await Player.find();
      successResponse(res, 'List of all players', players);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  },
  fetchOne: async (req, res) => {
    try {
      let player = await Player.findById(req.params.id);
      if (!player) errorResponse(res, 400, 'No player with the provided id')

      player = player.toObject();
      player = {
        ...player,
        player: await playersData(player.full_name),
      }

      successResponse(res, `Player with id #${req.params.id}`, player);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  },
  create: async (req, res) => {
    try {
      const player = await Player.create(req.body);
      successResponse(res, 'New player added', player);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  }
}