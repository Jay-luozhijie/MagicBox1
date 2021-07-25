///////////////////////// address start with "/:id/answer" ///////////////
const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const IdeaModel = require('../models/ideaModel')
const AnswerModel = require("../models/answerModel")
const { isLoggedIn, validateAnswer, isAnswerAuthor } = require('../middleware')
const multer = require('multer')
const { storage, cloudinary } = require('../cloudinary')
const upload = multer({ storage })

router.get('/', (req, res) => {
    res.redirect('/')
})

router.post('/', isLoggedIn, upload.array('answerImage'), validateAnswer, catchAsync(async (req, res) => {
    const idea = await IdeaModel.findById(req.params.id)
    const answer = new AnswerModel({ content: req.body.answerContent })
    answer.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
    answer.author = req.user._id
    idea.answer.push(answer)
    await answer.save()
    await idea.save()
    req.flash('success', 'created a new answer!')
    res.redirect(`/${idea._id}`)
}))

router.put('/:answerId', isLoggedIn, upload.array('answerImage'), validateAnswer, catchAsync(async (req, res) => {
    const { answerId, id } = req.params
    const answer = await AnswerModel.findById(answerId)
    answer.content = req.body.answerContent
    let imgs = req.files.map(file => ({ url: file.path, filename: file.filename }))
    answer.images.push(...imgs)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await answer.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await answer.save()
    req.flash('success', 'edited the answer!')
    res.redirect(`/${id}`)
}))

router.delete('/:answerId', isLoggedIn, isAnswerAuthor, catchAsync(async (req, res) => {                   //delete comment
    const { id, answerId } = req.params
    await IdeaModel.findByIdAndUpdate(id, { $pull: { answer: answerId } })
    await AnswerModel.findByIdAndDelete(answerId)
    req.flash('success', 'successfully deleted answer')
    res.redirect(`/${id}`)
}))



module.exports = router