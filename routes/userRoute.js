const express = require('express')
const router = express.Router()
const passport = require('passport')

const catchAsync = require('../utils/catchAsync')
const IdeaModel = require('../models/ideaModel')
const UserModel = require('../models/userModel')
const { isLoggedIn, isAuthor, validateIdea } = require('../middleware')
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
router.get('/:id', catchAsync(async (req, res) => {                    //userPage
    // const user = await findById(req.params.id);
    // console.log(user);
    // res.render('users/userPage', { user });
}))

module.exports = router