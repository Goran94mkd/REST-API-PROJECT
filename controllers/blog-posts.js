const { blogPostModel } = require('../models/blog-post&user')
const successResponse = require('../lib/success-response-sender');
const errorResponse = require('../lib/error-response-sender');
const mailer = require('../lib/mailer')
const axios = require('axios');

const getWeatherData = async (cityName) => {
  const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=9b5fa6d25b8720bf3aa2591a22661c04`)

  return {
    description: `${res.data.weather[0].main} (${res.data.weather[0].description})`,
    temp: res.data.main.temp,
    feels_like: res.data.main.feels_like,
    temp_min: res.data.main.temp_min,
    temp_max: res.data.main.temp_max
  }
}

module.exports = {
  fetchAll: async (req, res) => {
    try {
      const blogPosts = await blogPostModel.find()
        .populate('category', 'name')
        .populate('user', ['email', 'full_name'])
        .populate('city', 'name')

      successResponse(res, 'List of all blog posts', blogPosts);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  },
  fetchOne: async (req, res) => {
    try {
      let blogPost = await blogPostModel.findById(req.params.id)
        .populate('category', 'name')
        .populate('user', ['email', 'full_name'])
        .populate('city', 'name')
      
      blogPost = blogPost.toObject();
      blogPost.city = {
        ...blogPost.city,
        weather: await getWeatherData(blogPost.city.name)
      }
      if (!blogPost) errorResponse(res, 400, 'No blogpost with the provided id')

      successResponse(res, `Post with id #${req.params.id}`, blogPost);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  },
  create: async (req, res) => {
    try {
      const blogPost = await blogPostModel.create(req.body);

      if (blogPost) { mailer(req.user.email) }
      successResponse(res, 'New blog post created', blogPost);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  },
  patchUpdate: async (req, res) => {
    try {
      const blogPost = await blogPostModel.findByIdAndUpdate(req.params.id, req.body)
      successResponse(res, 'Blog post updated', blogPost);
    } catch (error) {
      errorResponse(res, 500, {
        ...req.body,
        _id: req.params.id,
        error: error.message
      })
    }
  },
  putUpdate: async (req, res) => {
    try {
      const blogPost = await blogPostModel.findOneAndReplace({ _id: req.params.id }, req.body)
      successResponse(res, 'Blog post replaced', blogPost);
    } catch (error) {
      errorResponse(res, 500, {
        ...req.body,
        _id: req.params.id,
        error: error.message
      })
    }
  },
  delete: async (req, res) => {
    try {
      await blogPostModel.remove({ _id: req.params.id });
      res.send(`BlogPost ${req.params.id} is deleted`);
    } catch (error) {
      res.send({ message: error });
    }
  },
  like: async (req, res) => {
    try {
      const post = await blogPostModel.findById(req.params.id);
      if (!post.likes.includes(req.user.id)) {
        await post.updateOne({ $push: { likes: req.user.id } });
        res.status(200).json("The post has been liked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  dislike: async (req, res) => {
    try {
      const post = await blogPostModel.findById(req.params.id);
      if (post.likes.includes(req.user.id)) {
        await post.updateOne({ $pull: { likes: req.user.id } });
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
}