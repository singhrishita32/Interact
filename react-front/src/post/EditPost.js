import React, { Component } from 'react'
import { singlePost, update } from './apiPost'
import { isAuthenticated } from '../Auth'
import { Redirect } from 'react-router-dom';
import DefaultProfile from '../Avatar/avatar.jpg'
class EditPost extends Component {
    constructor() {
        super()
        this.state = {
            id:'',
            title: '',
            body: '',
            redirectToProfile: false,
            fileSize:0,
            loading: false,
            error:''
        }
    }
    init = postId => {
        
        singlePost(postId)
            .then(data => {
                if (data.error) {
                    console.log("ERROR");
                    this.setState({ redirectToProfile: true });
                }
                else {
                    this.setState({
                        id: data._id,
                        body: data.body,
                        title:data.title,
                        error: ""
                    });
                }
            });
    }
    isValid = () => {
        const { title,body,fileSize } = this.state
        if (fileSize >100000) {
            this.setState({
                error: "File size must be less than 1MB",
                loading: false
            })
            return false;
        }
        if (title.length === 0 || body.length===0) {
            this.setState({
                error: "All fields are required",
                loading: false
            })
            return false;
        }
        return true; 
        
    }
    
    componentDidMount() {
        this.postData=new FormData()
        const postId = this.props.match.params.postId
        this.init(postId);
    }

    handleChange = name => (event) => {
        this.setState({ error: "" });
        const value =
            name === 'photo' ? event.target.files[0] :
            event.target.value
        const fileSize =
            name === 'photo' ? event.target.files[0].size :0;
        this.postData.set(name,value)
        this.setState({
            [name]: value,
            fileSize:fileSize
        });
    };
    
    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({loading:true})
        if (this.isValid()) {
            const postId = this.props.match.params.postId
            const token = isAuthenticated().token;
            update(postId, token, this.postData).then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                }
                else {
                    this.setState({
                        loading: false,
                        title: '',
                        body: '',
                        redirectToProfile:true
                    })

                }
                
            });
        }
    };

    editPostForm = (title,body) => (
        <form>
           
           <div className="form-group">
                <label className="text-muted">Post Photo</label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept="image/*"
                    className="form-control">
                </input>
            </div>

            <div className="form-group">
                <label className="text-muted">Title</label>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="form-control"
                    value={title}>
                </input>
            </div>
            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea
                    onChange={this.handleChange("body")}
                    type="text"
                    className="form-control"
                    value={body}>
                </textarea>
            </div>
            <button onClick={this.clickSubmit}
                className="btn btn-raised btn-primary">
                Update
                </button>
        </form>
              
    );

    render() {
        const { title, body, redirectToProfile,id,error,loading } = this.state
        if (redirectToProfile) {
            return  <Redirect to={`/user/${isAuthenticated().user._id}`}></Redirect>
         }
        return(
                <div className="container">
                    <h2 className="mt-5 mb-5">{title}</h2>
                    <div
                    className="alert alert-danger"
                    style={{ display: error ? "":"none"}}>
                    {error}
                </div>
                
                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                        </div>
                ) : (
                        ""
                    )}
                <img style={{
                    height: "200px",
                    width: "auto"
                    }}
                    onError={i=>(i.target.src=`${DefaultProfile}`)}
                    className="img-thumbnail"
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`}
                    alt={title} />
                {this.editPostForm(title, body)}
            </div>    
        )
    }
}
export default EditPost;
