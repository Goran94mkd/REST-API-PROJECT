var mongoose = require("mongoose");

var competitionSchema = mongoose.Schema({
  name: {
    type: String,
    required: ['Please provide the name of the competition']
  }
});

module.exports = mongoose.model("Competition", competitionSchema);
