const axios = require('axios');

module.exports = async (lat, lon) => {
  const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=hourly,minutely,current&appid=9b5fa6d25b8720bf3aa2591a22661c04`)

  const arr = []
  res.data.daily.forEach(element => {
    const weather = {
      dt: element.dt,
      morning: element.temp.morn,
      day: element.temp.day,
      evening: element.temp.eve,
      night: element.temp.night
    }
    arr.push(weather)
  })
  return arr
}
