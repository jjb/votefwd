//src/CheckPreQual.js
import React, { Component } from 'react';
import axios from 'axios';
import Verify from './Verify';

class CheckPreQual extends Component {
  constructor(props) {
    super(props);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.handleComponentChange = this.handleComponentChange.bind(this);
    this.state =
      { user: {},
        isPreQualified: false
      }
  }


  getCurrentUser() {
    console.log('in getCurrentUser');
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/user`,
      params: { auth0_id: localStorage.getItem('user_id')}
      })
      .then(res => {
        console.log('in then clause of axios');
        let user = res.data[0];
        console.log(`res.data[0] is ${res.data[0]}`);
        this.setState(
          { user: user }
        )
      })
      .catch(err => {
        console.error(err)
      });
  }


  isPreQualified(user) {
    if ( user.qual_state === "pre_qualified") {
      return true;
    } else {
      return false;
    }
  }

  handleComponentChange() => {

    let user = this.state.user;

    if (this.isPreQualified(user)) {
      let verify = 'Verify';
      this.props.component(verify);
    }
  }

  componentWillMount(){

      console.log('In componentWillMount');
      this.getCurrentUser();
      handleComponentChange();

  }

  render() {
    let component = this.props.component;

    console.log(`component in CheckPreQual is ${component}`);
    console.log(`user is ${Object.entries(user)}`);
    console.log(`isQualified is ${this.isPreQualified(user)}`);


      return (
    );
  }
}

export default CheckPreQual
