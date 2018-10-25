// src/AuthError.js

import React, { Component } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

class AuthError extends Component {
    render() {
      let duplicateContext = this.props.history.location.state;
      let providerText;
      let duplicateText;

      if (duplicateContext.provider === 'google-oauth2') {
        providerText = "clicked ‘Sign up with Google’ or ‘Log in with Google,’";
      } else if (duplicateContext.provider === 'facebook') {
        providerText = "clicked ‘Sign up with Facebook’ or ‘Log in with Facebook,’";
      } else {
        providerText = "attempted to sign up with an email address and password,";
      }

      if (duplicateContext.duplicate === 'google-oauth2') {
        duplicateText = "clicking ‘Log in with Google’";
      } else if (duplicateContext.duplicate === 'facebook') {
        duplicateText = "clicking ‘Log in with Facebook’";
      } else {
        duplicateText = "providing your email address and password";
      }

      return (
        <React.Fragment>
          <Header auth={this.props.auth} />
            <div className="row">
              <div className="col-sm-4 col-10 mx-auto text-center my-5">
                <h1>Whoops!</h1>
                <p>
                  We detected a problem, but it’s easy to fix. It looks like you {providerText} but your email address is already registered in our system under an account you made previously by {duplicateText}.
                </p>
                <p>
                  To gain access to your existing account, please:
                </p>
                <ol>
                  <li>Return to <a href="/">our home page</a></li>
                  <li>Click “Log In”</li>
                  <li><strong>Important:</strong> Click “Not Your Account?” to reset the login system.</li>
                  <li>Log in by {duplicateText}.</li>
                </ol>
              </div>
            </div>
          <Footer />
        </React.Fragment>
      );
    }
  }

export default AuthError;
