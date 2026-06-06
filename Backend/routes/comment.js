const express = require('express');

const { getAllComments, addComment, getCommentById,deleteComment }=require('../controllers/comment');

const Router=express.Router();


Router.get('/getAllComments',getAllComments);
Router.post('/addComment',addComment);
Router.get('/getComment/:id',getCommentById);
Router.delete('/deleteComment/:id',deleteComment);

module.exports=Router