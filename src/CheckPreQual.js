//src/CheckPreQual.js

import React, { Component } from 'react';
import axios from 'axios';

class CheckPreQual extends Component {
  constructor(props) {
    super(props);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.state =
      { user: {},
        isPreQualified: false
      }
  }


  getCurrentUser() {
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/user`,
      params: { auth0_id: localStorage.getItem('user_id')}
      })
      .then(res => {
        let user = res.data[0];
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

  componentWillMount(){

      this.getCurrentUser();

  }

  render() {
    let component = this.props.component;
    if (isPreQualified) {
      component={Verify}
    }
    return (
      <div>
         {component}
         </div>

    );
  }
}

export default CheckPreQual
