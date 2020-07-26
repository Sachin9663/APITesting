const express = require('express');
const app = express();

const posts = require('./posts')
const utils = require('./utils/postSchema')

app.use(express.json());

const Port = process.env.PORT || 8080

//Get
app.get('/', (req,res)=>{
    res.send("Welcome to Express Server. Got to /api/posts to get Posts")
})

app.get('/api/posts', (req, res)=>{
    res.send(posts)
})

//GetById
app.get('/api/posts/:id', (req,res)=> {
    const postId = req.params.id;
    const post = posts.find(post => post.id === parseInt(postId))
    if(!post) return res.status(404).send("Post Doesn't exits with provided ID");
    res.send(post);
})
 
//Post
app.post('/api/posts',(req, res) => {
    const {error} = utils.validatePost(req.body)
    if(error) return res.status(400).send("Failed Validation")
    const post = {
        id: posts.length + 1,
        postData: req.body.postData,
        Category: req.body.Category,
        createdAt: req.body.createdAt || Date.now(),
    }
    posts.push(post)
    res.status(201).send(post);
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

//Delete
app.delete('/api/posts/:id', (req, res)=>{
    const postId = req.params.id;
    const post = posts.find(post => post.id === parseInt(postId))
    if(!post) return res.status(404).send("Post Doesn't exits with provided ID");
    const index = posts.indexOf(post);
    posts.splice(index, 1);
    res.send(post);
})


app.listen(Port, ()=>{
    console.log(`Server listening at port ${Port}`)
})

module.exports = app;

