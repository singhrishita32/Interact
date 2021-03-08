// const getPosts = (req,res)=>{
//  	res.send("Hi there again");
// };
// module.exports = {
//  	getPosts
// };


// exports.getPosts = (req,res)=>{
//  	res.send("Hi there again");
// };





const express = require('express'); 
const app=express();
const postControler=require('../Controlers/post');
const validator = require('../Validators/index')
const Auth=require('../Controlers/auth');
const {userById} = require('../Controlers/user');
const post = require('../Models/post');


const router= express.Router();

router.get('/posts',postControler.getPosts);
router.post('/post/new/:userId',Auth.requireSignin, postControler.createPost,validator.createPostValidator);
router.get('/post/by/:userId',Auth.requireSignin,postControler.postByUser);
router.delete('/post/:postId',Auth.requireSignin,postControler.isPoster, postControler.deletePost)
router.put('/post/:postId',Auth.requireSignin,postControler.isPoster,postControler.updatePost);


router.param("userId",userById)
router.param("postId",postControler.postById)

module.exports = router