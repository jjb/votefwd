// src/VoterOffer.js

import React, { Component } from 'react';
import axios from 'axios';

export class VoterOffer extends Component {
  constructor(props) {
    super(props);

    this.getVoter = this.getVoter.bind(this);
    this.acceptVoter = this.acceptVoter.bind(this);
    this.state = {};
  }

  getVoter() {
    axios.get(`${process.env.REACT_APP_API_URL}/voters`)
      .then(res => {
        let voter = res.data[Math.floor(Math.random() * res.data.length)];
        this.setState( {voter: voter} );
        console.log(this.state.voter);
      })
      .catch(err => {
        console.error(err)
      });
  }

  acceptVoter() {
    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API_URL}/voters`,
      data: { id: this.state.voter.id, adopterUserId: 'auth0|5aac2cd53092f503a3de2509'}
      })
      .then(res => {
        this.props.handleAccept(this.state.voter);
        this.setState({voter: {}})
      })
      .catch(err => {
        console.error(err);
    })
  }

  render() {
    let content;
    if (this.state.voter !== undefined && this.state.voter.id) {
      let voter = this.state.voter;
      content = ( 
        <article className="mw5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10">
        <div className="tc">
            <img 
              src="http://tachyons.io/img/avatar_1.jpg" 
              className="br-100 h3 w3 dib" alt="Voter avatar" />
            <h1 className="f4">{voter.first_name} {voter.last_name}</h1>
            <hr className="mw3 bb bw1 b--black-10"></hr>
          </div>
          <p className="lh-copy measure center f6 black-70">
            {voter.state}
          </p>
          <button onClick={this.acceptVoter}>Accept Voter</button>
        </article>
      )
    }
    return (
      <div>
        <button onClick={this.getVoter}>Voter Me Please</button>
        {content}
      </div>
    )
  }
}
