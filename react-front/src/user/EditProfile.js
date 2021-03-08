import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../Auth'
import { read, update,updateUser } from './apiUser'
import DefaultProfile from '../Avatar/avatar.jpg'

class EditProfile extends Component {
    constructor() {
        super()
        this.state = {
            id: "",
            name: "",
            password: "",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false,
           about:""
        }
    }

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    console.log("ERROR");
                    this.setState({ redirectToProfile: true });
                }
                else {
                    this.setState({
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        error: "",
                        about:data.about
                    });
                }
            });
    }

    
    componentDidMount() {
        this.userData=new FormData()
        const userId = this.props.match.params.userId
        this.init(userId);
    }

    isValid = () => {
        const { name, email, password,fileSize } = this.state
        if (fileSize >100000) {
            this.setState({
                error: "File size must be less than 1MB",
                loading: false
            })
            return false;
        }
        if (name.length === 0) {
            this.setState({
                error: "Name is required",
                loading: false
            })
            return false;
        }
        if (!/[\w._-]+@[\w.-]+\.[a-zA-Z0-9-]{2,4}/.test(email)) {
            this.setState({
                error: "A valid Email is required",
                loading:false
            })
            return false;
        }
        if (password.length >= 1 && password.length <= 5) {
            this.setState({
                error: "Password must be atleast  6 characters",
                loading:false
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
        this.userData.set(name,value)
        this.setState({
            [name]: value,
            fileSize:fileSize
        });
    };
    
    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({loading:true})
        if (this.isValid()) {
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
            update(userId, token, this.userData).then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                }
                else {
                   // console.log(data);
                        updateUser(data.user, () => {
                        this.setState({
                            redirectToProfile: true
                        });
                    });
                }
                });
        }
    };

    signupForm = (name, email, about,password) => (
        <form>
           
           <div className="form-group">
                <label className="text-muted">Profile Photo</label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept="image/*"
                    className="form-control">
                </input>
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={this.handleChange("name")}
                    type="text"
                    className="form-control"
                    value={name}>
                </input>
            </div>
            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea
                    onChange={this.handleChange("about")}
                    type="text"
                    className="form-control"
                    value={about}>
                </textarea>
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={this.handleChange("email")}
                    type="email"
                    className="form-control"
                    value={email}>
                </input>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={this.handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}>
                </input>
            </div>
            <button onClick={this.clickSubmit}
                className="btn btn-raised btn-primary">
                Update
                </button>
        </form>
              
    );
    
    render() {
        const {loading, name,id, about , error,email, password,redirectToProfile } = this.state

        if (redirectToProfile) {
           return  <Redirect to={`/user/${id}`}></Redirect>
        }
        
        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                <div
            className="alert alert-danger"
            style={{ display: error ? "":"none"}}
        >
            {error}
                </div>
                
                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                        </div>
                ) : (
                        ""
                    )}
                
                <img style={{ height: "200px", width: "auto" }}
                    className="img-thumbnail"
                    src={photoUrl} alt={name} />
                {this.signupForm(name,email,about, password)}
            </div>
        ); 
    }
}


export default EditProfile;