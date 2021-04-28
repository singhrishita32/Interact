import React, { Component } from 'react'
import { comment, uncomment } from './apiPost'
import { isAuthenticated } from '../Auth/index'
import { Link } from 'react-router-dom'
import DefaultProfile from '../Avatar/avatar.jpg'
class Comment extends Component{
    state = {
        text: "",
        error:""
    }

    isValid = () => {
        const { text } = this.state;
        if (!text.length > 0 || text.length > 150)
        {
            this.setState({ error: "Comment length should lie between 0 and 150" })
            return false;
        }
        return true;
    }

    handleChange = event => {
        this.setState({
            text: event.target.value,
            error:""
        })
        //console.log(this.state.text);
    }

    addComment = (e) => {
        e.preventDefault()
        if (!isAuthenticated())
        {
            this.setState({
                error:"Please Sign in to comment!"
            })
        }
        if(this.isValid() && isAuthenticated())
        {
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
    }
    deleteComment = (comment) => {
        const userId = isAuthenticated().user._id;
            const postId = this.props.postId
            const token = isAuthenticated().token
            uncomment(userId, token, postId, comment)
                .then(data => {
                    console.log(data);
                    if (data.error) {
                        console.log(data.error)
                    }
                    else
                        this.props.updateComments(data.comments)
            })
        
    }

    deleteConfirmed = (comment) => {
        let answer = window.confirm("Are you sure to delete comment?")
        if (answer) {
            this.deleteComment(comment)
        }
    }

    render() {
        const { comments } = this.props;
        const {error}=this.state
        return (
            <div>
                <form>
                    <div className="form-group">
                    <input
                        type="text"
                        onChange={this.handleChange}
                        className="form-control"
                            value={this.state.text}
                            placeholder="Leave a comment...!">
                    </input>
                        <button className="btn btn-raised btn-success" onClick={this.addComment}>Post Comment!</button>
                        <br />
                        <br/>    
                    </div>
                </form>

                <div
                    className="alert alert-danger"
                    style={{ display: error ? "":"none"}}>
                    {error}
                </div>

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
                                <span>
                                {isAuthenticated().user
                                  && isAuthenticated().user._id === comment.postedBy._id &&
                                <>
                                <button onClick={()=>this.deleteConfirmed(comment)} className="btn btn-raised btn-primary btn-warning mr-5">
                                Delete Comment
                                </button>
                            </>
                    }
                                </span>
                            </div>
                        ))}
                    </div>
                <hr />
            </div>
        )
    }
}
export default Comment;