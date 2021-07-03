const Joi = require('joi')

module.exports.IdeaSchema = Joi.object({
    idea: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

module.exports.CommentSchema = Joi.object({
    comment: Joi.string().required()
})

module.exports.ReplySchema = Joi.object({
    reply: Joi.string().required()
})

module.exports.AnswerSchema = Joi.object({
    content: Joi.string().required()
})

module.exports.UserSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required()
    }).required()
})