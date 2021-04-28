import React, { Component } from 'react'
import { singlePost,remove ,like,unlike} from './apiPost'
import DefaultPost from '../Avatar/avatar.jpg'
import { Link, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../Auth'
import Comment from './Comment'

class SinglePost extends Component{
    state = {
        post: '',
        like: false,
        likes: 0,
        redirectToSignin: false,
        comments:[]
    }
    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        singlePost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    post: data,
                    likes: data.likes.length,
                    like: this.checkLike(data.likes),
                    comments:data.comments
                });
            }
        });
    };


    deletePost = () => {
        const token = isAuthenticated().token;
        const postId = this.props.match.params.postId;
        remove(postId, token)
            .then(data => {
                if (data.error)
                    console.log(data.error)
                else
                    this.setState({deleted:true})
        })
    }

    deleteConfirmed = () => {
        let answer = window.confirm("Are you sure to delete?")
        if (answer) {
            this.deletePost()
        }
    }
    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;

        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                });
            }
        });
    };

    updateComments = comments => {
        this.setState({
            comments
        })
    }

    renderPost = (post) => {
        
        const { likes, like,redirectToSignin } = this.state
        const posterName = post.postedBy ? post.postedBy.name : "Unknown"
        const posterId = post.postedBy ? `/user/${post.postedBy._id}`:""
        if (redirectToSignin) {
            return <Redirect to={`/signin`} />;
        }
        return (
            <div>
                <img
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    onError={i=>i.target.src=`${DefaultPost}`}    
                    alt={post.title}
                    className="img-thumbnail mb-3 mt-2"
                    style={{
                        height: '300px',
                        width: '100%',
                        objectFit: 'cover'
                    }}
                />
                <br />

                {like ? <button onClick={this.likeToggle}>Unlike</button> :
                <button onClick={this.likeToggle}>Like</button>}

                <hr />
                <h3>{likes} Like</h3>
                <div className="d-inline-block">
                    <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-5">
                        Back to Posts
                    </Link>
                    {isAuthenticated().user
                        && isAuthenticated().user._id === post.postedBy._id &&
                        <>
                            <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-primary btn-success mr-5">
                                Update Post
                            </Link>
                    
                            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-primary btn-warning mr-5">
                            Delete Post
                            </button>
                        </>
                    }
                </div>
                <div>
                    <p>
                        <br />
                        Posted by {" "} <Link to={`${posterId}`}>{posterName}</Link> {" "}  on {new Date(post.created).toDateString()}
                    </p>
                    <br />
                    {post.body}
                </div>
            </div>
        )
    }
    render() {
        const { post, redirectToSignin, comments } = this.state;

        if(redirectToSignin) {
            return <Redirect to={`/signin`} />;
        }
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
                <Comment postId={post._id}
                    comments={comments.reverse()}
                    updateComments={this.updateComments} />
            </div>       
        )
    }
}
export default SinglePost;