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
    
    return ( this.props.auth.isAuthenticated() ? (
      <div>
      
      {!this.props.district.all_done &&
        <a
          href={'/dashboard/' + this.props.district.district_id}
          className="btn btn-primary btn-lg d-block"
        >
          Write letters to voters in {this.props.district.district_id}
        </a>
      }
      
      {this.props.district.all_done &&
        <a
          href='/#target-districts'
          className="btn btn-primary btn-lg d-block"
        >
          All voters adopted! Find another district
        </a>
      }
      
      </div>
    ) : (
      <div>
      
      {!this.props.district.all_done &&
        <Login auth={this.props.auth} signUpText={"Sign up to send letters to " + this.props.district.district_id} />
      }
      
      {this.props.district.all_done &&
        <a
          href='/#target-districts'
          className="btn btn-primary btn-lg d-block"
        >
          All voters adopted! Find another district
        </a>
      }
      
      </div>
    ));
  }
}

class DistrictView extends Component {
  render() {
    let d = this.props.district;
    let showResources;
    if(!d.url_ballotpedia && !d.url_wikipedia && !d.url_swingleft && !d.url_election_info) {
      showResources = false;
    } else {
      showResources = true;
    }

    // handle null stats, treating them as "0";
    const numAdopted = this.props.district.voters_adopted ? parseInt(this.props.district.voters_adopted, 10) : 0;
    const numPrepped = this.props.district.letters_prepped ? parseInt(this.props.district.letters_prepped, 10) : 0;
    const numSent = this.props.district.letters_sent ? parseInt(this.props.district.letters_sent, 10) : 0;
    this.props.district.total_claimed = numAdopted + numPrepped + numSent;
    
    const numAvailable = this.props.district.voters_available ? parseInt(this.props.district.voters_available, 10) : 0;
    
    // Calculate total letters to prepare
    const totalAvailable = this.props.district.total_claimed + numAvailable
          
    if (totalAvailable > 0) {
      this.props.district.percent_complete = Math.round((this.props.district.total_claimed/totalAvailable) * 1000) / 10;
    } else {
      this.props.district.percent_complete = 0;
    }
    
    this.props.district.all_done = false;
    if (this.props.district.percent_complete === 100) {
      this.props.district.all_done = true;
    }

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
            <p className="mb-4"><strong>Where?</strong> {this.props.district.description}</p>
            <p className="mb-4"><strong>Why this one?</strong> {this.props.district.why_this_district}</p>
            <p className="mb-4"><strong>Which voters?</strong> We’re writing letters to voters in the district who don’t always vote, but who are very likely to vote for Democrats when they do cast a ballot.</p>
            <DistrictCallToAction auth={this.props.auth} district={this.props.district} />
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
        { showResources &&
          <div className="row">
            <div className="col-12 pt-3 mt-3">
              <DistrictLinks district={this.props.district} />
            </div>
          </div>
        }
      </div>
    )
  }
}

class DistrictLinks extends Component {
  render() {
    return(
      <div>
        <h4 className="u-quiet mb-4 font-weight-normal">Other resources</h4>

        {this.props.district.url_ballotpedia &&
          <div className="mt-1">
            <a href={this.props.district.url_ballotpedia}
                target="_blank"
                rel="noreferrer noopener">
              <i className="fa fa-external-link"></i> Read about the race (Ballotpedia)
            </a>
          </div>
        }

        {this.props.district.url_wikipedia &&
          <div className="mt-1">
            <a href={this.props.district.url_wikipedia}
                target="_blank"
                rel="noreferrer noopener">
              <i className="fa fa-external-link"></i> Read about the district (Wikipedia)
            </a>
          </div>
        }

        {this.props.district.url_swingleft &&
          <div className="mt-1">
            <a href={this.props.district.url_swingleft + '?utm_source=votefwd'}
                target="_blank"
                rel="noreferrer noopener">
              <i className="fa fa-external-link"></i> Help in other ways (Swing Left)
            </a>
          </div>
        }

        {this.props.district.url_election_info &&
          <div className="mt-1">
            <a href={this.props.district.url_election_info}
                target="_blank"
                rel="noreferrer noopener">
              <i className="fa fa-external-link"></i> Look up {this.props.district.state} polling place
            </a>
          </div>
        }
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
    return (
      <div className="pt-3 pb-3 bw-2">
        <h4 className="mb-3">Letter-writing progress</h4>
        { !this.props.district.all_done &&
          <p>Currently <strong>{this.props.district.num_users_using_district}</strong> volunteers are writing letters to {this.props.district.district_id}. They’ve adopted {this.props.district.total_claimed} voters, {this.props.district.percent_complete}% of the targeted voters.</p>
        }
        { this.props.district.all_done && <p className="mb-3">All {this.props.district.total_claimed} target voters in {this.props.district.district_id} have been adopted! <span className="font-weight-bold font-weight-italic">Great work, volunteers.</span></p> }
        <div className="p-statusBar mb-3">
          <div
            className={'p-statusBar_bar ' + (this.props.district.all_done ? ' complete' : '' )}
            style={{
              "width":this.props.district.percent_complete + '%'
            }}
          ></div>
          <div className="p-statusBar_status">
            <strong>{this.props.district.total_claimed}</strong> voters adopted
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
