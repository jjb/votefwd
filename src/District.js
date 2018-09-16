// src/District.js

import React, { Component } from 'react';
import { Header } from './Header';
import axios from 'axios';
import { Footer } from './Footer';

class DistrictView extends Component {
  render() {
    return (
      <div className="container">
        <div className="row pt-3">
          <div className="col-6">
            <h1 class="d-block">Flip <span class="highlight blue">{this.props.district.district_id}</span> Blue</h1>
            <h3>{this.props.district.state}</h3>
            <p>{this.props.district.description}</p>
            <div>
              {this.props.district.lat}, {this.props.district.long}<br />
              {this.props.district.return_address}<br />
              {this.props.district.ra_city}, {this.props.district.ra_state} {this.props.district.ra_zip}<br />
            </div>
          </div>
          <div className="col-6">
            MAP GOES HERE
          </div>
        </div>
      </div>
    )
  }
}
class District extends Component {
    constructor(props) {
      super(props);

      this.state = {
        currentDistrict: undefined
      };
    }

    componentWillMount() {
      // Pull ID from /district/:id -- see routes.js for initial reference point
      if (this.props.match.params.id) {
        const districtToFetch = this.props.match.params.id.toUpperCase();
        this.getDistrict(districtToFetch);
      }
    }

    getDistrict(districtId) {
      if (districtId) {
        axios({
          method: 'GET',
          headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
          url: `${process.env.REACT_APP_API_URL}/lookup-district`,
          params: {district_id: districtId }
          })
          .then(res => {
            if (res.data.length !== 0) {
              console.log('*******',res.data[0]);
              this.setState({ currentDistrict: res.data[0]});
            } else {
              this.setState({ districtNotFound: true });
            }
          })
          .catch(err => {
            console.error(err);
            this.setState({ districtNotFound: true });
        })
      }
      else {
        this.setState({ districtNotFound: true });
      }
    }

    render() {
      return (
        <div>
          <Header auth={this.props.auth} />
          {!this.state.districtNotFound && this.state.currentDistrict ? (
            <div>
              <DistrictView district={this.state.currentDistrict} />
            </div>
          ) : (
            <div>District not found!</div>
          )}
        </div>
      );
    }
  }

export default District;
