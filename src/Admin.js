// src/Pledge.js

import React, { Component } from 'react';
import axios from 'axios';
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
          <span className="tl f6 db black-70">
            {user.full_name}
          </span>
          <span className="tr f6 db black-70">
            {this.state.voters.length}
          </span>
        </div>
      </li>
    )}
}

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = { users: [] };
    this.getUsers = this.getUsers.bind(this);
  }

  getUsers() {
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
    this.getUsers();
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
