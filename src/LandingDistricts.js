// src/LandingDistricts.js

import React, { Component } from 'react';
import axios from 'axios';

class DistrictItem extends Component {
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

export class LandingDistricts extends Component {
  constructor(props) {
    super(props);

    this.getDistricts = this.getDistricts.bind(this);
    this.state = { districts: [] };
  }

  getDistricts() {
    axios({
      headers: {
        Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))
      },
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/get-districts-with-stats`
    })
      .then(res => {
        this.setState({ districts: res.data });
      })
      .catch(err => {
        console.error(err);
      });
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
      <div className="container pt-1 pb-5 mb-5">
        <h1
          id="target-districts"
          className="pt-3 mb-4 text-center"
        >
          Target Districts
        </h1>
        <div className="row">
          {districts.map(district => (
            <DistrictItem key={district.id} district={district} />
          ))}
        </div>
      </div>
    );
  }
}
