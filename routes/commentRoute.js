const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/catchAsync')
const IdeaModel = require('../models/ideaModel')
const CommentModel = require('../models/commentModel')
const { isLoggedIn, validateComment,isCommentAuthor } = require('../middleware')


router.get('/', (req, res) => {     //because when not login->comment and submit, we are asking post('/60c02e831d964f134cdbb0d9/comment') 
    res.redirect(`/`)           //but req.session.returnTo is /60c02e831d964f134cdbb0d9/comment no matter post or get 
})                              //but there's no get('/60c02e831d964f134cdbb0d9/comment'...), so I add a get route and redirect to home

router.post('/', isLoggedIn, validateComment, catchAsync(async (req, res) => {              //post new comment
    const idea = await IdeaModel.findById(req.params.id)
    const comment = new CommentModel({ commentBody: req.body.comment })
    comment.author = req.user._id
    idea.comment.push(comment)
    await comment.save()
    await idea.save()
    req.flash('success','created a new comment!')
    res.redirect(`/${idea._id}`)
}))

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(async (req, res) => {                   //delete comment
    const { id, commentId } = req.params
    await IdeaModel.findByIdAndUpdate(id, { $pull: { comment: commentId } })
    await CommentModel.findByIdAndDelete(commentId)
    req.flash('success','successfully deleted comment')
    res.redirect(`/${id}`)
}))

module.exports = router