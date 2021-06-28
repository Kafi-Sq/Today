const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const Post = require('./models/posts')
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


app.get('/home', async (req, res) => {
    const post = await Post.find({})
    res.render('index', { post })
})

app.post('/home', async (req, res) => {
    const post = await new Post(req.body)
    await post.save()
    res.redirect('/home')
})

app.get('/home/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('details', { post })
})

app.delete('/home/:id', async (req, res) => {
    const {id} = req.params
    const post = await Post.findByIdAndDelete(id)
    res.redirect('/home')
})

app.listen(8080, () => {
    console.log('Listening on port: 8080')
})