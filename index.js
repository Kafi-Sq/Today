const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const Post = require('./models/posts')
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')
const Quote = require('inspirational-quotes');
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/post-app', {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
})
mongoose.connection
    .once('open', () => {
        console.log('Database Connected')
    })
    .on('error', (err) => {
        console.log(err)
    })

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))


app.get('/home', catchAsync(async (req, res) => {
    const post = await Post.find({})
    res.render('index', { post })
}))

app.post('/home', catchAsync(async (req, res) => {
    // throw new ExpressError('Something went wrong')
    const post = await new Post(req.body)
    await post.save()
    res.redirect('/home')
}))

app.get('/home/:id', catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('details', { post, Quote })
}))

app.delete('/home/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    const post = await Post.findByIdAndDelete(id)
    res.redirect('/home')
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    if(!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('errors', {err})
})

app.listen(8080, () => {
    console.log('Listening on port: 8080')
})