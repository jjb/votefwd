// src/Header.js

import React, { Component } from 'react';
import { Login } from './Login';
import logo from './images/vote-forward-logo.svg';

export class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-light bg-light mb-4">
        <a className="navbar-brand" href="/">
          <img src={logo} className="d-inline-block align-top logo" alt="Vote Forward" />
        </a>
        { this.props.auth.isAuthenticated() && <Login auth={this.props.auth} />}
      </nav>

    );
  }
}
