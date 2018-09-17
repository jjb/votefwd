// src/District.js

import React, { Component } from 'react';
import { Header } from './Header';
import axios from 'axios';
import { LandingDistricts } from './LandingDistricts';
import { Login } from './Login';
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";
import { Footer } from './Footer';

class DistrictCallToAction extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return ( this.props.auth.isAuthenticated() ? (
      <div>
        <a
          href={'/dashboard/' + this.props.district.district_id}
          className="btn btn-primary btn-lg d-block"
        >
          Write letters to {this.props.district.state} voters
        </a>
      </div>
    ) : (
      <Login auth={this.props.auth} buttonText="Sign up or log in to send letters" />
    ));
  }
}

class DistrictView extends Component {
  render() {
    return (
      <div className="container pt-5 pb-5 mb-5">
        <div className="row">
          <div className="col-12 mb-4">
            <a href="/#target-districts">
							<i className="fa fa-arrow-left"></i>
              <span className="pl-2">View all districts</span>
            </a>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <h1 className="mb-0">Flip {this.props.district.district_id} Blue</h1>
            <h4 className="u-quiet mb-4 font-weight-normal">{this.props.district.state}</h4>
            <p className="mb-4">{this.props.district.description}</p>
            <DistrictCallToAction auth={this.props.auth} district={this.props.district} />
          </div>
          <div className="col-6">
            <DistrictMap district={this.props.district} />
          </div>
        </div>
        <div className="row">
          <div className="col-12 pt-3 mt-3">
            <DistrictStats district={this.props.district} />
          </div>
        </div>
      </div>
    )
  }
}

class DistrictMap extends Component {
  render() {
    const Map = ReactMapboxGl({
      accessToken: "pk.eyJ1IjoiaGV5aXRzZ2FycmV0dCIsImEiOiIwdWt5ZlpjIn0.73b7Y47rgFnSD7QCNeS-zA",
      interactive: false
    });

    const geojsonSource = "/districts/" + this.props.district.district_id.toUpperCase() + ".geojson";

    return (
      <div>
        <Map
          // eslint-disable-next-line
          style="mapbox://styles/mapbox/light-v9"
          center={[this.props.district.long, this.props.district.lat]}
          zoom={[6]}
          // onStyleLoad={this.onStyleLoad}
          containerStyle={{
            height: "50vh",
            width: "100%"
          }}>
          <GeoJSONLayer
            data={geojsonSource}
            type="fill"
            fillPaint={{
              "fill-color": "rgba(43,116,255,0.5)",
              "fill-outline-color": "rgba(43,116,255,1)"
            }}
          />
        </Map>
      </div>
    );
  }
}
class DistrictStats extends Component {
  render() {
    // Calculate total letters to prepare
    const totalClaimed =  parseInt(this.props.district.letters_sent) +
                          parseInt(this.props.district.letters_prepped) +
                          parseInt(this.props.district.voters_adopted);
    const totalAvailable = totalClaimed + parseInt(this.props.district.voters_available);
    const percentComplete = (totalClaimed/totalAvailable) * 100;

    return (
      <div className="pt-3 pb-3 bw-2">
        <h4 className="mb-3">{this.props.district.district_id} letter-writing progress</h4>
        <div className="p-statusBar mb-3">
          <div
            className="p-statusBar_bar"
            style={{
              "width":percentComplete + '%'
            }}
          ></div>
          <div className="p-statusBar_status">
            <strong>{totalClaimed}</strong> letters prepared
          </div>
        </div>
      </div>
    );
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
          params: {
            district_id: districtId,
            get_adoption_details: true
          }
          })
          .then(res => {
            if (res.data.length !== 0) {
              this.setState({ currentDistrict: res.data[0]});
            } else {
              this.setState({ districtNotFound: true });
            }
          })
          .catch(err => {
            this.setState({ districtNotFound: true });
        })
      }
    }

    render() {
      return (
        <div>
          <Header auth={this.props.auth} />
          {!this.state.districtNotFound && this.state.currentDistrict ? (
            <div>
              <DistrictView district={this.state.currentDistrict} auth={this.props.auth} />
            </div>
          ) : (
            <LandingDistricts />
          )}
          <Footer />
        </div>
      );
    }
  }

export default District;
