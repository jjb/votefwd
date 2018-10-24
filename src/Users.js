// src/Users.js

import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import download from 'js-file-download';
import axios from 'axios';
import { Header } from './Header';


class UserTable extends Component {
  constructor(props) {
    super(props)

    this.state = { users: []};
    this.getStats = this.getStats.bind(this);
  }
  // 1) people who have some letters prepared but not all
  // 2) people who have no letters prepared

  getStats() {
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/admin/users?count=true`
    })
    .then(res => {
      this.setState({users: res.data});
    })
    .catch(err => {
      console.error(err);
    });
  }
  downloadCsvForUser(preppedLetters) {
    axios({
     method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/admin/users`,
      params: { preppedLetters },
      responseType: "blob"
    })
    .then(res => {
      download(res.data, res.headers.filename);
    })
    .catch(err => {
      console.error(err);
    });
  }


  componentWillMount() {
    this.getStats();
  }

  render() {
    const users = this.state.users;

    const columns = [{
      Header: 'Target List',
      accessor: 'prepped_letters',
      Cell: row => <button className='btn-link-underline' onClick={() => this.downloadCsvForUser(row.original.prepped_letters)}>{row.original.prep_status}</button>
    }, {
      Header: 'User Count',
      accessor: 'count',
    }]

    return(
      <ReactTable data={users} columns={columns} className="-striped -highlight" />
    );
  }
}

class Users extends Component {
  render() {
    return (
      <div className="position-relative">
        <Header auth={this.props.auth}/>
        <UserTable />
      </div>
    );
  }
}

export default Users;
