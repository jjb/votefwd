// src/Contact.js

import React, { Component } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

class Contact extends Component {
  render() {
    return (
      <div>
        <Header auth={this.props.auth}/>

    <header className="header bg-light">
      <div className="container">
        <div className="row">
          <div className="h-100 text-center m-auto">
            <h1 className="mb-4 mt-4 pb-4 mb-lg-0">Contact Us</h1>
          </div>
        </div>
      </div>
    </header>

        <div className="container">
        <div className="row col-lg-8 m-auto">
          <div className="text-body h-100 mt-4 mb-4 text-lg-left">
            <p>Vote Forward is an independent 527 nonprofit organization that connects citizens to one another to increase voter turnout, especially among Democrats.</p>
            <h4>Mailing Address</h4>
            <p>P.O. Box 28522<br />
            Oakland, CA 94604</p>
            <p><strong>Press inquiries:</strong> <a href="mailto:press@votefwd.org">press@votefwd.org</a></p>
            <p><strong>Questions about our process?</strong> Read our <a href="/faq">Frequently Asked Questions.</a></p>
            <p><strong>Need help?</strong> Visit our <a href="/support">support page.</a></p>
          </div>
        </div>
      </div>
    <Footer />
  </div>
    );
  }
}

export default Contact
