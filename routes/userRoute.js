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
const ExpressError = require('../utils/ExpressError')

const multer = require("multer")
const { storage } = require('../cloudinary/upload')
const upload = multer({ storage })
////////////////////////  basic CRUD   ////////////////////////////////
router.get('/edit', isLoggedIn, catchAsync(async (req, res) => {
    const user = req.user;
    res.render('users/edit', { user });
}))

router.post('/edit', isLoggedIn, upload.single('avatar'), catchAsync(async (req, res) => {
    const id = req.user._id
    const user = await UserModel.findById(id)
    const url = req.file.path
    const filename = req.file.filename
    user.avatar = { url, filename }

    await user.save()
    req.flash('success', 'Successfully uploaded your avatar!')
    res.redirect(`/user/${id}`)
}))

router.patch('/edit', isLoggedIn, validateUser, catchAsync(async (req, res) => {//summit edit user info  
    try {
        const id = req.user._id;
        const sameName = await UserModel.find({ username: req.body.user.username }).limit(1)
        const sameEmail = await UserModel.find({ email: req.body.user.email }).limit(1)

        if (sameName.length !== 0 && (String(sameName[0]._id) !== String(id))) {
            throw new ExpressError('username has already been registered', 500)
        } else if (sameEmail.length !== 0 && (String(sameEmail[0]._id) !== String(id))) {
            throw new ExpressError('email has already been registered', 500)
        } else {
            const newUser = await UserModel.findByIdAndUpdate(id, { ...req.body.user }, { new: true })
            req.logout()
            req.login(newUser, err => {                                  //after register, will auto login and direct to main page
                if (err) {
                    return next(err)
                } else {
                    req.flash('success', 'Successfully edited your profile')
                    res.redirect(`/user/${id}`)
                }
            })
        }
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/user/edit')
    }
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
    if (author.follower.indexOf(userId) != -1) { }
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
