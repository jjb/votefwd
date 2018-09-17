// src/Home.js

import React, { Component } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Login } from './Login';

class SecretLogin extends Component {
    render() {
      return (
        <React.Fragment>
          <Header auth={this.props.auth} />
          <div className="text-center mt-5">
            { this.props.auth.isAuthenticated() ?
              (
                <React.Fragment>
                  <p>You‘re already signed in!</p>
                  <a href="/dashboard">
                    <button type="button" className="btn btn-success">
                      Click here to send letters
                    </button>
                  </a>
                </React.Fragment>
              ) :
              (
                <div className="text-center p-4">
                  <Login auth={this.props.auth} buttonText="Sign up or log in to send letters" />
                </div>
              )
            }
          </div>
          <div className="fixed-bottom">
            <Footer />
          </div>
        </React.Fragment>
      );
    }
  }

export default SecretLogin;
