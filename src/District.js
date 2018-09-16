// src/District.js

import React, { Component } from 'react';
import { Header } from './Header';
import { LandingShowcase } from './LandingShowcase';
import { CallToAction } from './CallToAction';
import { Footer } from './Footer';

class District extends Component {
    render() {
      return (
        <React.Fragment>
          <Header auth={this.props.auth} showMasthead />
          <LandingShowcase />
          <CallToAction />
          <Footer />
        </React.Fragment>
      );
    }
  }

export default District;
