import React, {Component} from 'react'
import { signin, authenticate } from '../Auth'
import { Link, Redirect } from "react-router-dom";
import SocialLogin from './SocialLogin'
class Signin extends Component{
    constructor(){
        super()
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false,
            recaptcha: false

        }
    }

    handleChange = (str) => (event) => {
        this.setState({ error: "" });
        this.setState({
            [str]: event.target.value
        });
    };

    

    // clickSubmit = (event) => {
    //     event.preventDefault();
    //     this.setState({loading:true})
    //     const {email,password} = this.state
    //     const user = {
    //         email: email,
    //         password: password
    //     };
        
    //     signin(user)
    //         .then(data => {
    //             if (data.error) {
    //                 this.setState({ error: data.error,loading:false })
    //             }
    //             else {
    //                 //authenticate
    //                 authenticate(data, () => {
    //                     this.setState({redirectToReferer:true,loading:false})
    //                 })
    //                 //redirect
    //             }
    //         });
    // };
    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const { email, password } = this.state;
        const user = {
            email,
            password
        };
        // console.log(user);
        if (this.state.recaptcha) {
            signin(user).then(data => {
                if (data.error) {
                    this.setState({ error: data.error, loading: false });
                } else {
                    // authenticate
                    authenticate(data, () => {
                        this.setState({ redirectToReferer: true });
                    });
                }
            });
        } else {
            this.setState({
                loading: false,
                error: "What day is today? Please write a correct answer!"
            });
        }
    };
    recaptchaHandler = e => {
        this.setState({ error: "" });
        let userDay = e.target.value.toLowerCase();
        let dayCount;
 
        if (userDay === "sunday") {
            dayCount = 0;
        } else if (userDay === "monday") {
            dayCount = 1;
        } else if (userDay === "tuesday") {
            dayCount = 2;
        } else if (userDay === "wednesday") {
            dayCount = 3;
        } else if (userDay === "thursday") {
            dayCount = 4;
        } else if (userDay === "friday") {
            dayCount = 5;
        } else if (userDay === "saturday") {
            dayCount = 6;
        }
 
        if (dayCount === new Date().getDay()) {
            this.setState({ recaptcha: true });
            return true;
        } else {
            this.setState({
                recaptcha: false
            });
            return false;
        }
    };
    
    signinForm = (email, password,recaptcha) => (
        <form>
                <div className="form-group">
                        <label className="text-muted">Email</label>
                        <input 
                            onChange = {this.handleChange("email")} 
                            type = "email" 
                            className = "form-control"
                            value = {email}>
                        </input>
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Password</label>
                        <input 
                            onChange = {this.handleChange("password")} 
                            type = "password" 
                            className = "form-control"
                            value = {password}>
                        </input>   
                    </div>
                    <div className="form-group">
                    <label className="text-muted">
                    {recaptcha ? "Thanks. You got it!" : "What day is today?"}
                    </label>
 
                    <input
                        onChange={this.recaptchaHandler}
                        type="text"
                        className="form-control"
                    />
                </div>

                    <button onClick = {this.clickSubmit}  className="btn btn-raised btn-primary">Submit</button>
                </form>
          
    )

    render() {
        const {email,recaptcha, password, error,redirectToReferer,loading} = this.state;
        if (redirectToReferer) {
           return <Redirect to="/"></Redirect>
       }
        return (
            
            <div className="container">
                <h2 className="mt-5 mb-5">SignIn</h2>
                <hr />
                <SocialLogin></SocialLogin>
                <hr/>
                <div className="alert alert-danger" style={{display:error?"":"NONE"}}>
                    {error}
                </div>
                {loading ? (
                    <div className="jumbotron tect-center">
                        <h2>Loading...</h2>
                        </div>
                ) : (
                        ""
                 )}


                {this.signinForm(email, password,recaptcha)}
                <p>
   <Link to="/forgot-password" className="text-danger">
       {" "}
       Forgot Password
   </Link>
</p>
            </div>
        );
    };
};

export default Signin;