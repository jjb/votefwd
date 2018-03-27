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
    const { isAuthenticated } = this.props.auth;
    let pictureUrl = localStorage.getItem('picture_url');
    return (
        <div className="fr pa2">
          {
            !isAuthenticated() && (
              <button onClick={this.login.bind(this)}>
                Log In
              </button>
            )
          }
          {
            isAuthenticated() && (
              <div>
                <button onClick={this.logout.bind(this)}>
                  Log Out
                </button>
                <img className="br-100 h2 w2 dib pa2 v-mid" src={pictureUrl} alt="Current user's avatar"/>
              </div>
            )
          }
      </div>
    );
  }
}
