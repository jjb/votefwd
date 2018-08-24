// src/DistrictPicker.js

import React, { Component } from 'react';
import axios from 'axios';

class DistrictItem extends Component {
  selectDistrictAndClose(districtId) {
    this.props.updateDistrict(districtId);
    this.props.toggleDistrictPicker();
  }

  render() {
    return (
      <div>
        <h2>{this.props.district.district_id}</h2>
        <p className="small">{this.props.district.description}</p>
        <button className="btn btn-secondary"
            onClick={(e) => this.selectDistrictAndClose(this.props.district.district_id)}>
          Select
        </button>
      </div>
    )
  }
}

export class DistrictPicker extends Component {
  constructor(props) {
    super(props);

    this.getDistricts = this.getDistricts.bind(this);
    this.state = { districts: [] };
  }

  getDistricts() {
    axios({
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
      <div className="border">
        <div className="p-4">
          <button
              className="btn btn-secondary"
              onClick={this.props.toggleDistrictPicker}>
            Close
          </button>
          <h4 className="mb-3">Choose Your Target District</h4>
          <p>Most volunteers choose a nearby district, but feel free to choose a different one if you prefer — perhaps to support a candidate you particularly admire, or a district near where you grew up.</p>
          <div>
            {this.state.districts.map(district =>
              <DistrictItem
                key={district.id}
                district={district}
                updateDistrict={this.props.updateDistrict}
                toggleDistrictPicker={this.props.toggleDistrictPicker}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
