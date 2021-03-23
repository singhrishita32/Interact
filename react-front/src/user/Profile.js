import React, { Component } from 'react'
import {isAuthenticated} from '../Auth'
import { Redirect,Link } from 'react-router-dom'
import { read } from './apiUser'
import DefaultProfile from '../Avatar/avatar.jpg'
import DeleteUser from './DeleteUser'
import FollowProfileButton from './FollowProfileButton'
class Profile extends Component{
    constructor() {
        super()
            this.state = {
                user: { following: [], followers: [] },
                redirectToSignin: false,
                following:false
        }
    }

    checkFollow = user => {
        const jwt = isAuthenticated()
        const match = user.followers.find(follower => {
            return follower._id===jwt.user._id
        })
        return match
    }

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    console.log("ERROR");
                    this.setState({ redirectToSignin: true });
                }
                else {
                    let following = this.checkFollow(data)
                    this.setState({ user: data, following: following });
                }
            });
    };

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.user._id)
            .then(data => {
                if (data.error)
                    this.setState({error:data.error})
                else {
                    this.setState({user:data, following:!this.state.following})
                }
        })
    }

    

    componentDidMount() {
        const userId = this.props.match.params.userId
        this.init(userId);
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId
        this.init(userId);
    }

    render(){
        const {user,redirectToSignin} = this.state
        if(redirectToSignin) return <Redirect to="/signin"/>
        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Profile</h2>
                <div className="row">
                <div className="col-md-6">
                        <img className="card-img-top"
                            src={photoUrl}
                            onError={i=>i.target.src=`${DefaultProfile}`}
                            alt={user.name}
                            style={{ height: "200px", width: "auto" }}
                            className="img-thumbnail"/>
                </div>
                    <div className="col-md-6">
                        
                        <div className="lead">
                            <p>Hello {user.name}</p>
                            <p>Email {user.email}</p>
                            <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
                            </div>

                        {isAuthenticated().user
                            && isAuthenticated().user._id === this.state.user._id
                            ?
                            (
                            <div className="d-inline-block">
                                <Link to={`/user/edit/${user._id}`} className="btn btn-raised btn-success mr-5">
                                    Edit Profile
                                </Link>
                                <DeleteUser userId={user._id}/>
                            </div>
                        ) : (
                                <FollowProfileButton
                                    following={this.state.following}
                                    onButtonClick={this.clickFollowButton}/>
                        )}
                        
                </div>
                </div>
                <div className="row">
                    <div className="col md-12 mt-5 mb-5">
                        <hr/>
                            <p className="lead">{user.about}</p>
                        <hr/>
                    </div>
                </div>
                </div>
        );
    }
}
export default Profile;