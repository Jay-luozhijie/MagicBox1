///////////////////////// address start with "/api" ///////////////
const express = require('express')
const CommentModel = require('../models/commentModel')
const router = express.Router({ mergeParams: true })
const IdeaModel = require('../models/ideaModel')
const AnswerModel = require('../models/answerModel')

function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const results = {}

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            results.result = await model.find({}).populate('author').limit(limit).skip(startIndex).exec()
            // for(let idea of results.result) {
            //    for(let a of idea.answer){
            //         const answer = await AnswerModel.findById(a._id)
            //         answer.idea = idea._id
            //         answer.save()
            //         console.log("answer ideaId:" + answer.idea)
            //    }
            //    console.log("ideaId:" + idea._id)
            // }
            res.paginatedResults = results
            return next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}

function searchResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const keyword = req.query.keyword
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const results = {}

        try {
            // const resultArray = await model.find(
            //     { $text: { $search: keyword } },
            //     { score: { $meta: "textScore" } }
            // ).sort({ score: { $meta: "textScore" } }).populate('author')

            // results.result = await model.find(
            //     { $text: { $search: keyword } },
            //     { score: { $meta: "textScore" } }
            // ).sort({ score: { $meta: "textScore" } }).populate('author').limit(limit).skip(startIndex).exec()

            const resultArray = await model.find({ $or: [{ title: { $regex: keyword, $options: "$i" } }, { description: { $regex: keyword, $options: "$i" } }] }).populate('author')
            results.result = await model.find({ $or: [{ title: { $regex: keyword, $options: "$i" } }, { description: { $regex: keyword, $options: "$i" } }] }).populate('author').limit(limit).skip(startIndex).exec()

            if (endIndex < resultArray.length) {
                results.next = {
                    page: page + 1,
                    limit: limit
                }
            }
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                }
            }
            res.searchResults = results
            return next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}

function paginatedComments(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const commentNum = parseInt(req.query.commentNum)
        const ideaId = req.query.ideaId
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const results = {}
        if (endIndex < commentNum) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            results.result = await model.find({ idea: ideaId }).populate('author')
                .populate({
                    path: 'reply',
                    populate: [{ path: 'author' }, { path: 'replyTo' }]
                }).limit(limit).skip(startIndex).exec()
            res.paginatedComments = results
            return next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}

function paginatedAnswerComments(answerModel, commentModel) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const answerId = req.query.answerId
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const results = {}
        try {
            const answer = await answerModel.findById(answerId)
            const commentNum = answer.comment.length
            if (endIndex < commentNum) {
                results.next = {
                    page: page + 1,
                    limit: limit
                }
            }
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                }
            }
            results.result = await commentModel.find({ answer: answerId }).populate('author', 'username')
                .populate({
                    path: 'reply',
                    populate: [{ path: 'author' }, { path: 'replyTo' }]
                }).limit(limit).skip(startIndex).exec()
            res.paginatedAnswerComments = results
            return next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}

function paginatedAnswers(ideaModel, answerModel) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const ideaId = req.query.ideaId
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const results = {}
        try {
            const idea = await ideaModel.findById(ideaId)
            const answerNum = idea.answer.length
            if (endIndex < answerNum) {
                results.next = {
                    page: page + 1,
                    limit: limit
                }
            }
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                }
            }
            results.result = await answerModel.find({ idea: ideaId })
                .populate('author', 'username')
                .limit(limit).skip(startIndex).exec()
            res.paginatedAnswers = results
            return next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}


router.get('/searchIndex', searchResults(IdeaModel), (req, res) => {
    return res.json(res.searchResults)
})

router.get('/ideaIndex', paginatedResults(IdeaModel), (req, res) => {
    return res.json(res.paginatedResults)
})

router.post('/commentForm', async (req, res) => {
    const ideaId = req.body.ideaId
    const idea = await IdeaModel.findById(ideaId)
    const comment = new CommentModel({ commentBody: req.body.commentContent })
    comment.author = req.user._id
    comment.idea = idea._id
    idea.comment.push(comment)
    await comment.save()
    await idea.save()
    return res.json({ commentId: comment._id })
})

router.get('/paginatedComment', paginatedComments(CommentModel), (req, res) => {
    return res.json(res.paginatedComments)
})

router.get('/paginatedAnswerComment', paginatedAnswerComments(AnswerModel, CommentModel), (req, res) => {
    return res.json(res.paginatedAnswerComments)
})

router.get('/paginatedAnswer', paginatedAnswers(IdeaModel, AnswerModel), (req, res) => {
    return res.json(res.paginatedAnswers)
})

module.exports = router