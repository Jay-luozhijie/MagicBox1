const { IdeaSchema, CommentSchema, UserSchema } = require('./JoiSchemas')
const ExpressError = require('./utils/ExpressError')
const IdeaModel = require('./models/ideaModel')
const CommentModel = require('./models/commentModel')

module.exports.isLoggedIn = (req, res, next) => {                 //require the user to login before proceed
    if (!req.isAuthenticated()) {                             //not login now
        req.session.returnTo = req.originalUrl                //记下现在所在的地址方便login后redirect回来
        req.flash('error', 'You mush be signed in first!')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateIdea = (req, res, next) => {
    const { error } = IdeaSchema.validate(req.body)         //查joi schema 是否通过
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {              //看是否为此idea的作者
    const { id } = req.params
    const idea = await IdeaModel.findById(id)
    if (!idea.author.equals(req.user._id)) {
        req.flash('error', "you are not this idea's author")
        return res.redirect(`/${id}`)
    }
    next()
}

module.exports.validateComment = (req, res, next) => {      //查joi comment schema 是否通过
    const { error } = CommentSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isCommentAuthor = async (req, res, next) => {       //看是否为此comment的作者
    const { id, commentId } = req.params
    const comment = await CommentModel.findById(commentId)
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', "you are not this comment's author")
        return res.redirect(`/${id}`)
    }
    next()
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