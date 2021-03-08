const express = require('express'); 
const app=express();
const Auth=require('../Controlers/auth');
const validator = require('../Validators/index')
const {userById} = require('../Controlers/user')

const router= express.Router();
router.post('/signup',validator.userSignupValidator,Auth.signup);
router.post('/signin',Auth.signin);
router.get('/signout',Auth.signout);


router.param("userId",userById)



module.exports = router 