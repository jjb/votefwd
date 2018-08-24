// src/Home.js

import React, { Component } from 'react';
import { Header } from './Header';
import { LandingShowcase } from './LandingShowcase';
import { LandingDistricts } from './LandingDistricts';
import { CallToAction } from './CallToAction';
import { Footer } from './Footer';

class Home extends Component {
    render() {
      return (
        <React.Fragment>
          <Header auth={this.props.auth} showMasthead />
          <LandingDistricts />
          <LandingShowcase />
          <CallToAction />
          <Footer />
        </React.Fragment>
      );
    }
  }

export default Home;
