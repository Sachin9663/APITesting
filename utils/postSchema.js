const Joi = require('joi')

const postSchema = Joi.object({
    postData: Joi.string().min(5).required(),
    Category: Joi.string().required(),
    createdAt: Joi.date()
})

exports.validatePost = (post) => postSchema.validate(post);