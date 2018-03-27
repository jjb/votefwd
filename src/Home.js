// src/Home.js

import React, { Component } from 'react';
import { Header } from './Header';
import './App.css';

class Home extends Component {
  render() {
    return (
      <div className="sans-serif">
        <Header auth={this.props.auth}/>
        <div className="tc">
          <h1>What brings you here today?</h1>
          <a className="link ma2" href="/dashboard">I want to send plea letters.</a>
          <a className="link ma2" href="/pledge">I was asked to pledge to vote.</a>
        </div>
      </div>
    );
  }
}

export default Home;
