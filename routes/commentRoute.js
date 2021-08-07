/////////////////// address start with "/:id/comment" /////////////////
const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const IdeaModel = require('../models/ideaModel')
const CommentModel = require('../models/commentModel')
const ReplyModel = require('../models/replyModel')
const { isLoggedIn, validateComment, validateReply, isCommentAuthor, isReplyAuthor } = require('../middleware')

router.get('/', (req, res) => {     //because when not login->comment and submit, we are asking post('/60c02e831d964f134cdbb0d9/comment') 
    res.redirect(`/`)               //but req.session.returnTo is /60c02e831d964f134cdbb0d9/comment no matter post or get 
})                                  //but there's no get('/60c02e831d964f134cdbb0d9/comment'...), so I add a get route and redirect to home

router.post('/', isLoggedIn, validateComment, catchAsync(async (req, res) => {              //post new comment
    const idea = await IdeaModel.findById(req.params.id)
    const comment = new CommentModel({ commentBody: req.body.commentContent })
    comment.author = req.user._id
    idea.comment.push(comment)
    comment.idea = idea._id
    await comment.save()
    await idea.save()
    req.flash('success', 'created a new comment!')
    res.redirect(`/${idea._id}`)
}))

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(async (req, res) => {                   //delete comment
    const { id, commentId } = req.params
    await IdeaModel.findByIdAndUpdate(id, { $pull: { comment: commentId } })
    await CommentModel.findByIdAndDelete(commentId)
    return
}))

router.post('/:commentId/reply', isLoggedIn, validateReply, catchAsync(async (req, res) => {//req.body: {reply: 'xxx'} reply to comment
    const comment = await CommentModel.findById(req.params.commentId).populate('author')
    const reply = new ReplyModel({
        replyTo: comment.author,
        replyBody: req.body.reply,
    })
    reply.author = req.user._id
    comment.reply.push(reply)
    await reply.save()
    await comment.save()
    return res.json({
        replyId:reply._id,
        commentAuthor:comment.author.username,
    })
    
}))

router.post('/:commentId/reply/:replyId',isLoggedIn, validateReply, catchAsync(async (req, res) => {//req.body: {reply: 'xxx'} reply to reply
    let oldReply = await ReplyModel.findById(req.params.replyId).populate('author','username')
    const comment = await CommentModel.findById(req.params.commentId)
    const newReply = new ReplyModel({
        replyTo: oldReply.author,
        replyBody: req.body.reply,
    })
    newReply.author = req.user._id
    comment.reply.push(newReply)
    await newReply.save()
    await comment.save()
    return res.json({
        newReplyId:newReply._id,
        userRepliedTo:oldReply.author.username,
        commentId:comment._id,
    })
}))

router.delete('/:commentId/reply/:replyId', isLoggedIn, isReplyAuthor, catchAsync(async (req, res) => {//delete reply's reply
    const { commentId, replyId } = req.params
    await CommentModel.findByIdAndUpdate(commentId, { $pull: { reply: replyId } })
    await ReplyModel.findByIdAndDelete(replyId)
    return
}))

module.exports = router