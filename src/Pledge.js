// src/Pledge.js

import React, { Component } from 'react';
import { Header } from './Header';

class PledgeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A code was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div className="tc">
        <form className="center db ma2" onSubmit={this.handleSubmit}>
          <label>
            Enter your voter pledge code here:
            <input className="center db ma2" type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input className="center db ma2" type="submit" value="Pledge to be a voter." />
        </form>
      </div>
    );
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
