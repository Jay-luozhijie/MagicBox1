const Joi = require('joi')

module.exports.IdeaSchema = Joi.object({
    idea: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

module.exports.CommentSchema=Joi.object({
    comment:Joi.string().required()
})