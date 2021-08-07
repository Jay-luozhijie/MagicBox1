///////////////////////// address start with "/:id/answer" ///////////////
const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const IdeaModel = require('../models/ideaModel')
const AnswerModel = require("../models/answerModel")
const { isLoggedIn, validateAnswer, isAnswerAuthor, validateAnswerComment, isCommentAuthor } = require('../middleware')
const multer = require('multer')
const { storage, cloudinary } = require('../cloudinary')
const CommentModel = require('../models/commentModel')
const ReplyModel = require('../models/replyModel')
const upload = multer({ storage })

router.get('/', (req, res) => {
    res.redirect('/')
})

router.post('/', isLoggedIn, upload.array('answerImage'), validateAnswer, catchAsync(async (req, res) => {
    const idea = await IdeaModel.findById(req.params.id)
    const answer = new AnswerModel({ content: req.body.answerContent })
    answer.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
    answer.author = req.user._id
    answer.idea = idea._id
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

router.delete('/:answerId', isLoggedIn, isAnswerAuthor, catchAsync(async (req, res) => {        //delete answer
    const { id, answerId } = req.params
    await IdeaModel.findByIdAndUpdate(id, { $pull: { answer: answerId } })
    await AnswerModel.findByIdAndDelete(answerId)
    req.flash('success', 'successfully deleted answer')
    res.redirect(`/${id}`)
}))

router.post('/:answerId/comment', isLoggedIn, validateAnswerComment, catchAsync(async (req, res) => {//comment to answer
    const { answerId } = req.params
    const answer = await AnswerModel.findById(answerId)
    const comment = await new CommentModel({ commentBody: req.body.commentToAnswer })
    comment.author = req.user._id
    comment.answer = answer._id
    answer.comment.push(comment)
    await comment.save()
    await answer.save()
    return res.json({ commentId: comment._id, commentAuthor: req.user.username})
}))

router.delete('/:answerId/:commentId', isLoggedIn, isCommentAuthor, catchAsync(async (req, res) => {    //delete comment
    const { answerId, commentId } = req.params
    await AnswerModel.findByIdAndUpdate(answerId, { $pull: { comment: commentId } })
    await CommentModel.findByIdAndDelete(commentId)
    return
}))

router.delete('/:commentId/reply/:replyId', isLoggedIn, isCommentAuthor, catchAsync(async (req, res) => {   //delete reply
    const { commentId, replyId } = req.params
    await CommentModel.findByIdAndUpdate(commentId, { $pull: { reply: replyId } })
    await ReplyModel.findByIdAndDelete(replyId)
    return
}))



module.exports = router