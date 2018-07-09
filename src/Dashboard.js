// src/Dashboard.js

import React, { Component } from 'react';
import axios from 'axios';
import history from './history';
import { AdoptVoter } from './AdoptVoter';
import { Header } from './Header';
import { Login } from './Login';
import { Qualify } from './Qualify';
import { VoterList } from './VoterList';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.handleAdoptedVoter = this.handleAdoptedVoter.bind(this);
    this.handleConfirmSent = this.handleConfirmSent.bind(this);
    this.handleConfirmPrepped = this.handleConfirmPrepped.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.state = { voters: [], user: {}, isQualified: true }
  }

  getCurrentUser() {
    let user_id = localStorage.getItem('user_id');
    if (user_id) {
      axios({
        method: 'GET',
        headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
        url: `${process.env.REACT_APP_API_URL}/user`,
        params: { auth0_id: user_id }
        })
        .then(res => {
          let user = res.data[0];
          if (!this.isQualified(user)) {
            this.setState({ isQualified: false });
          }
          this.setState({ user: res.data[0] })
        })
        .catch(err => {
          console.error(err)
        });
      return true;
    }
    else {
      return false;
    }
  }

  isQualified(user) {
    if ( user.is_human_at && user.pledged_vote_at && user.is_resident_at &&
      user.full_name && user.accepted_code_at && user.zip) {
      return true;
    } else {
      return false;
    }
  }

  getAdoptedVoters() {
    let user_id = localStorage.getItem('user_id');
    if(user_id) {
      var headers = {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))};
      axios.get(
        `${process.env.REACT_APP_API_URL}/voters`,
        {
          headers: headers,
          params: {
            user_id: user_id,
          }
        })
        .then(res => {
          this.setState( {voters: res.data} );
        })
        .catch(err => {
          console.error(err)
        });
    }
  }

  handleAdoptedVoter(voters) {
    for (var i = 0; i < voters.length; i++){
      var voter = voters[i];
      this.setState({ voters: this.state.voters.concat([voter])});
    }
  }

  handleConfirmPrepped(voter) {
    axios({
      method: 'PUT',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/voter/confirm-prepped`,
      data: { id: voter.id }
      })
      .then(res => {
        voter.confirmed_prepped_at = res.data[0].confirmed_prepped_at;
        var voters = this.state.voters;
        // find the position of the voter in the voters array
        var index = voters.map(function(voter) {return voter.id}).indexOf(voter.id);
        if (index !== -1) {
          voters[index] = voter;
        }
        this.setState({ voters: voters });
      })
      .catch(err => {
        console.error(err);
    })
  }

  handleConfirmSent(voter) {
    axios({
      method: 'PUT',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/voter/confirm-sent`,
      data: { id: voter.id }
      })
      .then(res => {
        voter.confirmed_sent_at = res.data[0].confirmed_sent_at;
        var voters = this.state.voters;
        // find the position of the voter in the voters array
        var index = voters.map(function(voter) {return voter.id}).indexOf(voter.id);
        if (index !== -1) {
          voters[index] = voter;
        }
        this.setState({ voters: voters });
      })
      .catch(err => {
        console.error(err);
    })
  }

  updateUser(key, value) {
    let data = {}
    data['auth0_id'] = localStorage.getItem('user_id');
    data[key] = value;
    axios({
      method: 'POST',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/user`,
      data: data
    })
    .then(
      this.setState({ user: {...this.state.user, [key]: value}})
    )
    .catch(err => {
      console.error(err);
    });
  }

  componentWillMount(){
    this.getCurrentUser();
    if (!this.getCurrentUser()) {
      history.replace('/');
    }
    this.getAdoptedVoters();
  }

  render() {
    return (
      <div>
      <Header auth={this.props.auth} />
      { this.props.auth.isAuthenticated() ? (
        <div>
          { !this.state.isQualified &&
            <Qualify user={this.state.user} updateUser={this.updateUser}/>
          }
          <AdoptVoter handleAdoptedVoter={this.handleAdoptedVoter}/>
          <div class="container py-5">
            <VoterList
              voters={this.state.voters}
              confirmPrepped={this.handleConfirmPrepped}
              confirmSent={this.handleConfirmSent}
            />
          </div>
        </div>
      ) : (
          <div className="container">
            <Login auth={this.props.auth} buttonText="Sign Up or Log In To Send Letters" />
          </div>
        )}
      </div>
    );
  }
}

export default Dashboard
