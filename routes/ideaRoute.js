//////////////////////////////////// address start with "/" ///////////////////////////////////////
const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const IdeaModel = require('../models/ideaModel')
const UserModel = require('../models/userModel')
const { isLoggedIn, isAuthor, validateIdea, isVerified } = require('../middleware')

const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY || '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'); //should keep in secret!!!

const crypto = require('crypto');
/////////////////   user login, register and logout   ///////////////////////////////

router.get('/register', (req, res) => {                                     //register page, asking for username, password and email
    res.render('users/register')
})




router.post('/register', async (req, res) => {
    const { email, username, password } = req.body
    const emailToken = crypto.randomBytes(64).toString('hex')
    const isVerified = false;
    const user = new UserModel({ email, username, emailToken, isVerified })

    UserModel.register(user, password, async function (err, user) {
        if (err) {
            console.log(err.message)
            req.flash("error", 'Something went wrong..')
            return res.redirect('register')
        }

        const msg = {
            from: 'magicBoxNoReply@gmail.com',
            to: user.email,
            subject: 'MagicBox - verify your email',
            text: `
                Hello, thanks for registering on our site.
                Please copy and paste the address below to verify your account.
                http://${req.headers.host}/verify-email?token=${user.emailToken}
                `,
            html: `
                <h1>Hello,</h1>
                <p>Thanks for registering on our site.</p>
                <p>Please click the link below to verify your account.</p>
                <a href="http://${req.headers.host}/verify-email?token=${user.emailToken}">Verify your account</a>
                `
        }




        try {
            await sendgrid.send(msg)
            req.flash('success', 'Thanks for registering. Please check your email to verify your account.')

            res.redirect('/');

        } catch (err) {
            console.log(err)
            req.flash('error', 'Something went wrong..')
            res.redirect('/')
        }
    })
})


// Email verification route
router.get('/verify-email', async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ emailToken: req.query.token });

        if (!user) {
            req.flash('error', 'Token is invalid. Please contact us for assistance');
            return res.redirect('/');
        }
        user.emailToken = null;
        user.isVerified = true;

        await user.save();

        await req.login(user, async (err) => {
            if (err) {
                return next(err);
            }

            req.flash('success', `Welcome to MagicBox, ${user.username}!`);
            res.redirect('/');
        })

    } catch (error) {
        console.log(error)
        req.flash('error', 'Something went wrong.')
        res.redirect('/')
    }
})


router.get('/login', (req, res) => {                    //login page, asking for username and password
    res.render('users/login')
})

router.post('/login', isVerified, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {//post login
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {                   //logout
    req.logout()
    req.flash('success', 'Goodbye!')
    res.redirect('/')
})


////////////////////////  basic CRUD   ////////////////////////////////

router.get('/', catchAsync(async (req, res) => {                     //home page
    if (req.query.keyword) {//is searching
        const keyword = req.query.keyword;
        res.render("ideas/searchIndex", { keyword: JSON.stringify(keyword) })
    } else {
        res.render("ideas/index", {})
    }
}))

router.get('/new', isLoggedIn, (req, res) => {                      //create new idea page
    res.render('ideas/new')
})

router.post('/', isLoggedIn, validateIdea, catchAsync(async (req, res) => {//post new idea 
    const newIdea = new IdeaModel(req.body.idea)
    newIdea.author = req.user._id
    await newIdea.save()
    req.flash('success', 'Successfully made a new idea!')
    res.redirect(`/${newIdea._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {         //show page
    const idea = await IdeaModel.findById(req.params.id).populate({
        path: 'comment',
        populate: [
            { path: 'author' },
            { path: 'reply', populate: [{ path: 'author' }, { path: 'replyTo' }] }
        ]
    }).populate({
        path: 'answer',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!idea) {
        req.flash('error', 'Cannot find that idea!')
        return res.redirect('/')
    }
    res.cookie("ideaId", req.params.id);
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
    req.flash('success', 'Successfully edited the idea!')
    res.redirect(`/${id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {          //delete idea
    const { id } = req.params
    const idea = await IdeaModel.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the idea!')
    res.redirect('/');
}))

router.post('/like', async (req, res) => {
    const userId = req.user._id;
    const ideaId = req.cookies.ideaId;
    const user = await UserModel.findById(userId);
    const idea = await IdeaModel.findById(ideaId);
    if (idea.upVote.indexOf(userId) === -1) {
        user.likePost.push(ideaId);
        idea.upVote.push(userId);
        await UserModel.findByIdAndUpdate(userId, { ...user });
        await IdeaModel.findByIdAndUpdate(ideaId, { ...idea });
    }
})

router.post('/cancelLike', async (req, res) => {
    const userId = req.user._id;
    const ideaId = req.cookies.ideaId;
    const user = await UserModel.findById(userId);
    const idea = await IdeaModel.findById(ideaId);

    const ideaIndex = user.likePost.indexOf(ideaId);
    user.likePost.splice(ideaIndex, 1);
    const userIndex = idea.upVote.indexOf(userId);
    idea.upVote.splice(userIndex, 1);
    await UserModel.findByIdAndUpdate(userId, { ...user });
    await IdeaModel.findByIdAndUpdate(ideaId, { ...idea });
})

router.post('/collect', async (req, res) => {
    const userId = req.user._id;
    const ideaId = req.cookies.ideaId;
    const user = await UserModel.findById(userId);
    const idea = await IdeaModel.findById(ideaId);
    if (idea.collector.indexOf(userId) === -1) {
        user.collect.push(ideaId);
        idea.collector.push(userId);
        await UserModel.findByIdAndUpdate(userId, { ...user });
        await IdeaModel.findByIdAndUpdate(ideaId, { ...idea });
    }
})

router.post('/uncollect', async (req, res) => {
    const userId = req.user._id;
    const ideaId = req.cookies.ideaId;
    const user = await UserModel.findById(userId);
    const idea = await IdeaModel.findById(ideaId);

    const ideaIndex = user.collect.indexOf(ideaId);
    user.collect.splice(ideaIndex, 1);
    const userIndex = idea.collector.indexOf(userId);
    idea.collector.splice(userIndex, 1);
    await UserModel.findByIdAndUpdate(userId, { ...user });
    await IdeaModel.findByIdAndUpdate(ideaId, { ...idea });
})

router.post('/doIt', async (req, res) => {
    const userId = req.user._id;
    const ideaId = req.cookies.ideaId;
    const user = await UserModel.findById(userId);
    const idea = await IdeaModel.findById(ideaId);
    if (idea.doer.indexOf(userId) === -1) {
        user.doingPost.push(ideaId);
        idea.doer.push(userId);
        await UserModel.findByIdAndUpdate(userId, { ...user });
        await IdeaModel.findByIdAndUpdate(ideaId, { ...idea });
    }
})

router.post('/undo', async (req, res) => {
    const userId = req.user._id;
    const ideaId = req.cookies.ideaId;
    const user = await UserModel.findById(userId);
    const idea = await IdeaModel.findById(ideaId);

    const ideaIndex = user.doingPost.indexOf(ideaId);
    user.doingPost.splice(ideaIndex, 1);
    const userIndex = idea.doer.indexOf(userId);
    idea.doer.splice(userIndex, 1);
    await UserModel.findByIdAndUpdate(userId, { ...user });
    await IdeaModel.findByIdAndUpdate(ideaId, { ...idea });
})

module.exports = router