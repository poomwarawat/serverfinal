const express = require("express");
const router = express.Router();
const con = require("../config/mySQL");
const moment = require('moment');

//LIST OF ALL POST
router.get("/posts", (req, res) => {});

//Create a new post
router.post("/posts", (req, res) => {
    const sql = `INSERT INTO post (activity_title, userId, total_distance, totalTime,  pace_average, description) VALUES (?, ?, ?, ?, ?, ?)`;
    const Data = [req.body.data, req.body.userId, req.body.totalDistance, req.body.totalTime, req.body.paceAverage, req.body.description ]
    const value = Object.values(Data)
    con.query(sql, value, (err, result) =>{
        if(err) throw err
        return res.send({post : true})
    })
});

//get user post
router.post("/get-post", (req, res) =>{
    const sql = `SELECT post.postId, users.firstname, users.lastname, users.profileurl, post.total_distance, post.activity_title, post.description, post.pace_average, post.userId, post.totalTime, users.token FROM post INNER JOIN users ON post.userId=users.userId WHERE post.userId=${req.body.userId}`
    con.query(sql, (err, result) => {
        return res.send(result)
    })
})

//get all post
router.get('/get-all-post', (req, res) =>{
    const sql = `SELECT post.postId, post.totalTime, users.firstname, users.lastname, users.profileurl, post.total_distance, post.activity_title, post.description, post.pace_average, post.userId, users.token FROM post INNER JOIN users ON post.userId=users.userId`
    con.query(sql, (err, result) =>{
        return res.send(result)
    })
})

//post comment
router.post("/post-comment", (req, res) =>{
    const sql = `INSERT INTO comments (userId, postId, content) VALUES ('${req.body.userId}', '${req.body.postId}', '${req.body.content}')`
    con.query(sql, (err, result) =>{
        return res.send({comment : true})
    })
})

//get comment
router.post("/get-comment", (req, res) =>{
    const sql = `SELECT comments.commentId, comments.content, users.profileurl, users.firstname, users.lastname, users.token FROM comments INNER JOIN users ON comments.userId=users.userId WHERE postId='${req.body.postId}'`
    // const sql = `SELECT * FROM comments WHERE postId='${req.body.postId}'`
    con.query(sql, (err, result) =>{
        return res.send(result)
    })
})
    
//Like post --update like in post
router.post("/post-like", (req, res) =>{
    if(req.body.userId != "" && req.body.posId != ""){
        const sql = `INSERT INTO postLike (postId, userId) VALUES ('${req.body.postId}', '${req.body.userId}')`
        con.query( sql, (err, result) =>{
            return res.send({like : true})
        })
    }
})

//delete like
router.post("/delete-like", (req, res) =>{
    if(req.body.userId != "" && req.body.posId != ""){
        const sql = `DELETE FROM postLike WHERE postId=${req.body.postId} AND userId=${req.body.userId}`
        con.query(sql, (err, result) =>{
            if(result) { return res.send({unlike : true}) }
        })
    }
})

//get like
router.get("/get-like", (req, res) =>{
    if(req.query.userId != "" && req.query.posId != ""){
        const sql = `SELECT * FROM postLike WHERE postId=${req.query.postId} AND userId=${req.query.userId}`
        con.query(sql, (err, result) =>{
            for(var i in result){
                return res.send({like : true})
            }
        })
    }
})

//get user like
router.post("/get-user-like", (req, res) =>{
    if(req.body.postId){
        const sql = `SELECT postLike.postId, users.firstname, users.lastname, users.userId, users.token FROM postLike INNER JOIN users ON postLike.userId=users.userId WHERE postId=${req.body.postId}`
        con.query(sql, (err, result) => {
            if(result){
                return res.send(result)
            }
        })
    }
})


router.post("/test", (req, res) =>{
    console.log(req.body)
})

//Delete post and its comments from database
router.delete("/post/:id", (req, res) => {});

module.exports = router;
