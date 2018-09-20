// src/admin/AdminUser.js

import React, { Component } from 'react';
import axios from 'axios';
import { Header } from '../Header';
import { Footer } from '../Footer';

class AdminUser extends Component {
  constructor(props) {
    super(props)

    this.state = { user: '', city: '', state: ''};
  }

  getUser(auth0_id) {
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/user`,
      params: {
        auth0_id: auth0_id
      }
    })
    .then(res => {
      this.setState({ user: res.data[0] })
    })
    .then(res => {
      this.getAndSetLocation()
    })
    .catch(err => {
      console.error(err);
    });
  }

  getAndSetLocation() {
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/lookup-zip-details`,
      params: { zip: this.state.user.zip }
    })
    .then(res => {
      this.setState({city: res.data[0].city, state: res.data[0].state});
    })
    .catch(err => {
      console.error(err);
    });
  }

  componentWillMount() {
    this.getUser(this.props.match.params.id);
  }

  handleChangeStatus(user, newQualState, event) {
    event.preventDefault();
    if (this.state.user.qual_state === newQualState) {
      return;
    }
    axios({
      method: 'POST',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/s/updateUserQualifiedState`,
      data: {
        auth0_id: this.state.user.auth0_id,
        qualState: newQualState
      }
    })
    .then(res => {
      this.getUser(this.state.user.auth0_id);
    })
    .catch(err => {
      console.error(err);
    });
  }

  renderStatus(props) {
    const buttonClass = function buttonClass(state, qualState) {
      return "w-25 btn btn-light small" + (qualState === state ? ' active' : '');
    };

    const user = props.original;
    const qualState = this.state.user.qual_state;
    return (
      <div className="btn-group btn-group-toggle w-100">
        <label
          className={buttonClass('banned', qualState)}
          onClick={this.handleChangeStatus.bind(this, user, 'banned')}
        >
          <input type="radio" name="status" id="banned" autoComplete="off" /> B
        </label>
        <label
          className={buttonClass('pre_qualified', qualState)}
          onClick={this.handleChangeStatus.bind(this, user, 'pre_qualified')}
        >
          <input type="radio" name="status" id="prequal" autoComplete="off" /> P
        </label>
        <label
          className={buttonClass('qualified', qualState)}
          onClick={this.handleChangeStatus.bind(this, user, 'qualified')}
        >
          <input type="radio" name="status" id="qual" autoComplete="off" /> Q
        </label>
        <label
          className={buttonClass('super_qualified', qualState)}
          onClick={this.handleChangeStatus.bind(this, user, 'super_qualified')}
        >
          <input type="radio" name="status" id="superqual" autoComplete="off" /> S
        </label>
      </div>
    );
  }

  render() {
		let emailUrl = "mailto:" + this.state.user.email;
		let twitterUrl = "https://www.twitter.com/" + this.state.user.twitter_profile_url;
		let facebookUrl = "https://www.facebook.com/" + this.state.user.facebook_profile_url;
		let linkedinUrl = "https://www.linkedin.com/in/" + this.state.user.linkedin_profile_url;
		let statusButtons = this.renderStatus(this.props);
    return (
      <React.Fragment>
      <Header auth={this.props.auth}/>
      <div className="mt-4 mb-4 ml-4 mr-4">
        <div>
          <span>Email address: 
            <a href={emailUrl}>{this.state.user.email}</a>
          </span>
        </div>

        <div>
          <span>Twitter profile: 
            <a href={twitterUrl} target="_blank">{this.state.user.twitter_profile_url}</a>
          </span>
        </div>

        <div>
          <span>Facebook profile: 
            <a href={facebookUrl} target="_blank">{this.state.user.facebook_profile_url}</a>
          </span>
        </div>

        <div>
          <span>LinkedIn profile: 
            <a href={linkedinUrl} target="_blank">{this.state.user.linkedIn_profile_url}</a>
          </span>
        </div>

        <div>
          <span>Location: 
            {this.state.city && <span>{this.state.city}, {this.state.state} </span>}
            {this.state.user.zip}
          </span>
        </div>

        <div>
          <span>Why write letters: 
            {this.state.user.why_write_letters}
          </span>
        </div>

        <div>
          {statusButtons}
        </div>

      </div>
      <Footer />
      </React.Fragment>
    )}
}

export default AdminUser
