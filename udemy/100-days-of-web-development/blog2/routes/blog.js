const express = require('express');
const { render } = require('express/lib/response');
const mongodb = require('mongodb')
const db = require('../data/database');

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get('/', function(req,res){
    res.redirect('/posts');
});

router.get('/posts', async function(req,res){
    const posts = db.getDb().collection('post').find().toArray()
    res.render('posts-list');
});
router.post('/update-posts', async function(req,res){
    const authorId = new ObjectId(req.body.author);
    const newPost = {
        title : req.body.title,
        summary:req.body.summary,
        body : req.body.content,
        date:new Date(),
    };
    const result =  await db.getDb().collection('posts').updateOne({_id:authorId}, newPost);
    console.log(result);
    res.redirect('/posts');
});




router.get('/new-post', async function(req,res){
    const authors =  await db.getDb().collection('authors').find().toArray();
    console.log(authors);
    
    res.render('create-post', {authors:authors});
});

router.post('/create-posts', async function(req,res){
    const authorId = new ObjectId(req.body.author);
    const author =  await db.getDb().collection('authors').findOne({_id:authorId});
    const newPost = {
        title : req.body.title,
        summary:req.body.summary,
        body : req.body.content,
        date:new Date(),
        author:{
            id: authorId,
            name : author.name,
            email : author.email
        }
    };
    const result =  await db.getDb().collection('posts').insertOne(newPost);
    console.log(result);
    res.redirect('/posts');
});


module.exports = router;