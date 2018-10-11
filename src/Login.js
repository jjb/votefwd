// src/Login.js

import React, { Component } from 'react';
import GA from './utils/GoogleAnalytics';

export class Login extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  signup() {
    GA.trackEvent('click', 'clickedSignupButton');
    this.props.auth.login(false)
  }

  login() {
    GA.trackEvent('click', 'clickedLoginButton');
    this.props.auth.login(true)
  }

  logout() {
    GA.trackEvent('click', 'clickedLogOutButton');
    this.props.auth.logout()
  }

  render() {
    let signUpText = 'Sign Up';
    if (this.props.signUpText) {
      signUpText = this.props.signUpText;
    }
    const { isAuthenticated } = this.props.auth;
    const pictureUrl = localStorage.getItem('picture_url');
    const username = localStorage.getItem('uid');

    return (
        <React.Fragment>
          {
            !isAuthenticated() && (
              <div>
                <button onClick={this.signup.bind(this)} style={{ marginBottom:"10px"}} className="btn btn-success btn-lg w-100">
                  {signUpText}
                </button>
                <button onClick={this.login.bind(this)} className="btn btn-primary w-100">
                  Already have an account? Login
                </button>
              </div>
            )
          }
          {
            isAuthenticated() && (
              <div>
                <a href="/" onClick={this.logout.bind(this)} className="text-white mr-3">
                  Log Out
                </a>
                <img className="profile-pic rounded-circle d-inline mr-2" src={pictureUrl} alt={username} />
              </div>
            )
          }
      </React.Fragment>
    );
  }
}
