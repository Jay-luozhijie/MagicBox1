const express = require('express')
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
            results.result = await model.find(
                { $text: { $search: keyword } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } }).populate('author').limit(limit).skip(startIndex).exec()
            res.searchResults = results
            return next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }

    }
}

// {
//     title:{
//         $regex:newRegExp(keyword)
//     }
// }

router.get('/searchIndex', searchResults(IdeaModel), (req, res) => {
    return res.json(res.searchResults)
})

router.get('/ideaIndex', paginatedResults(IdeaModel), (req, res) => {
    return res.json(res.paginatedResults)
})

module.exports = router