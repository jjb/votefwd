import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App tc mt6">
        <img src={logo} className="App-logo w5" alt="logo" />
        <h1 className="title">Vote Forward</h1>
      </div>
    );
  }
}

export default App;
