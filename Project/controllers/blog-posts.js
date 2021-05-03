const {blogPostModel} = require('../models/blog-post&user')
const successResponse = require('../lib/success-response-sender');
const errorResponse = require('../lib/error-response-sender');
const mailer = require('../lib/mailer')

module.exports = {
  fetchAll: async (req, res) => {
    try {
      const blogPosts = await blogPostModel.find()
        .populate('category', 'name')
        .populate('user', ['email', 'full_name'])

      successResponse(res, 'List of all blog posts', blogPosts);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  },
  fetchOne: async (req, res) => {
    console.log(req.user);
    try {
      const blogPost = await blogPostModel.findById(req.params.id)
        .populate('category', 'name')
        .populate('user', ['email', 'full_name'])

      if (!blogPost) errorResponse(res, 400, 'No user with the provided id') 

      successResponse(res, `Post with id #${req.params.id}`, blogPost);
    } catch (error) {
      errorResponse(res, 500, error.message)
    }
  },
  create: async (req, res) => {
    try {
      const blogPost = await blogPostModel.create(req.body);

      if (blogPost) {
        mailer()
      }


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
  }
}
