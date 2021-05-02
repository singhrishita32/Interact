import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Signup from './user/Signup'
import Signin from './user/Signin'
import Menu from './core/Menu'
import Profile from './user/Profile'
import Users from './user/Users'
import PrivateRoute from './Auth/PrivateRoute'
import EditProfile from './user/EditProfile'
import FindPeople from './user/FindPeople'
import NewPost from './post/NewPost'
import EditPost from './post/EditPost'
import SinglePost from './post/SinglePost'
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

const MainRouter = () => {
    console.log("Rishita. Please ache se karna abki. Baaki <3")
    return (
        <div>
            <Menu></Menu>
            <Switch>
                <Route exact path="/users" component={Users}></Route>
                <Route exact path="/signup" component={Signup}></Route>
                <Route exact path="/" component={Home}></Route>
                <Route exact path="/forgot-password" component={ForgotPassword} />
                <Route exact path="/reset-password/:resetPasswordToken"
                component={ResetPassword}/>
                <PrivateRoute
                    exact path="/post/create"
                    component={NewPost}>
                </PrivateRoute>
                <PrivateRoute
                    exact path="/post/edit/:postId"
                    component={EditPost}>
                </PrivateRoute>

                <Route exact path="/signin" component={Signin}></Route>
                <Route exact path="/post/:postId" component={SinglePost}></Route>
                <PrivateRoute
                    exact path="/user/edit/:userId"
                    component={EditProfile}>
                </PrivateRoute>
                <PrivateRoute
                    exact path="/user/:userId"
                    component={Profile}>
                </PrivateRoute>
                <PrivateRoute
                    exact path="/findpeople"
                    component={FindPeople}>
                </PrivateRoute>

            </Switch>
        </div>
    );
};

export default MainRouter;
