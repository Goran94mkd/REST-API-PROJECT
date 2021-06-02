const axios = require('axios');

module.exports = async (full_name) => {
  const res = await axios.get(`https://www.balldontlie.io/api/v1/players?search=${full_name}`)
  
  return {
    first_name: res.data.data[0].first_name,
    last_name: res.data.data[0].last_name,
    weight: res.data.data[0].weight_pounds,
    height_feet: res.data.data[0].height_feet,
    height_inches: res.data.data[0].height_inches,
    position: res.data.data[0].position,
    team: res.data.data[0].team.full_name
  }
}
