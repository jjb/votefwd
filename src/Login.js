// src/Login.js

import React, { Component } from 'react';

export class Login extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login()
  }

  logout() {
    this.props.auth.logout()
  }

  render() {
    let buttonText = 'Log In';
    if (this.props.buttonText) {
      buttonText = this.props.buttonText;
    }
    const { isAuthenticated } = this.props.auth;
    const pictureUrl = localStorage.getItem('picture_url');
    const username = localStorage.getItem('uid');

    return (
        <div className="pa2 tc">
          {
            !isAuthenticated() && (
              <button onClick={this.login.bind(this)} className="btn btn-primary btn-lg">
                {buttonText}
              </button>
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
      </div>
    );
  }
}
