const express = require("express")
const app = express()
const methodOverride = require("method-override")
const path = require("path")
const mongoose = require("mongoose")
const IdeaModel = require('./models/ideaModel')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const { ideaSchema } = require('./JoiSchemas')

mongoose.connect('mongodb://localhost:27017/IdeaV1', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection open")
    })
    .catch(err => {
        console.log("no")
        console.log(err)
    })
mongoose.set('useFindAndModify', false);

mongoose.connection.on("error", console.error.bind(console, "connection error:"))
mongoose.connection.once("open", () => {
    console.log("Datebase connected")
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.engine('ejs', ejsMate)



const validateIdea = (req, res, next) => {
    const { error } = ideaSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

app.get('/', catchAsync(async (req, res) => {
    const ideas = await IdeaModel.find({})
    res.render("ideas/index", { ideas })
}))

app.get('/new', (req, res) => {
    res.render('ideas/new')
})

app.post('/', validateIdea, catchAsync(async (req, res) => {
    const newIdea = new IdeaModel(req.body.idea)
    await newIdea.save()
    res.redirect('/')
}))

app.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const idea = await IdeaModel.findById(id)
    console.log(idea)
    res.render("ideas/show", { idea })
}))

app.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params
    const idea = await IdeaModel.findById(id)
    console.log(idea)
    res.render("ideas/edit", { idea })
}))

app.patch('/:id', validateIdea, catchAsync(async (req, res) => {
    const { id } = req.params
    const updatedIdea = req.body.idea
    await IdeaModel.findByIdAndUpdate(id, { title: updatedIdea.title, description: updatedIdea.description })
    res.redirect(`/${id}`)
}))

app.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const idea = await IdeaModel.findByIdAndDelete(id);
    res.redirect('/');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) { err.message = 'something went wrong!' }
    res.status(statusCode).render('error', { err })
})



app.listen(3000, () => {
    console.log("port 3000 listening!")
})