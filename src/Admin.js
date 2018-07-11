// src/Pledge.js

import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';
import moment from 'moment';
import history from './history';
import { Header } from './Header';

class OverviewTable extends Component {
  constructor(props) {
    super(props)

  this.state = { users: [] };
  this.getAllUsers = this.getAllUsers.bind(this);
  this.setVoterCountsForUsers = this.setVoterCountsForUsers.bind(this);
  }

  getAllUsers() {
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/s/users`,
    })
    .then(res => {
      this.setState({ users: res.data }, () => this.setVoterCountsForUsers())
    })
    .catch(err => {
      console.error(err);
    });
  }

  setVoterCountsForUsers() {
    let users = this.state.users;
    users.forEach(function(user, index) {
      axios({
        method: 'GET',
        headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
        url: `${process.env.REACT_APP_API_URL}/voters`,
        params: { user_id: user.auth0_id }
      })
      .then(res => {
        let adopted = res.data.filter(voter => !voter.confirmed_prepped_at && !voter.confirmed_sent_at);
        let prepped = res.data.filter(voter => voter.confirmed_prepped_at && !voter.confirmed_sent_at);
        let sent = res.data.filter(voter => voter.confirmed_prepped_at && voter.confirmed_sent_at);
        user.num_adopted = adopted.length;
        user.num_prepped = prepped.length;
        user.num_sent = sent.length;
        users[index] = user;
      })
      .then(res => {
        this.setState({users: users})
      })
      .catch(err => {
        console.error(err);
      });
    }, this)
  }

  componentWillMount() {
    this.getAllUsers();
  }

  render() {
    const users = this.state.users;

    const columns = [{
      Header: 'Full Name',
      accessor: 'full_name' // String-based value accessors!
    }, {
      id: 'd',
      Header: 'Signup Date',
      accessor: d => {
        return moment(d.created_at)
        .local()
        .format("YYYY-MM-DD hh:mm")
      }
    }, {
      Header: 'Adopted',
      accessor: 'num_adopted',
    }, {
      Header: 'Prepped',
      accessor: 'num_prepped',
    }, {
      Header: 'Sent',
      accessor: 'num_sent',
    }]

    return (
      <ReactTable data={users} columns={columns} />
    )}
}

class Admin extends Component {
  isAdmin(callback) {
    let user_id = localStorage.getItem('user_id');
    if (user_id) {
      axios({
        headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
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

  componentWillMount() {
    this.isAdmin(
      isAdmin => {
      if (!isAdmin) {
        history.replace('/');
      }
    });
  }

  render() {
    return (
      <div>
        <Header auth={this.props.auth}/>
        <OverviewTable />
      </div>
    );
  }
}

export default Admin
