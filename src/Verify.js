// src/Verify.js

import React, { Component } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Qualify } from './Qualify';
import history from './history';
import axios from 'axios';


class Verify extends Component {
  constructor(props) {
    super(props);

    this.updateUser = this.updateUser.bind(this);
    this.state = {
      user: {},
      isQualified: false
    }
  }

  componentWillMount(){
    this.getCurrentUser();
    if (!this.getCurrentUser()) {
      history.replace('/');
    }
    // TODO: Check to see if verified, redirect if they're already cool by us
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

  render() {
    return (
      <div>
      <Header auth={this.props.auth} />
      <div className="py-5 bg-pattern d-flex justify-content-center">
        <div
          className="d-flex"
          style={{
            maxWidth: "700px"
          }}
        >
          <div className="bg-white align-self-center">
            <h1 className="px-4 pt-4">Welcome to Vote Forward</h1>
            <Qualify user={this.state.user} updateUser={this.updateUser} auth={this.props.auth} />
          </div>
        </div>
      </div>
      <Footer />
      </div>
    );
  }
}

export default Verify
