var mongoose = require("mongoose");

var newsSchema = mongoose.Schema({
  country: {
    type: String,
    required: ['Please provide the title of the category']
  },
  category: {
    type: String,
  },
  results: {
    type: String
  }
});

module.exports = mongoose.model("News", newsSchema);
