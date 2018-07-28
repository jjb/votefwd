// src/Pledge.js

import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';
import moment from 'moment';
import { Header } from './Header';


class Overview extends Component {
  constructor(props) {
    super(props)

  this.state = { available: '', adopted: '', prepped: '', sent: '', total: '' };
  this.getStats = this.getStats.bind(this);
  }

  getStats() {
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/s/stats`
    })
    .then(res => {
      this.setState(res.data);
    })
    .catch(err => {
      console.error(err);
    });
  }

  componentWillMount() {
    this.getStats();
  }

  render() {
    return(
      <div className="w-25 mx-auto mt-3">
        <table className="table table-condensed table-bordered text-center">
          <thead className="thead-light">
            <tr>
              <th style={{width: '20%'}} scope="col">Available</th>
              <th style={{width: '20%'}} scope="col">Adopted</th>
              <th style={{width: '20%'}} scope="col">Prepped</th>
              <th style={{width: '20%'}} scope="col">Sent</th>
              <th style={{width: '20%'}} scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.available}</td>
              <td>{this.state.adopted}</td>
              <td>{this.state.prepped}</td>
              <td>{this.state.sent}</td>
              <td>{this.state.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class UserTable extends Component {
  constructor(props) {
    super(props)

    this.state = { users: [] };
    this.getAllUsers = this.getAllUsers.bind(this);
    this.setVoterCountsForUsers = this.setVoterCountsForUsers.bind(this);
    this.renderStatus = this.renderStatus.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
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
        user.total = res.data.length;
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

  handleChangeStatus(user, newQualState, event) {
    event.preventDefault();
    if (user.qual_state === newQualState) {
      return;
    }
    axios({
      method: 'POST',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/s/updateUserQualifiedState`,
      data: {
        auth0_id: user.auth0_id,
        qualState: newQualState
      }
    })
    .then(res => {
      // setState calls are batched, so if you rely on the previous state, then
      // the only way to guarantee you are reading it is to use this syntax.
      // see: https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous
      this.setState((prevState, props) => {
        return {
          users: prevState.users.map(u => {
            if (u.auth0_id === user.auth0_id) {
              u.qual_state = newQualState;
            }
            return u;
          })
        }
      });
    })
    .catch(err => {
      console.error(err);
    });
  }

  renderStatus(props) {
    const buttonClass = function buttonClass(state, qualState) {
      return "btn btn-light" + (qualState === state ? ' active' : '');
    };

    const user = props.original;
    const qualState = user.qual_state;
    return (
      <div className="btn-group btn-group-toggle">
        <label className={buttonClass('banned', qualState)}
               onClick={this.handleChangeStatus.bind(this, user, 'banned')}
        >
          <input type="radio" name="status" id="banned" autoComplete="off" /> B
        </label>
        <label className={buttonClass('pre_qualified', qualState)}
               onClick={this.handleChangeStatus.bind(this, user, 'pre_qualified')}
        >
          <input type="radio" name="status" id="prequal" autoComplete="off" /> P
        </label>
        <label className={buttonClass('qualified', qualState)}
               onClick={this.handleChangeStatus.bind(this, user, 'qualified')}
        >
          <input type="radio" name="status" id="qual" autoComplete="off" /> Q
        </label>
        <label className={buttonClass('super_qualified', qualState)}
               onClick={this.handleChangeStatus.bind(this, user, 'super_qualified')}
        >
          <input type="radio" name="status" id="superqual" autoComplete="off" /> S
        </label>
      </div>
    );
  }

  render() {
    const users = this.state.users;

    const columns = [{
      Header: 'Full Name',
      accessor: 'full_name',
      filterable: true,
      filterMethod: (filter, row, column) => {
        // Split name on any amount of whitespace
        // and check that any of them begins with the filter value
        return (row.full_name || '')
          .trim()
          .toLowerCase()
          .split(/\W+/)
          .some(name => name.startsWith(filter.value.toLowerCase()));
      }
    }, {
      id: 'd',
      Header: 'Signup Date',
      accessor: d => {
        return moment(d.created_at)
        .local()
        .format("MMMM DD, hh:mm a")
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
    }, {
      Header: 'Total',
      accessor: 'total',
    }, {
      id: 'a',
      Header: 'Admin?',
      accessor: a => {
        if (a.is_admin) {
          return 'admin';
        }
        else {
          return null;
        }
      },
      filterable: true,
      Filter: ({ filter, onChange }) => (
        <select
          className="form-control"
          onChange={ event => onChange(event.target.value) }
          value={ filter ? filter.value : 'all' }
        >
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      ),
      filterMethod: (filter, row, column) => {
        if (filter.value === 'all') {
          return true;
        }
        if (filter.value === 'admin') {
          return row._original.is_admin;
        }
        return !row._original.is_admin;
      },
    }, {
      width: 200,
      Header: 'Status',
      Cell: this.renderStatus,
      accessor: 'qual_state',
      filterable: true,
      Filter: ({ filter, onChange }) => (
        <select
          className="form-control"
          onChange={ event => onChange(event.target.value) }
          value={ filter ? filter.value : 'all' }
        >
          <option value="all">All</option>
          <option value="banned">Banned</option>
          <option value="pre_qualified">Pre-qualified</option>
          <option value="qualified">Qualified</option>
          <option value="super_qualified">Super-qualified</option>
        </select>
      ),
      filterMethod: (filter, row, column) => {
        if (filter.value === 'all') {
          return true;
        }
        return (row.qual_state === filter.value);
      },
      sortable: false
    }];

    return (
      <ReactTable data={users} columns={columns} />
    )}
}

class Admin extends Component {
  render() {
    return (
      <div>
        <Header auth={this.props.auth}/>
        <Overview />
        <UserTable />
      </div>
    );
  }
}

export default Admin
