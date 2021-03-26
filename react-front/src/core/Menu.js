import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {signout, isAuthenticated} from '../Auth'


const isActive = (history, path) => {
    if(history.location.pathname === path)
        return {color: "#000000"}
    else
        return {color: "#009999"}
}

const Menu = ({history}) => (
    <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className = "navbar-nav">
                    
                    <li className = "nav-item active">
                        <Link className = "nav-link" style={isActive(history, "/")} to="/">Home</Link>
                    </li>

                    <li className = "nav-item active">
                        <Link className = "nav-link" style={isActive(history, "/users")} to="/users">Users</Link>
                    </li>

                    {! isAuthenticated() && (
                        <>
                            <li className = "nav-item">
                                <Link className = "nav-link" style={isActive(history, "/signup")} to="/signup">Signup</Link>
                            </li>
                            
                            <li className = "nav-item">
                                <Link className = "nav-link" style={isActive(history, "/signin")} to="/signin">Signin</Link>
                            </li>
                        </>
                    )}

                    { isAuthenticated() && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link"
                                    style={isActive(history,`/findpeople`)}
                                    to={`/findpeople`}>
                                    Find People</Link>
                                
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link"
                                    style={isActive(history,`/post/create`)}
                                    to={`/post/create`}>
                                    Create Post</Link>
                                
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link"
                                    style={isActive(history,`/user/${isAuthenticated().user._id}`)}
                                    to={`/user/${isAuthenticated().user._id}`}>
                                    {isAuthenticated().user.name}'s Profile</Link>
                                
                            </li>
                            <li className = "nav-item">
                                <Link className="nav-link"
                                    style={isActive(history, "/signout")}
                                    to="/" onClick={() => signout(() =>
                                        history.push("/"))}>SignOut</Link>
                            </li>

                        </>
                    )}
                
                </ul>
            </div>
        </nav>
    </div>
)


export default withRouter(Menu);