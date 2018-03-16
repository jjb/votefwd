import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App tc pt3 bg-light-gray">
        <img src={logo} className="App-logo w3" alt="logo" />
        <h1 className="title pb2 blue">Vote Forward</h1>
      </div>
    );
  }
}

export default App;
