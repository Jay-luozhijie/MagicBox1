const { IdeaSchema, CommentSchema, UserSchema, ReplySchema, AnswerSchema } = require('./JoiSchemas')
const ExpressError = require('./utils/ExpressError')
const IdeaModel = require('./models/ideaModel')
const CommentModel = require('./models/commentModel')
const ReplyModel = require('./models/replyModel')
const AnswerModel = require('./models/answerModel')
const UserModel = require('./models/userModel')

module.exports.isLoggedIn = (req, res, next) => {             //require the user to login before proceed
    if (!req.isAuthenticated()) {                             //not logged in now
        req.session.returnTo = req.originalUrl                //remember current address so as to redirect to here after logging in
        req.flash('error', 'You mush be signed in first!')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateIdea = (req, res, next) => {
    const { error } = IdeaSchema.validate(req.body)         //joi idea schema
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {         //is idea's author
    const { id } = req.params
    const idea = await IdeaModel.findById(id)
    if (!idea.author.equals(req.user._id)) {
        req.flash('error', "you are not this idea's author")
        return res.redirect(`/${id}`)
    }
    next()
}

module.exports.validateComment = (req, res, next) => {      //joi comment schema
    const { error } = CommentSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateReply = (req, res, next) => {        //joi reply schema
    const { error } = ReplySchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params
    const comment = await CommentModel.findById(commentId)
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', "you are not this comment's author")
        return res.redirect(`/${id}`)
    }
    next()
}

module.exports.isReplyAuthor = async (req, res, next) => {
    const { id, replyId } = req.params
    const reply = await ReplyModel.findById(replyId)
    if (!reply.author.equals(req.user._id)) {
        req.flash('error', "you are not this reply's author")
        return res.redirect(`/${id}`)
    }
    next()
}

module.exports.validateAnswer = (req, res, next) => {
    const { error } = AnswerSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateUser = (req, res, next) => {
    const { error } = UserSchema.validate(req.body)         //查joi user schema 是否通过
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAnswerAuthor = async (req, res, next) => {       //看是否为此comment的作者
    const { id, answerId } = req.params
    const answer = await AnswerModel.findById(answerId)
    if (!answer.author.equals(req.user._id)) {
        req.flash('error', "you are not this answer's author")
        return res.redirect(`/${id}`)
    }
    next()
}

module.exports.isVerified = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ username: req.body.username })
        if (user.isVerified) return next();

        req.flash('error', 'Your account has not been verified. Please check your email to verify your account')
        return res.redirect('/')
    } catch (e) {
        console.log(e)
        req.flash('error', 'Something went wrong. Please contact us for assistance.')
        res.redirect('/')
    }
}