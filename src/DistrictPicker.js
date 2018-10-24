// src/DistrictPicker.js

import React, { Component } from 'react';
import axios from 'axios';

class DistrictItem extends Component {
  selectDistrictAndClose(districtId) {
    this.props.updateDistrict(districtId);
    this.props.toggleDistrictPicker();
  }

  render() {
    let allDone = false;
    const voterCount = parseInt(this.props.district.available_voter_count, 10);
    if (voterCount === 0) { allDone = true };
    let districtMarkup;
    if (allDone) {
      districtMarkup = (
        <div className="d-flex col-sm-12 col-md-4 col-lg-3 p-3">
          <div className="bg-light border rounded highlight-border-top">
            <div className="bg-white pl-3 pr-3 pt-3 pb-2 rounded">
              <h3>{this.props.district.state}</h3>
              <h5 className="headline text-primary">
                  {this.props.district.district_id}
              </h5>
              <p className="small text-success">All voters adopted!</p>
            </div>
            <div className="p-3">
              <p className="small">{this.props.district.description}</p>
            </div>
          </div>
        </div>
      );
    } else {
      districtMarkup= (
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
                <p className="small">
                  <span className="mr-2 text-info">
                    {voterCount.toLocaleString()}
                  </span>
                  addresses available
                </p>
            </div>
            <div className="p-3">
              <p className="small">{this.props.district.description}</p>
              <p className="small text-primary">
                Select district
              </p>
            </div>
          </div>
        </a>
      );
    }

    return (
      <React.Fragment>
        {districtMarkup}
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
      url: `${process.env.REACT_APP_API_URL}/get-districts-with-stats`
      })
      .then(res => {
        console.log(res.data);
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
    let districts = this.state.districts;
    districts.sort(function(a, b) {
      if (a.district_id < b.district_id) {
        return -1;
      }
      if (a.district_id > b.district_id) {
        return 1;
      }
      return 0;
    });
    return (
      <div className="border">
        <div className="p-4">
          <h4 className="mb-3">Choose Your Target District</h4>
          <p>Most volunteers choose a district (relatively) close to home, but feel free to choose a different one if you prefer — perhaps to support a candidate you particularly admire, or a district near where you grew up.</p>
          <div className="row">
            {districts
              .filter(district => parseInt(district.available_voter_count, 10) > 0)
              .map(district =>
              <DistrictItem
                key={district.id}
                district={district}
                updateDistrict={this.props.updateDistrict}
                toggleDistrictPicker={this.props.toggleDistrictPicker}
              />
            )}
          </div>
          
          <h5 className="mt-3 mb-3">Unavailable Districts</h5>
          <p>All voters have been adopted in these districts.</p>
          
          <div className="row">
            {districts
              .filter(district => parseInt(district.available_voter_count, 10) === 0)
              .map(district =>
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
