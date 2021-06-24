const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/catchAsync')
const IdeaModel = require('../models/ideaModel')
const CommentModel = require('../models/commentModel')
const ReplyModel = require('../models/replyModel')
const AnswerModel = require("../models/answerModel")

const { isLoggedIn, validateAnswer, isAnswerAuthor } = require('../middleware')

router.get('/', (req, res) => {
    res.redirect('/')
})

router.post('/', isLoggedIn, validateAnswer, catchAsync(async (req, res) => {
    const idea = await IdeaModel.findById(req.params.id)
    const answer = new AnswerModel({ content: req.body.content })
    answer.author = req.user._id
    idea.answer.push(answer)
    await answer.save()
    await idea.save()
    req.flash('success', 'created a new answer!')
    res.redirect(`/${idea._id}`)
}))

router.delete('/:answerId', isLoggedIn, isAnswerAuthor, catchAsync(async (req, res) => {                   //delete comment
    const { id, answerId } = req.params
    await IdeaModel.findByIdAndUpdate(id, { $pull: { answer: answerId } })
    await AnswerModel.findByIdAndDelete(answerId)
    req.flash('success', 'successfully deleted answer')
    res.redirect(`/${id}`)
}))



module.exports = router