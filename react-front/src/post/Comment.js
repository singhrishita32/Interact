import React, { Component } from 'react'
import { comment, uncomment } from './apiPost'
import { isAuthenticated } from '../Auth/index'
import { Link } from 'react-router-dom'
import DefaultProfile from '../Avatar/avatar.jpg'
class Comment extends Component{
    state = {
        text:""
    }

    handleChange = event => {
        this.setState({ text: event.target.value })
        //console.log(this.state.text);
    }

    addComment = (e) => {
        e.preventDefault()
        const userId = isAuthenticated().user._id;
        const postId = this.props.postId
        const token = isAuthenticated().token
        console.log(userId)
        comment(userId, token, postId, { text: this.state.text })
           .then(data => {
                console.log(data)
                if (data.error) {
                    console.log(data.error)
                }
                else {
                    this.setState({
                            text:''
                    })
                    this.props.updateComments(data.comments)
                    
                }
        })
    }

    render() {
        const { comments } = this.props;
        return (
            <div>
                <h2 className="mt-5 mb-5">Leave a comment</h2>
                <form>
                    <div className="form-group">
                    <input
                        type="text"
                        onChange={this.handleChange}
                        className="form-control"
                        value={this.state.text}>
                    </input>
                    <button onClick={this.addComment}>OK!</button>    
                    </div>
                </form>
                <hr />
                <div className="col-md-4 col-md-offset-2">
                        <h3 className="text-primary">Comments</h3>
                        <hr />
                        {comments.map((comment, i) => (
                            <div key={i}>
                                <div className="row">
                                    <Link to={`/user/${comment.postedBy._id}`}>
                                        <img className="float-left mr-2"
                                            height="30px"
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                                            alt={comment.postedBy.name} onError={i => i.target.src = `${DefaultProfile}`}></img>
                                        <div>
                                        </div>
                                    </Link>

                                    <br/>
                                    <p className="lead">
                                        {new Date(comment.created).toDateString()}  by {" "}
                                        <Link to={`/user/${comment.postedBy._id}`}>
                                            {comment.postedBy.name}

                                        </Link>
                                        <br />
                                        {comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                <hr />
            </div>
        )
    }
}
export default Comment;