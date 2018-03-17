// src/App.js

import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class Header extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login()
  }

  logout() {
    this.props.auth.logout()
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="tc">
        <div className="fl w-100 pa2">
          <img src={logo} className="App-logo w3" alt="logo" />
          <h1 className="title pb2">Vote Forward</h1>
        </div>
        <div className="fl w-100 pa2">
          {
            !isAuthenticated() && (
              <button onClick={this.login.bind(this)}>
                Log In
              </button>
            )
          }
          {
            isAuthenticated() && (
              <button onClick={this.logout.bind(this)}>
                Log Out
              </button>
            )
          }
        </div>
      </div>
    );
  }
}

class VoterList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      voters: []
    }
  }
  
  getVoters() {
    axios.get(`${this.props.url}/voters`)
      .then(res => {
        let voters = res.data;
        this.setState( {voters: voters} );
      })
      .catch(err => {
        console.error(err)
      });
  }

  componentWillMount(){
    this.getVoters()
  }

  render() {
    return (
      <div className="pa2">
        <h2 className="title tc">Your adopted voters</h2>
        {this.state.voters.map(voter => <div className="ml5 h3 ba mt2" key={voter.id}> {voter.id} {voter.name} </div>)}
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="sans-serif">
        <Header auth={this.props.auth}/>
        <VoterList url={process.env.REACT_APP_API_URL}/>
      </div>
    );
  }
}

export default App;
