import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../Auth'
import { create } from './apiPost'
import DefaultProfile from '../Avatar/avatar.jpg'

class NewPost extends Component {
    constructor() {
        super()
        this.state = {
            title: '',
            body: '',
            photo: '',
            error: '',
            user: {},
            fileSize: 0,
            loading: false,
            redirecttoProfile: false
            
        }
    }

    
    componentDidMount() {
        this.postData = new FormData()
        this.setState({
            user: isAuthenticated().user
        })
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
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            create(userId, token, this.postData).then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                }
                else {
                    console.log("Post", data)
                    this.setState({
                        loading: false,
                        title: '',
                        body: '',
                        redirecttoProfile:true
                    })

                }
                
            });
        }
    };

    newpostForm = (title,body) => (
        <form>
           
           <div className="form-group">
                <label className="text-muted">Photo</label>
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
                Create
                </button>
        </form>
              
    );
    
    render() {
        const {loading,title,body,redirecttoProfile,photo,user,error} = this.state

        if (redirecttoProfile) {
           return  <Redirect to={`/user/${user._id}`}></Redirect>
        }
        
        // const photoUrl = id ?
        //     `${process.env.REACT_APP_API_URL
        //     }/user/photo/${id}?${new Date().getTime()}`
        //     : DefaultProfile

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create Post</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                
                {loading ?
                    (<div className="jumbotron text-center">
                        <h2>Loading...</h2>
                        </div>
                ) : (
                        ""
                    )}
                
                {/* <img style={{ height: "200px", width: "auto" }}
                    className="img-thumbnail"
                    src={photoUrl} alt={name} /> */}
                {this.newpostForm(title,body)}
            </div>
        ); 
    }
}


export default NewPost;