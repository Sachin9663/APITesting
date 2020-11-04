const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config()

const posts = require('./posts')
const utils = require('./utils/postSchema')

app.use(express.json());

const Port = process.env.PORT || 8080
const HOST = '0.0.0.0';


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/form', (req, res) => {
    res.render('pages/form')
})

//Get
app.get('/', (req,res)=>{
    res.render('pages/home')
})

//Get All Posts
app.get('/api/posts', (req, res)=>{
    res.render('pages/listPosts', {posts})})

//Get Post by Id
app.get('/api/posts/:id', (req,res)=> {
    const postId = req.params.id;
    const post = posts.find(post => post.id === parseInt(postId))
    if(!post) return res.status(404).send("Post Doesn't exits with provided ID");
    res.send(post);
})
 
// Create New Post
app.post('/form',(req, res) => {
    const {error} = utils.validatePost(req.body)
    if(error) return res.status(400).send("Failed Validation")
    const post = {
        id: posts.length + 1,
        postData: req.body.postData,
        Category: req.body.Category,
        createdAt: req.body.createdAt || Date.now(),
    }
    posts.push(post)
    res.status(201).render('pages/listPosts', {posts})
})

//PUT 

app.put('/api/posts/:id', (req, res)=>{
    const postId = req.params.id;
    const post = posts.find(post => post.id === parseInt(postId))
    if(!post) return res.status(404).send("Post Doesn't exits with provided ID");
    const {error} = utils.validatePost(req.body)
    if(error) return res.status(400).send("Failed Validation")
    post.postData = req.body.postData;
    post.Category = req.body.Category;
    post.createdAt = req.body.createdAt;

    res.send(post)
})

//Patch
app.patch('/api/posts/:id', (req, res)=>{
    const postId = req.params.id;
    const post = posts.find(post => post.id === parseInt(postId))
    if(!post) return res.status(404).send("Post Doesn't exits with provided ID");
    const {error} = utils.validatePost(req.body)

    if(error) return res.status(400).send("Failed Validation")
    
    post.postData = req.body.postData;
    if(req.body.Category) {
        post.Category = req.body.Category;
    }
    res.send(post)
})

//Delete post By Id
app.delete('/api/posts/:id', (req, res)=>{
    const postId = req.params.id;
    const post = posts.find(post => post.id === parseInt(postId))
    if(!post) return res.status(404).send("Post Doesn't exits with provided ID");
    const index = posts.indexOf(post);
    posts.splice(index, 1);
    res.send(post);
})


app.listen(Port,HOST, ()=>{
    console.log(`Running on http://${HOST}:${Port}`)
})

module.exports = app;

