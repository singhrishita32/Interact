import React, { Component, useReducer } from 'react';
import DefaultProfile from '../Avatar/avatar.jpg'
import {Link} from 'react-router-dom'
class ProfileTabs extends Component{
    render() {
        
        const {following,followers}=this.props
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <h3 className="text-primary">Followers</h3>
                        <hr />
                        {followers.map((person, i) => (
                            
                                <div key={i}>
                                <div className="row">
                                    <Link
                                        to={`/user/${person._id}`}>
                                        <img className="float-left mr-2"
                                            height="30px"
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                            alt={person.name}
                                            onError={i => i.target.src = `${DefaultProfile}`}></img>
                                        <div>
                                            <h3>{person.name}</h3>
                                        </div>
                                    </Link>
                                    <p style={{ clear: 'both' }}>
                                        {person.about}
                                    </p>
                                </div>
                            </div>

                            
                        ))}
                    </div>
                </div>

                <div className="col-md-4">
                        <h3 className="text-primary">Following</h3>
                        <hr />
                        {following.map((person, i) => (                            
                                <div key={i}>
                                <div className="row">
                                    <Link
                                        to={`/user/${person._id}`}>
                                        <img className="float-left mr-2"
                                            height="30px"
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                            alt={person.name}
                                            onError={i => i.target.src = `${DefaultProfile}`}></img>
                                        <div>
                                            <h3>{person.name}</h3>
                                        </div>
                                    </Link>
                                    <p style={{ clear: 'both' }}>
                                        {person.about}
                                    </p>
                                </div>
                            </div>

                            
                        ))}
                </div>
                
                
                <div className="col-md-4">
                        <h3 className="text-primary">Posts</h3>
                        <hr />
                    </div>
            </div>
        )
    }
}
export default ProfileTabs;
