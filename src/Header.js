// src/Header.js

import React, { Component } from 'react';
import { Login } from './Login';
import logo from './logo.svg';

export class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="/">
          <img src={logo} className="d-inline-block align-top" alt="logo" />
          Vote Forward
        </a>
        { this.props.auth.isAuthenticated() && <Login auth={this.props.auth} />}
      </nav>

    );
  }
}
