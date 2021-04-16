const express = require('express'); 
const app=express();
const postControler=require('../Controlers/post');
const validator = require('../Validators/index')
const Auth=require('../Controlers/auth');
const {userById} = require('../Controlers/user');
const post = require('../Models/post');


const router= express.Router();

router.get('/posts', postControler.getPosts);
router.get('/post/:postId',postControler.singlePost)
router.post('/post/new/:userId',Auth.requireSignin, postControler.createPost,validator.createPostValidator);
router.get('/posts/by/:userId',Auth.requireSignin,postControler.postByUser);
router.delete('/post/:postId',Auth.requireSignin,postControler.isPoster, postControler.deletePost)
router.put('/post/:postId',Auth.requireSignin,postControler.isPoster,postControler.updatePost);
router.get("/post/photo/:postId",postControler.photo)

router.param("userId",userById)
router.param("postId",postControler.postById)

module.exports = router