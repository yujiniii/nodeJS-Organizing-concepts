const express = require('express');
const { render } = require('express/lib/response');

const db = require('../data/database');

const router = express.Router();


router.get('/', function(req,res){
    res.redirect('/posts');
});

router.get('/posts', async function(req,res){
    const query = `select posts.*, authors.name as author_name 
                    from posts INNER JOIN authors 
                    ON posts.author_id = authors.id`;

    const [posts] = await db.query(query);  
    res.render('posts-list', {posts:posts});
});

router.post('/posts', async function(req,res){
    const data = [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.author,    
    ];
    await db.query('INSERT INTO posts (title, summary, body, author_id) values (?)', [data,]); // 큰따옴표 안됨 
    res.redirect('/posts');
});


router.get('/new-post', async function(req,res){
    const [authors] = await db.query('select * from authors'); // 결과가 나올 때 까지 다음문장으로 넘어가지 않음
                                                    // 반환값인 데이터베이스 구조를 비구조화하고 첫번째 키를 변수에 담
    res.render('create-post',{authors:authors});
});

router.get('/posts/:id', async function(req,res){
    const postId = req.params.id;
    const query = `
                select 
                    posts.*, 
                    authors.name as author_name, 
                    author.email as author_email
                from posts INNER JOIN authors 
                ON posts.author_id = authors.id
                WHERE post.id = ?`; // ?: qurey()에서 동적으로 채우기

    const [posts] = await db.query(query, [postId] );  // 무조건 배열에 넣어서 전달 배열[0]: 데이터, 배열[1] : 메타데이터
    if(!posts || posts.length === 0){
        return res.status(404).render('404');
    }
    
    res.render('post-detail', {post:posts[0]});
});


module.exports = router;