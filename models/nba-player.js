var mongoose = require("mongoose");

var nbaPlayersSchema = mongoose.Schema({
  full_name: {
    type: String,
    required: ['Please provide the name of the city']
  }
});

module.exports = mongoose.model("BasketballPlayer", nbaPlayersSchema);