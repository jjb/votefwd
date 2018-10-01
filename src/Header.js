// src/Header.js

import React, { Component } from 'react';
import { Login } from './Login';
import { Logo } from './Logo';
import { Masthead } from './Masthead';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar">
        <a className="logo" href="/">
            <Logo />
        </a>
        <a className="text-white" href="/vote-forward-party-kit.pdf" target="_blank" rel="noopener noreferrer">Throw a letter party!</a>
        { this.props.auth.isAuthenticated() &&
          <Login auth={this.props.auth} />
        }
      </nav>
    );
  }
}
export class Header extends Component {
  render() {
    return (
      <React.Fragment>
        { !this.props.showMasthead ?
          (
            <Navbar {...this.props} />
          ) :
          (
            <Masthead auth={this.props.auth} />
          )
        }
      </React.Fragment>
    );
  }
}
