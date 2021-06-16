const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/catchAsync')
const userModel = require('../models/userModel')
const CommentModel = require('../models/commentModel')
const { isLoggedIn, validateComment, isCommentAuthor } = require('../middleware')
const ideaModel = require('../models/ideaModel')


router.get('/', (req, res) => {     //because when not login->comment and submit, we are asking post('/60c02e831d964f134cdbb0d9/comment') 
    res.redirect(`/`)           //but req.session.returnTo is /60c02e831d964f134cdbb0d9/comment no matter post or get 
})                              //but there's no get('/60c02e831d964f134cdbb0d9/comment'...), so I add a get route and redirect to home

router.get('/:id', catchAsync(async (req, res) => {                    //userPage
    const { id } = req.params;
    const user = await userModel.findById(id).populate(idea).populate(likePost);
    res.render('users/mainPage', { user });
}))

module.exports = router