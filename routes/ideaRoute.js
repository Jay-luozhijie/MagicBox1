const express = require('express')
const router = express.Router()
const passport = require('passport')

const catchAsync = require('../utils/catchAsync')
const IdeaModel = require('../models/ideaModel')
const UserModel = require('../models/userModel')
const { isLoggedIn, isAuthor, validateIdea } = require('../middleware')
const { findByIdAndUpdate } = require('../models/ideaModel')
const ideaModel = require('../models/ideaModel')



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

router.get('/', catchAsync(async (req, res) => {        //index page
    const ideas = await IdeaModel.find({}).populate('author')
    console.log(ideas)
    res.render("ideas/index", { ideas })
}))

router.get('/new', isLoggedIn, (req, res) => {                      //create new idea page
    res.render('ideas/new')
})

router.post('/', isLoggedIn, validateIdea, catchAsync(async (req, res) => {//post new idea 
    const newIdea = new IdeaModel(req.body.idea)
    newIdea.author = req.user._id
    await newIdea.save()
    req.flash('success', 'Successfully made a new idea')
    res.redirect(`/${newIdea._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {         //show page
    const idea = await IdeaModel.findById(req.params.id).populate({
        path: 'comment',
        populate: {
            path: 'author',
        }
    }).populate('author')
    console.log(idea)
    if (!idea) {
        req.flash('error', 'Cannot find that idea!')
        return res.redirect('/')
    }
    res.render("ideas/show", { idea })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {    //edit page
    const { id } = req.params
    const idea = await IdeaModel.findById(id)
    if (!idea) {
        req.flash('error', 'Cannot find that idea!')
        return res.redirect('/')
    }
    res.render("ideas/edit", { idea })
}))

router.patch('/:id', isLoggedIn, isAuthor, validateIdea, catchAsync(async (req, res) => {//summit edit page
    const { id } = req.params
    await IdeaModel.findByIdAndUpdate(id, { ...req.body.idea })
    req.flash('success', 'Successfully edited idea')
    res.redirect(`/${id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {          //delete idea
    const { id } = req.params
    const idea = await IdeaModel.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted idea')
    res.redirect('/');
}))

router.put('/:id', isLoggedIn, catchAsync(async (req, res) => { //if LIKE, upVote +1; else, then upVote -1
    const { id } = req.params;
    let idea = await IdeaModel.findById(id);
    let thisIdea;
    if (idea.upVote.includes(req.user._id)) { //if liked already
        idea.upVote = idea.upVote.filter(e => e !== `req.user._id`);
        req.user.likePost.filter(e => e !== `${id}`);
        thisIdea = await ideaModel.findByIdAndUpdate(id, { ...idea });
    } else {
        idea.upVote.push(req.user._id);
        req.user.likePost.push(id);
        thisIdea = await ideaModel.findByIdAndUpdate(id, { ...idea });
    }
    res.redirect(`/${thisIdea._id}`);
}))

module.exports = router