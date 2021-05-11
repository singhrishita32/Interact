import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { socialLogin, authenticate } from "../Auth";
 
class SocialLogin extends Component {
    constructor() {
        super();
        this.state = {
            redirectToReferrer: false
        };
    }
 
    responseGoogle = response => {
        
        const { googleId, name, email, imageUrl } = response.profileObj;
        const user = {
            password: googleId,
            name: name,
            email: email,
            imageUrl: imageUrl
        };
        // console.log("user obj to social login: ", user);
        socialLogin(user).then(data => {
            console.log("signin data: ", data);
            if (data.error) {
                console.log("Error Login. Please try again..");
            } else {
                console.log("signin success - setting jwt: ", data);
                authenticate(data, () => {
                    this.setState({ redirectToReferrer: true });
                });
            }
        });
    };
 
    render() {
        // redirect
        const { redirectToReferrer } = this.state;
        if (redirectToReferrer) {
            return <Redirect to="/" />;
        }
 
        return (
            <GoogleLogin
                
                    clientId="702145786545-0nejd0ht9857t70e14pfi7rmo5922dcg.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
        );
    }
}
 
export default SocialLogin;
