// src/Header.js

import React, { Component } from 'react';
import logo from './logo.svg';

export class Header extends Component {
  render() {
    return (
      <div className="tc">
        <div className="fl w-100 pa2">
          <img src={logo} className="App-logo w3" alt="logo" />
          <h1 className="title pb2">Vote Forward</h1>
        </div>
      </div>
    );
  }
}
