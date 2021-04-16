import React, { Component } from 'react'
import { singlePost } from './apiPost'
import DefaultPost from '../Avatar/avatar.jpg'
import {Link} from 'react-router-dom'
class SinglePost extends Component{
    state = {
        post:''
    }
    componentDidMount = () => {
        const postId = this.props.match.params.postId
        singlePost(postId)
            .then(data => {
                if (data.error) {
                console.log(data.error)
                }
                else {
                    this.setState({
                        post:data
                    })
                }
            })
        

    }

    renderPost = (post) => {
        const posterName = post.postedBy ? post.postedBy.name : "Unknown"
        const posterId = post.postedBy ? `/user/${post.postedBy._id}`:""

        return (
            <div className="card col-md-4">
            <img 
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                  onError={i=>i.target.src=`${DefaultPost}`}    
                  alt={post.title}
                      style={{ height: "200px",paddingTop:"20px", width: "auto" }}
                      className="img-thumbnail mb-3 mt-2"/> 
              <div className="card-body">
                  <p className="card-text">{post.body}
                      <br />
                      Posted by {" "} <Link to={`${posterId}`}>{posterName}</Link> {" "}  on {new Date(post.created).toDateString()}</p>
                  
                  <Link to={`/`} className="btn btn-raised btn-primary btn-sm">
                      Back to Posts</Link>
              </div>
          </div>
        )
    }
    render() {
        const {post}=this.state
        return (
            <div className="container">
                <h2 className="jumbotron display-2 mt-5 mb-5">{post.title}</h2>

                {!post ? (
                    <div className="jumbotron tect-center">
                        <h2>Loading...</h2>
                        </div>
                ) : (
                    this.renderPost(post)
                 )}
            </div>       
        )
    }
}
export default SinglePost;