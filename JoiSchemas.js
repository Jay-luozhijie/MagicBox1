const Joi = require('joi')

module.exports.IdeaSchema = Joi.object({
    idea: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
    deleteImages:Joi.array(),
})

module.exports.CommentSchema = Joi.object({
    comment: Joi.string().required()
})

module.exports.AnswerCommentSchema = Joi.object({
    commentToAnswer: Joi.string().required()
})

module.exports.ReplySchema = Joi.object({
    reply: Joi.string().required()
})

module.exports.AnswerSchema = Joi.object({
    answerContent: Joi.string().required(),
    deleteImages:Joi.array(),
})

module.exports.UserSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().required(),
        email: Joi.string(),
        isVerified: Joi.boolean()
    }).required()
})