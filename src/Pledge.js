// src/Pledge.js

import React, { Component } from 'react';
import axios from 'axios';
import { Header } from './Header';

class PledgeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {value: '', pledgeStatus: false};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePledge = this.handlePledge.bind(this);
  }

  handlePledge() {
    this.setState({ pledgeStatus: true });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/voter/pledge`,
      data: { code: this.state.value }
    })
    .then(res => {
      if (res.data === 0) {
        alert('Code not recognized.')
      }
      else {
        this.handlePledge();
      }
    })
    .catch(err => {
      console.error(err);
    });
  }

  render() {
    let content;
    if (this.state.pledgeStatus) {
      content = (
        <p className="tc">Pledge received. Yay!</p>
      )
    }
    else {
      content = (
        <div className="tc">
          <form className="center db ma2" onSubmit={this.handleSubmit}>
            <label>
              Enter your voter pledge code here:
              <input className="center db ma2" type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input className="center db ma2" type="submit" value="Pledge to be a voter." />
          </form>
        </div>
      )
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}

class Pledge extends Component {
  render() {
    return (
      <div>
        <Header />
        <PledgeForm />
      </div>
    );
  }
}
 export default Pledge
