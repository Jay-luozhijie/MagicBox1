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




/////////////////   user login, register and logout   ///////////////////////////////

router.get('/register', (req, res) => {                 //register page, asking for username, password and email
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {//post register
    try {
        const { email, username, password } = req.body
        const user = new UserModel({ email, username })
        const registeredUser = await UserModel.register(user, password)     //create a new user
        req.login(registeredUser, err => {                                  //after register, will auto login and direct to main page
            if (err) {
                return next(err)
            } else {
                req.flash('success', 'Welcome')
                res.redirect('/')
            }
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {                    //login page, asking for username and password
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {//post login
    req.flash('success', 'welcome back')
    const redirectUrl = req.session.returnTo || '/'     //如果不在home page中,没Login又点了要login的页面login后会redirect到开始的页面而不是主页
    delete req.session.returnTo                         //比如如果现在没login又在show page中点edit会redirect到login上，login后不会redirect到
    res.redirect(redirectUrl)                           //home 而是到开始的show page

})

router.get('/logout', (req, res) => {                   //logout
    req.logout()
    req.flash('success', 'Goodbye!')
    res.redirect('/')
})


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
    const user = await UserModel.findById(req.params.id).populate('following').populate('follower');
    console.log(user);
    res.render('users/follower', { user });
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