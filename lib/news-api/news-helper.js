const axios = require('axios');

module.exports = async (country, category, results) => {
  const res = await axios
  .get(`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=${results}&apiKey=${process.env.NEWS_API_KEY}`)

  const array = []
  res.data.articles.forEach(element => {
    const news = {
      source: element.source.name,
      author: element.author,
      title: element.title,
      url: element.url,
      publishedAt: element.publishedAt
    }
    array.push(news)
  });
  return array
}
