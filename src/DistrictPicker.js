// src/DistrictPicker.js
//
import React, { Component } from 'react';
import axios from 'axios';

class DistrictItem extends Component {
  render() {
    return (
      <li>
        {this.props.district.district_id}
      </li>
    )
  }
}

export class DistrictPicker extends Component {
  constructor(props) {
    super(props);

    this.updateDistrict = this.updateDistrict.bind(this);
    this.getDistricts = this.getDistricts.bind(this);
    this.state = { districts: [] };
  }

  updateDistrict() {
    console.log('hi');
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
        <div className="p-4">
          <h4 className="mb-3">Choose Your District</h4>
          <p className="small my-3">
            Available districts:
            {this.state.districts.map(district =>
              <DistrictItem
                key={district.id}
                district={district}
              />
            )}
          </p>
          <ul>
          </ul>
        </div>
      </div>
    );
  }
}
