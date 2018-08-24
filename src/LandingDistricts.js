// src/LandingDistricts.js

import React, { Component } from 'react';
import axios from 'axios';

class DistrictItem extends Component {
	render() {
		return (
		  <h1>{this.props.district.district_id}</h1>
		);
	}
}

export class LandingDistricts extends Component {
  constructor(props) {
    super(props);

    this.getDistricts = this.getDistricts.bind(this);
    this.state = { districts:  [] };
  }

  getDistricts() {
    axios({
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/get-districts`
      })
      .then(res => {
        this.setState({districts: res.data});
      })
      .catch(err => {
        console.error(err);
    })
  }

  componentWillMount() {
    this.getDistricts();
  }

  render() {
    return (
      <div>
        {this.state.districts.map(district => 
          <DistrictItem
            key={district.id}
            district={district}
          />
        )}
      </div>
    );
  }
}
