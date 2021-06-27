const express = require('express')
const router = express.Router()
const passport = require('passport')

const catchAsync = require('../utils/catchAsync')
const IdeaModel = require('../models/ideaModel')
const UserModel = require('../models/userModel')
const { isLoggedIn, isAuthor, validateIdea, validateUser } = require('../middleware')
const { findByIdAndUpdate, findById } = require('../models/ideaModel')
const ideaModel = require('../models/ideaModel')
const { response } = require('express')



////////////////////////  basic CRUD   ////////////////////////////////
router.get('/edit', isLoggedIn, catchAsync(async (req, res) => {
    const user = req.user;
    res.render('users/edit', { user });
}))

router.patch('/edit', isLoggedIn, validateUser, catchAsync(async (req, res) => {//summit edit user info  
    const id = req.user._id;
    await UserModel.findByIdAndUpdate(id, { ...req.body.user })
    req.flash('success', 'Successfully edited your profile')
    res.redirect(`/${id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {                    //userPage
    const user = await UserModel.findById(req.params.id).populate('likePost').populate('doingPost').populate('collect');
    res.render('users/userPage', { user });
}))

router.get('/:id/follower', catchAsync(async (req, res) => {
    const user = await UserModel.findById(req.params.id).populate('follower');
    res.render('users/follower', { user });
}))

router.get('/:id/following', catchAsync(async (req, res) => {
    const user = await UserModel.findById(req.params.id).populate('following');
    res.render('users/following', { user });
}))

router.post('/follow', async (req, res) => {
    const userId = req.user._id;
    const ideaId = req.cookies.ideaId;
    const user = await UserModel.findById(userId);
    const idea = await (await IdeaModel.findById(ideaId));
    const author = await UserModel.findById(idea.author);
    if (author.follower.indexOf(userId)) { }
    else {
        author.follower.push(userId);
        user.following.push(author._id);
        await UserModel.findByIdAndUpdate(userId, { ...user });
        await UserModel.findByIdAndUpdate(author._id, { ...author });
    }
})

router.post('/unfollow', async (req, res) => {
    const userId = req.user._id;
    const ideaId = req.cookies.ideaId;
    const user = await UserModel.findById(userId);
    const idea = await IdeaModel.findById(ideaId);
    const author = await UserModel.findById(idea.author);

    const followingIndex = user.following.indexOf(author._id);
    user.following.splice(followingIndex, 1);
    const followerIndex = author.follower.indexOf(userId);
    author.follower.splice(followerIndex, 1);
    await UserModel.findByIdAndUpdate(userId, { ...user });
    await UserModel.findByIdAndUpdate(author._id, { ...author });
})

module.exports = router