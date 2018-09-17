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
      <React.Fragment>
        <a 
          href={'/dashboard/' + this.props.district.district_id}
          className="d-flex col-sm-12 col-md-4 col-lg-3 p-3 reset-link hover-grow"
          onClick={(e) => this.selectDistrictAndClose(this.props.district.district_id)}
        >
          <div className="bg-light border rounded highlight-border-top">
            <div className="bg-white pl-3 pr-3 pt-3 pb-2 rounded">
              <h3>{this.props.district.state}</h3>
              <h5 className="headline text-primary">
                  {this.props.district.district_id}
              </h5>
            </div>
            <div className="p-3">
              <p className="small">{this.props.district.description}</p>

              <p className="small text-primary">
                Select district
              </p>
            </div>
          </div>
        </a>
      </React.Fragment>
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
          <h4 className="mb-3">Choose Your Target District</h4>
          <p>Most volunteers choose a district (relatively) close to home, but feel free to choose a different one if you prefer — perhaps to support a candidate you particularly admire, or a district near where you grew up.</p>
          <div className="row">
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
