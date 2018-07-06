// src/Home.js

import React, { Component } from 'react';
import { Header } from './Header';
import { LandingShowcase } from './LandingShowcase';
import { CallToAction } from './CallToAction';
import { Footer } from './Footer';
import { Login } from './Login';

class Welcome extends Component {
  render() {
    return (
      <div className="home--action-container col col-lg-6 p-4 h-50">
        { this.props.auth.isAuthenticated() ?
          (
            <div className="">
              <a className="btn-lg" href="/dashboard">You’re signed in. Click here to send letters!</a>
            </div>
          ) :
          (
            <div className="text-center pt-5 pb-5">
              <Login auth={this.props.auth} buttonText="Sign Up Or Log In to send letters" />
            </div>
          )
        }
      </div>
    );
  }
}
class Home extends Component {
    render() {
      return (
        <React.Fragment>
          <Header auth={this.props.auth} showMasthead />
          <LandingShowcase />
          <CallToAction />
          <Footer />
          <div className="row h-100">
            <Welcome auth={this.props.auth} />
            <div className="col col-lg-6 p-4 bg-lightblue h-50">
              <p>Not sure what this is? <a className="link" target="_blank" rel="noopener noreferrer" href="https://votefwd.org">Click here to learn more</a>.</p>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }

export default Home;
