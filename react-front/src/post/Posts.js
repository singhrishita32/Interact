import React, { Component } from 'react'
import {list} from './apiPost'
//import DefaultProfile from '../Avatar/avatar.jpg'
import {Link} from 'react-router-dom'
class Posts extends Component {

    constructor(){
        super()
        this.state = {
            posts: []
        }
    }

    componentDidMount () {
        list()
        .then(data => {
            if(data.error)
                console.log(data.error)
            else
                this.setState({posts: data})
        })
    }



    renderPosts = posts => (
        <div className="row">{
            posts.map((post, i) => (
                <div className="card col-md-4" key={i}>
                  {/* <img className="card-img-top"
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                        onError={i=>i.target.src=`${DefaultProfile}`}    
                        alt={user.name}
                            style={{ height: "200px", width: "auto" }}
                            className="img-thumbnail"/>  */}
                    <div className="card-body">
                        <h5 className="card-title">{post.title}</h5>
                        <p className="card-text">{post.body}</p>
                        <Link to={`/post/${post._id}`} className="btn btn-raised btn-primary btn-sm">
                            Read More</Link>
                    </div>
                </div>
            )
        )
        }
        </div>
    )


    render() {
        const{posts} = this.state
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Posts</h2>
                {this.renderPosts(posts)}
            </div>
        )
    }
}

export default Posts;