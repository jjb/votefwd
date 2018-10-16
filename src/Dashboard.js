//src/Dashboard.js

import React, { Component } from 'react';
import axios from 'axios';
import history from './history';
import { AdoptVoter } from './AdoptVoter';
import { DistrictPicker } from './DistrictPicker';
import { Header } from './Header';
import { Login } from './Login';
import { VoterList } from './VoterList';
import { Footer } from './Footer';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.handleAdoptedVoter = this.handleAdoptedVoter.bind(this);
    this.handleConfirmSent = this.handleConfirmSent.bind(this);
    this.handleConfirmPrepped = this.handleConfirmPrepped.bind(this);
    this.handleConfirmAllPrepped = this.handleConfirmAllPrepped.bind(this);
    this.handleConfirmAllSent = this.handleConfirmAllSent.bind(this);
    this.handleUndoConfirmPrepped = this.handleUndoConfirmPrepped.bind(this);
    this.handleUndoConfirmSent = this.handleUndoConfirmSent.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.getCurrentDistrict = this.getCurrentDistrict.bind(this);
    this.updateDistrict = this.updateDistrict.bind(this);
    this.toggleDistrictPicker = this.toggleDistrictPicker.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.state =
      { voters: [],
        user: {},
        currentDistrict: {},
        isQualified: false,
        pickingDistrict: false
      }
  }

  isLoggedIn() {
    if (localStorage.getItem('user_id')) {
      return true;
    }
    else {
      return false;
    }
  }

  // TODO: Probably abstract this out
  getCurrentUser() {
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/user`,
      params: { auth0_id: localStorage.getItem('user_id')}
      })
      .then(res => {
        let user = res.data[0];
        this.setState(
          { user: user },
          () => {this.getCurrentDistrict(this.state.user.current_district)}
        )
        // TODO: Return to here and find better way of abstracting qualification
        if (!this.isQualified(user)) {
          history.replace('/verify');
        }
      })
      .catch(err => {
        console.error(err)
      });
  }

  getCurrentDistrict(districtId) {
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
          if (res.data.length === 0 || !res.data) {
            this.setState({ pickingDistrict: true })
          }
          else {
            this.setState({ currentDistrict: res.data[0]});
          }
        })
        .catch(err => {
          console.error(err);
      })
    }
    else {
      this.setState({ pickingDistrict: true });
    }
  }

  toggleDistrictPicker() {
    let districtPickerState = this.state.pickingDistrict
    this.setState({pickingDistrict: !districtPickerState})
  }


  // TODO: abstract this out
  isQualified(user) {
    if ( user.qual_state === "qualified" || user.qual_state === "super_qualified" ) {
      return true;
    } else {
      return false;
    }
  }

  updateDistrict(newDistrictId) {
    let data = {}
    data['auth0_id'] = localStorage.getItem('user_id');
    data['current_district'] = newDistrictId;
    axios({
      method: 'POST',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/user`,
      data: data
    })
    .then(() => {
      this.getCurrentDistrict(newDistrictId);
    })
    .catch(err => {
      console.error(err);
    });
  }

  getAdoptedVoters() {
    let user_id = localStorage.getItem('user_id');
    if(user_id) {
      var headers = {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))};
      axios.get(
        `${process.env.REACT_APP_API_URL}/voters`,
        {
          headers: headers,
          params: {
            user_id: user_id,
          }
        })
        .then(res => {
          this.setState( {voters: res.data} );
        })
        .catch(err => {
          console.error(err)
        });
    }
  }

  handleAdoptedVoter(voters) {
    for (var i = 0; i < voters.length; i++){
      var voter = voters[i];
      this.setState({ voters: this.state.voters.concat([voter])});
    }
  }

  handleConfirmPrepped(voter) {
    axios({
      method: 'PUT',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/voter/confirm-prepped`,
      data: { id: voter.id }
      })
      .then(res => {
        voter.confirmed_prepped_at = res.data[0].confirmed_prepped_at;
        var voters = this.state.voters;
        // find the position of the voter in the voters array
        var index = voters.map(function(voter) {return voter.id}).indexOf(voter.id);
        if (index !== -1) {
          voters[index] = voter;
        }
        this.setState({ voters: voters });
      })
      .catch(err => {
        console.error(err);
    })
  }

  handleConfirmAllPrepped() {
    for (var i = 0; i < this.state.voters.length; i++){
      this.handleConfirmPrepped(this.state.voters[i]);
    }
  }

  handleUndoConfirmPrepped(voter) {
    axios({
      method: 'PUT',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/voter/undo-confirm-prepped`,
      data: { id: voter.id }
      })
      .then(res => {
        voter.confirmed_prepped_at = null;
        var voters = this.state.voters;
         //find the position of the voter in the voters array
        var index = voters.map(function(voter) {return voter.id}).indexOf(voter.id);
        if (index !== -1) {
          voters[index] = voter;
        }
        this.setState({ voters: voters });
      })
      .catch(err => {
        console.error(err);
    })
  }

  handleConfirmSent(voter) {
    axios({
      method: 'PUT',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/voter/confirm-sent`,
      data: { id: voter.id }
      })
      .then(res => {
        voter.confirmed_sent_at = res.data[0].confirmed_sent_at;
        var voters = this.state.voters;
        // find the position of the voter in the voters array
        var index = voters.map(function(voter) {return voter.id}).indexOf(voter.id);
        if (index !== -1) {
          voters[index] = voter;
        }
        this.setState({ voters: voters });
      })
      .catch(err => {
        console.error(err);
    })
  }

  handleConfirmAllSent() {
    for (var i = 0; i < this.state.voters.length; i++){
      if (this.state.voters[i].confirmed_prepped_at){
        this.handleConfirmSent(this.state.voters[i]);
      }
    }
  }

  handleUndoConfirmSent(voter) {
    axios({
      method: 'PUT',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/voter/undo-confirm-sent`,
      data: { id: voter.id }
      })
      .then(res => {
        voter.confirmed_sent_at = null;
        var voters = this.state.voters;
         //find the position of the voter in the voters array
        var index = voters.map(function(voter) {return voter.id}).indexOf(voter.id);
        if (index !== -1) {
          voters[index] = voter;
        }
        this.setState({ voters: voters });
      })
      .catch(err => {
        console.error(err);
    })
  }

  componentWillMount(){
    if (!this.isLoggedIn()) {
      history.replace('/');
    }
    if (this.props.match.params.districtId) {
      const districtToFetch = this.props.match.params.districtId.toUpperCase();
      this.updateDistrict(districtToFetch);
      this.getAdoptedVoters();
      this.getCurrentUser();
    }
    else {
      this.getAdoptedVoters();
      this.getCurrentUser();
    }
  }

  render() {
    return (
      <div>
      <Header auth={this.props.auth} />
      { this.props.auth.isAuthenticated() ? (
        <div>
          { !this.state.pickingDistrict ? (
            <React.Fragment>
              <AdoptVoter
                  currentDistrict={this.state.currentDistrict}
                  handleAdoptedVoter={this.handleAdoptedVoter}
                  toggleDistrictPicker={this.toggleDistrictPicker}
                  user={this.state.user}
                  voterCount={this.state.voters.length}
                />
            </React.Fragment>
          ) : (
            <DistrictPicker
              updateDistrict={this.updateDistrict}
              toggleDistrictPicker={this.toggleDistrictPicker}
            />
          )}
          <div className="container-fluid py-3">
            <VoterList
              voters={this.state.voters}
              markAllPrepped={this.handleConfirmAllPrepped}
              confirmPrepped={this.handleConfirmPrepped}
              undoConfirmPrepped={this.handleUndoConfirmPrepped}
              markAllSent={this.handleConfirmAllSent}
              confirmSent={this.handleConfirmSent}
              undoConfirmSent={this.handleUndoConfirmSent}
            />
          </div>
        </div>
      ) : (
          <div className="container">
            <Login auth={this.props.auth} buttonText="Sign up or log in to send letters" />
          </div>
        )}
      <Footer />
      </div>
    );
  }
}

export default Dashboard
