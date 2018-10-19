// src/AuthError.js

import React, { Component } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

class AuthError extends Component {
    render() {
      return (
        <React.Fragment>
          <Header auth={this.props.auth} />
            <div className="text-center mt-5 mb-5 w-50 mx-auto">
              <h1>Whoops!</h1>
              <p>
                We detected a problem! It looks like you tried to make an account with {this.props.history.location.state.provider}, but your email address is already in our system under an account you made with {this.props.history.location.state.duplicate}. Please return to <a href="/">the homepage of the website</a> and try logging in again, but with {this.props.history.location.state.duplicate}.</p>
            </div>
          <Footer />
        </React.Fragment>
      );
    }
  }

export default AuthError;
