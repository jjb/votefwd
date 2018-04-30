// src/Pledge.js

import React, { Component } from 'react';
import axios from 'axios';
import history from './history';
import { Header } from './Header';

class UserList extends Component {
  render() {
    return (
      <div>
      <h2 className="title tc">Users and Adopted Voter Counts</h2>
      <ul className="list pl0 mt0 measure center">
        {this.props.users.map(user =>
          <UserListItem user={user} key={user.id}/>)}
      </ul>
      </div>
    )}
}

class UserListItem extends Component {
  constructor(props) {
    super(props);

    this.state = { voters: [] };
    this.getVoters = this.getVoters.bind(this);
  }

  getVoters() {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/voters`,
      params: { user_id: this.props.user.auth0_id }
    })
    .then(res => {
      this.setState({ voters: res.data });
    })
    .catch(err => {
      console.error(err);
    });
  }

  componentWillMount() {
    this.getVoters()
  }

  render() {
    let user = this.props.user;
    return (
      <li className="flex items-center lh-copy pa3 ph0-l bb b--black-10" key={user.id}>
        <div className="pl4 flex-auto">
          <p>
            {user.full_name}: {this.state.voters.length}
          </p>
        </div>
      </li>
    )}
}


class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = { users: [] };
    this.getAllUsers = this.getAllUsers.bind(this);
  }

  isAdmin(callback) {
    let user_id = localStorage.getItem('user_id');
    if (user_id) {
      axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}/user`,
        params: { auth0_id: user_id }
      })
      .then(res => {
        if (res.data[0].is_admin) {
          callback(true);
        }
        else { callback(false) };
      })
      .catch(err => {
        console.error(err);
      });
    }
    else { callback(false) };
  }

  getAllUsers() {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/s/users`,
    })
    .then(res => {
      this.setState({ users: res.data });
    })
    .catch(err => {
      console.error(err);
    });
  }

  componentWillMount() {
    this.isAdmin(
      isAdmin => {
      if (!isAdmin) {
        history.replace('/');
      }
      else {
        this.getAllUsers();
      }
    });
  }

  render() {
    return (
      <div>
        <Header auth={this.props.auth}/>
        <UserList users={this.state.users}/>
      </div>
    );
  }
}

export default Admin
