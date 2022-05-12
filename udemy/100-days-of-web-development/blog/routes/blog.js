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
                    authors.email as author_email
                from posts INNER JOIN authors 
                ON posts.author_id = authors.id
                WHERE posts.id = ?`; // ?: qurey()에서 동적으로 채우기

    const [posts] = await db.query(query, [postId] );  // 무조건 배열에 넣어서 전달 배열[0]: 데이터, 배열[1] : 메타데이터
    if(!posts || posts.length === 0){
        return res.status(404).render('404');
    }
    
    const postData = {
        ...posts[0],
        date : posts[0].date.toISOString(), // 날짜 시간 꺼내서 toISOString 처리해주고 넣어줌
        humanReadableDate : posts[0].date.toLocaleDateString('en-US', {
            weekday : 'long',
            year : 'numeric',
            month : 'long',
            day : 'numeric'
        }) //사람이 읽을 수 있는 문자열
    }; // 새로운 객체 안에 post[0]에 들어있는 내용을 넣어줌 ( 즉, DB 쿼리로 불러온 내용을 넣어줌 )

    res.render('post-detail', {post:postData});
});

router.post('/posts/:id/delete', async function(req,res){
    const postId = req.params.id;
    const query = `
    DELETE FROM posts WHERE id = ?`; // ?: qurey()에서 동적으로 채우기

    const [posts] = await db.query(query, [postId] );

    if(!posts || posts.length === 0){
        return res.status(404).render('404');
    }

    res.redirect('/posts');

});
router.get('/posts/:id/edit', async (req,res)=>{
    const id = req.params.id;
    const query = `SELECT * FROM posts WHERE id =?`;

    const [posts] = await db.query(query, [id] );
    
    if(!posts || posts.length === 0){
        return res.status(404).render('404');
    }

    res.render('update-post',{post:posts[0]});
});

router.post('/posts/:id/edit', async (req,res)=>{
    const query = `UPDATE posts SET title =?, summary = ?, body = ?
                    WHERE id = ?`;
    const [posts] = await db.query(query, [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.params.id
    ] );

    if(!posts || posts.length === 0){
        return res.status(404).render('404');
    }

    res.redirect('/posts');
});
module.exports = router;