import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class Header extends Component {
  render() {
    return (
      <div className="App tc pt3 bg-light-gray">
        <img src={logo} className="App-logo w3" alt="logo" />
        <h1 className="title pb2 blue">Vote Forward</h1>
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
      <div className="ma4">
        {this.state.voters.map(voter => <div key={voter.id}> {voter.name} </div>)}
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <VoterList url={process.env.REACT_APP_API_URL}/>
      </div>
    );
  }
}

export default App;
