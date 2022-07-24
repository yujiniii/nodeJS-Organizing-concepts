const db = require('../data/database');
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId;

function getWelcome(req, res) {
    res.render('welcome', { csrfToken: req.csrfToken() });
  }

  async function getAdmin(req, res) {
    if (!res.locals.isAuth) {
      return res.status(401).render('401');
    }
  
    const posts = await db.getDb().collection('posts').find().toArray();
  
    let sessionInputData = req.session.inputData;
  
    if (!sessionInputData) {
      sessionInputData = {
        hasError: false,
        title: '',
        content: '',
      };
    }
  
    req.session.inputData = null;
  
    res.render('admin', {
      posts: posts,
      inputData: sessionInputData,
      csrfToken: req.csrfToken(),
    });
  }


  async function postPost(req, res) {
    const enteredTitle = req.body.title;
    const enteredContent = req.body.content;
  
    if (
      !enteredTitle ||
      !enteredContent ||
      enteredTitle.trim() === '' ||
      enteredContent.trim() === ''
    ) {
      req.session.inputData = {
        hasError: true,
        message: 'Invalid input - please check your data.',
        title: enteredTitle,
        content: enteredContent,
      };
  
      res.redirect('/admin');
      return; // or return res.redirect('/admin'); => Has the same effect
    }
  
    const newPost = {
      title: enteredTitle,
      content: enteredContent,
    };
  
    await db.getDb().collection('posts').insertOne(newPost);
  
    res.redirect('/admin');
  }

  async function getEdit(req, res) {
    const postId = new ObjectId(req.params.id);
    const post = await db.getDb().collection('posts').findOne({ _id: postId });
  
    if (!post) {
      return res.render('404'); // 404.ejs is missing at this point - it will be added later!
    }
  
    let sessionInputData = req.session.inputData;
  
    if (!sessionInputData) {
      sessionInputData = {
        hasError: false,
        title: post.title,
        content: post.content,
      };
    }
  
    req.session.inputData = null;
  
    res.render('single-post', {
      post: post,
      inputData: sessionInputData,
      csrfToken: req.csrfToken(),
    });
  }

  async function postEdit(req, res) {
    const enteredTitle = req.body.title;
    const enteredContent = req.body.content;
    const postId = new ObjectId(req.params.id);
  
    if (
      !enteredTitle ||
      !enteredContent ||
      enteredTitle.trim() === '' ||
      enteredContent.trim() === ''
    ) {
      req.session.inputData = {
        hasError: true,
        message: 'Invalid input - please check your data.',
        title: enteredTitle,
        content: enteredContent,
      };
  
      res.redirect(`/posts/${req.params.id}/edit`);
      return; 
    }
  
    await db
      .getDb()
      .collection('posts')
      .updateOne(
        { _id: postId },
        { $set: { title: enteredTitle, content: enteredContent } }
      );
  
    res.redirect('/admin');
  }


  async function postDelete(req, res) {
    const postId = new ObjectId(req.params.id);
    await db.getDb().collection('posts').deleteOne({ _id: postId });
  
    res.redirect('/admin');
  }

  module.exports = {
    getAdmin,
    getEdit,
    getWelcome,
    postDelete,
    postEdit,
    postPost
  }