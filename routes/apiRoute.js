///////////////////////// address start with "/api" ///////////////
const express = require('express')
const CommentModel = require('../models/commentModel')
const router = express.Router({ mergeParams: true })
const IdeaModel = require('../models/ideaModel')

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
            const resultArray = await model.find(
                // { $text: { $search: keyword } },
                // { score: { $meta: "textScore" } }
                // { title: { "$regex": keyword, $options: "i" } }
                {"$or": [
                    { title: { '$regex': keyword, '$options': 'i' } },
                    { description: { '$regex': keyword, '$options': 'i' } }
                ]}
            )
            console.log(resultArray)
            // ).sort({ score: { $meta: "textScore" } }).populate('author')

            results.result = await model.find(
                // { title: { "$regex": keyword, $options: "i" } }
                {"$or": [
                    { title: { '$regex': keyword, '$options': 'i' } },
                    { description: { '$regex': keyword, '$options': 'i' } }
                ]}
            ).populate('author').limit(limit).skip(startIndex).exec()
            //     { $text: { $search: keyword } },
            //     { score: { $meta: "textScore" } }
            // ).sort({ score: { $meta: "textScore" } }).populate('author').limit(limit).skip(startIndex).exec()

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
    return res.json({commentId:comment._id})
})

router.get('/paginatedComment', paginatedComments(CommentModel), (req, res) => {
    return res.json(res.paginatedComments)
})

module.exports = router