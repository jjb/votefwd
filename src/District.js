// src/District.js

import React, { Component } from 'react';
import { Header } from './Header';
import axios from 'axios';
import { LandingDistricts } from './LandingDistricts';
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";
import { Footer } from './Footer';

class DistrictView extends Component {
  render() {
    return (
      <div className="container pt-5 pb-5 mb-5">
        <div className="row">
          <div className="col-12 mb-3">
            <a href="/#target-districts">
							<i className="fa fa-arrow-left"></i>
              <span className="pl-2">Back to home</span>
            </a>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <h1>Flip {this.props.district.district_id} Blue</h1>
            <h3>{this.props.district.state}</h3>
            <p>{this.props.district.description}</p>
            <div>
              {this.props.district.lat}, {this.props.district.long}<br />
              {this.props.district.return_address}<br />
              {this.props.district.ra_city}, {this.props.district.ra_state} {this.props.district.ra_zip}<br />
            </div>
          </div>
          <div className="col-6">
            <DistrictMap district={this.props.district} />
          </div>
        </div>
        <div className="row">
          <div className="col-12 pt-3 mt-3 border-top bw-2">
            <DistrictStats district={this.props.district} />
          </div>
        </div>
      </div>
    )
  }
}

class DistrictMap extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const Map = ReactMapboxGl({
      accessToken: "pk.eyJ1IjoiaGV5aXRzZ2FycmV0dCIsImEiOiIwdWt5ZlpjIn0.73b7Y47rgFnSD7QCNeS-zA",
      interactive: false
    });

    const geojsonSource = "/districts/" + this.props.district.district_id.toUpperCase() + ".geojson";

    return (
      <div>
        <Map
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
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        GIMME DEM STATS
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
              console.log('*******',res.data[0]);
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
              <DistrictView district={this.state.currentDistrict} />
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
