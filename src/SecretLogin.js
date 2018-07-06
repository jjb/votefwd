// src/Home.js

import React, { Component } from 'react';
import { Header } from './Header';
import { LandingShowcase } from './LandingShowcase';
import { CallToAction } from './CallToAction';
import { Footer } from './Footer';
import { Login } from './Login';

class SecretLogin extends Component {
    render() {
      return (
        <React.Fragment>
          <Header auth={this.props.auth} />
          <div className="">
            { this.props.auth.isAuthenticated() ?
              (
                <div className="">
                  <a className="btn-lg" href="/dashboard">You’re signed in. Click here to send letters!</a>
                </div>
              ) :
              (
                <div className="text-center p-4">
                  <Login auth={this.props.auth} buttonText="Sign Up Or Log In To Send Letters" />
                </div>
              )
            }
          </div>
        </React.Fragment>
      );
    }
  }

export default SecretLogin;
