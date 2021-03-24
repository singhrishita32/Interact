const express = require('express');
const { userById,
    findPeople,
    addFollowing,
    addFollower,
    removeFollower,
    removeFollowing,
    allUsers,
    userPhoto,
    getUser,
    updateUser,
    deleteUser } = require('../Controlers/user')
const {requireSignin} = require('../Controlers/auth');

const router = express.Router();
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower);
router.put('/user/follow', requireSignin, addFollowing, addFollower);
router.get('/users',allUsers);
router.get('/user/:userId',requireSignin,getUser);
router.put('/user/:userId',requireSignin,updateUser);
router.delete('/user/:userId',requireSignin,deleteUser);
router.get("/user/photo/:userId", userPhoto);
router.get('/user/findpeople/:userId', requireSignin, findPeople);
router.param("userId", userById)
//who to follow

module.exports = router 