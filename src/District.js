// src/District.js

import React, { Component } from 'react';
import { Header } from './Header';
import axios from 'axios';
import { LandingDistricts } from './LandingDistricts';
import { Login } from './Login';
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";
import { Footer } from './Footer';

class DistrictCallToAction extends Component {
  render() {
    const buttonText = "Log in to send letters to " + this.props.district.district_id;
    return ( this.props.auth.isAuthenticated() ? (
      <div>
        <a
          href={'/dashboard/' + this.props.district.district_id}
          className="btn btn-primary btn-lg d-block"
        >
          Write letters to voters in {this.props.district.district_id}
        </a>
      </div>
    ) : (
      <Login auth={this.props.auth} buttonText={buttonText} />
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
          <div className="col-md mt-2">
            <h1 className="mb-0">Flip {this.props.district.district_id} Blue!</h1>
            <h4 className="u-quiet mb-4 font-weight-normal">{this.props.district.display_name}</h4>
            <p className="mb-4">{this.props.district.description}</p>
            <p className="mb-4">{this.props.district.why_this_district}</p>
            <DistrictCallToAction auth={this.props.auth} district={this.props.district} />
            <DistrictLinks district={this.props.district} />
          </div>
          <div className="col-md mt-2">
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

class DistrictLinks extends Component {
  render() {
    return(
      <div className="mt-2">
        <div className="link">
          <a href={this.props.district.url_ballotpedia}
              target="_blank"
              rel="noreferrer noopener">
            <i className="fa fa-external-link"></i> Read about the race (Ballotpedia)
          </a>
        </div>

        <div className="mt-1">
          <a href={this.props.district.url_wikipedia}
              target="_blank"
              rel="noreferrer noopener">
            <i className="fa fa-external-link"></i> Read about the district (Wikipedia)
          </a>
        </div>

        <div className="mt-1">
          <a href={this.props.district.url_swingleft + '?utm_source=votefwd'}
              target="_blank"
              rel="noreferrer noopener">
						<i className="fa fa-external-link"></i> Help in other ways (Swing Left)
          </a>
        </div>

        <div className="mt-1">
          <a href={this.props.district.url_election_info}
              target="_blank"
              rel="noreferrer noopener">
            <i className="fa fa-external-link"></i> Look up a {this.props.district.state} polling place
          </a>
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
    // handle null stats, treating them as "0";
    const numAdopted = this.props.district.voters_adopted ? parseInt(this.props.district.voters_adopted, 10) : 0;
    const numPrepped = this.props.district.letters_prepped ? parseInt(this.props.district.letters_prepped, 10) : 0;
    const numSent = this.props.district.letters_sent ? parseInt(this.props.district.letters_sent, 10) : 0;
    const totalClaimed = numAdopted + numPrepped + numSent;
    const numAvailable = this.props.district.voters_available ? parseInt(this.props.district.voters_available, 10) : 0;
    // Calculate total letters to prepare
    const totalAvailable = totalClaimed + numAvailable

    let percentComplete;
    if (totalAvailable > 0) {
      percentComplete = (totalClaimed/totalAvailable) * 100;
    } else {
      percentComplete = 0;
    }

    return (
      <div className="pt-3 pb-3 bw-2">
        <p>So far <strong>{this.props.district.num_users_using_district}</strong> volunteers are stockpiling letters to {this.props.district.district_id}. They’ve adopted {totalClaimed} voters, {percentComplete}% of the total available.</p>
        <h4 className="mb-3">{this.props.district.district_id} letter-writing progress</h4>
        <div className="p-statusBar mb-3">
          <div
            className="p-statusBar_bar"
            style={{
              "width":percentComplete + '%'
            }}
          ></div>
          <div className="p-statusBar_status">
            <strong>{totalClaimed}</strong> voters adopted
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
