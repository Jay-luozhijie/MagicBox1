if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

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
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')

const ExpressError = require('./utils/ExpressError')
const ideaRoute = require('./routes/ideaRoute')
const userRoute = require('./routes/userRoute')
const commentRoute = require('./routes/commentRoute')
const apiRoute = require("./routes/apiRoute")
const answerRoute = require('./routes/answerRoute')
const UserModel = require('./models/userModel')

const multer = require('multer')
const { storage } = require('./cloudinary')
const upload = multer({ storage })

const dbUrl =  process.env.DB_URL ||'mongodb://localhost:27017/IdeaV1';               //process.env.DB_URL ||         //deploy version
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
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
app.use(express.json())

const secret =  process.env.SECRET||'thisshouldbeabettersecret!';        //process.env.SECRET||                      //deploy version

const sessionConfig = {
    name: 'session',                                                                          //deploy version
    store: MongoStore.create({
        mongoUrl: dbUrl,
        secret,
        touchAfter: 24 * 60 * 60
    }),
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //cookie infomation expires in 7 days 
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

app.use('/user', userRoute)                                      //to  /routes/userRoute.js
app.use('/', ideaRoute)                                          //to  /routes/ideaRoute.js
app.use('/:id/comment', commentRoute)                            //to  /routes/commentRoute.js
app.use('/api', apiRoute)                                        //to  /routes/apiRoute.js
app.use('/:id/answer', answerRoute)                              //to  /routes/answerRoute.js

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404))                 //if all address above can't match, this page can't find, give error
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) { err.message = 'something went wrong!' }   //catch error in the end if there is
    res.status(statusCode).render('error', { err })
})

const port =  process.env.PORT || 3000;                        //process.env.PORT ||                       //deploy version
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})