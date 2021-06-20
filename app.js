const express = require("express")
const app = express()
const methodOverride = require("method-override")
const path = require("path")
const mongoose = require("mongoose")
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const ExpressError = require('./utils/ExpressError')
const ideaRoute = require('./routes/ideaRoute')
const userRoute = require('./routes/userRoute')
const commentRoute = require('./routes/commentRoute')
const apiRoute=require("./routes/apiRoute")
const UserModel = require('./models/userModel')

const cookieParser = require('cookie-parser');



mongoose.connect('mongodb://localhost:27017/IdeaV1', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection open")
    })
    .catch(err => {
        console.log("no")
        console.log(err)
    })
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.connection.on("error", console.error.bind(console, "connection error:"))
mongoose.connection.once("open", () => {
    console.log("Datebase connected")
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(cookieParser());

const sessionConfig = {
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,          //cookie infomation expires in 7 days 
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(UserModel.authenticate()))
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/user', userRoute)                                  //to  /routes/userRoute.js
app.use('/', ideaRoute)                                          //to  /routes/ideaRoute.js
app.use('/:id/comment', commentRoute)                            //to  /routes/commentRoute.js
app.use('/api',apiRoute)

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404))                 //if all address above can't match, this page can't find, give error
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) { err.message = 'something went wrong!' }     //catch error in the end if there is
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("port 3000 listening!")
})