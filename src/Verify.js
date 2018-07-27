// src/Verify.js

import React, { Component } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Qualify } from './Qualify';
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
      <div className="h-100 d-md-flex flex-column">
      <Header auth={this.props.auth} />
      <div className="container-fluid h-75 bg-pattern d-flex justify-content-center">
        <div className="d-flex">
          <div className="bg-white px-3 px-md-5 py-3 py-md-4 align-self-center">
            <h1>Verify</h1>
            <Qualify user={this.state.user} updateUser={this.updateUser}/>
          </div>
        </div>
      </div>
      <Footer />
      </div>
    );
  }
}

export default Verify
