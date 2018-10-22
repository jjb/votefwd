// src/Admin.js
// User Table

import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';
import moment from 'moment';
import { Header } from './Header';
import { Footer } from './Footer';
import { UserProfilePreview } from './admin/UserProfilePreview';

class UserTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [],
      activeUserProfile: null,
      batchApproving: false
    };
    this.getAllUsers = this.getAllUsers.bind(this);
    this.renderStatus = this.renderStatus.bind(this);
    this.renderNameAndProfile = this.renderNameAndProfile.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleBatchApprovePending = this.handleBatchApprovePending.bind(this);
    this.cancelBatchApproval = this.cancelBatchApproval.bind(this);
    this.hideUserInformation = this.hideUserInformation.bind(this);
  }

  getAllUsers() {
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
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

  handleBatchApprovePending(users, event) {
    event.preventDefault();
    console.log("Handling batch approve pending.");
    axios({
      method: 'POST',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/s/batchApprovePending`,
      data: {}
    })
    .then(res => {
      window.location.reload();
      this.cancelBatchApproval();
    })
    .catch(err => {
      console.error(err);
    });
  }

  cancelBatchApproval() {
    this.setState({batchApproving: false});
  }

  renderStatus(props) {
    const buttonClass = function buttonClass(state, qualState) {
      return "w-25 btn btn-light small" + (qualState === state ? ' active' : '');
    };

    const user = props.original;
    const qualState = user.qual_state;
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

  showUserInformation(user) {
    this.setState({ activeUserProfile: user })
  }

  hideUserInformation() {
    this.setState({ activeUserProfile: null })
  }

  renderNameAndProfile(props) {
    let user = props.original;
    return (
      <button onClick={this.showUserInformation.bind(this, user)} className="w-100">
        View
      </button>
    );
  }

  render() {
    const users = this.state.users;
    const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
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
      },
      Footer: (
        <span>
          <strong>Total users:</strong>{" "}
          {numberWithCommas(users.length)}
        </span>
      )
    }, {
      id: 'l',
      Header: 'auth0_id',
      accessor: l => {
        return (<a href={`/admin/user/${l.auth0_id}`}>{l.auth0_id}</a>);
      },
      maxWidth: 100
    }, {
      Header: 'Email',
      accessor: 'email',
      filterable: true,
      filterMethod: (filter, row) => {
        return (row.email || '').startsWith(filter.value);
      }
    }, {
      Header: 'District',
      accessor: 'current_district',
      filterable: true,
      filterMethod: (filter, row, column) => {
        return (row.current_district || '')
          .trim()
          .toLowerCase()
          .split(/\W+/)
          .some(current_district => current_district.startsWith(filter.value.toLowerCase()));
      },
      maxWidth: 80
    }, {
      id: 's',
      Header: 'Signup date',
      accessor: s => {
        return moment(s.created_at)
        .local()
        .format("MM/DD, hh:mm a")
      }
    }, {
      id: 'u',
      Header: 'Updated',
      accessor: u => {
        return moment(u.updated_at)
        .local()
        .format("MM/DD, hh:mm a")
      }
    }, {
      Header: 'Adopted',
      accessor: 'stats.adopted',
      maxWidth: 120,
      Footer: (
        <span>
          <strong>A:</strong>{" "}
          {numberWithCommas(users.reduce((acc, u) => acc + u.stats.adopted, 0))}
        </span>
      )
    }, {
      Header: 'Prepped',
      accessor: 'stats.prepped',
      maxWidth: 120,
      Footer: (
        <span>
          <strong>P:</strong>{" "}
          {numberWithCommas(users.reduce((acc, u) => acc + u.stats.prepped, 0))}
        </span>
      )
    }, {
      Header: 'Sent',
      accessor: 'stats.sent',
      maxWidth: 120,
      Footer: (
        <span>
          <strong>S:</strong>{" "}
          {numberWithCommas(users.reduce((acc, u) => acc + u.stats.sent, 0))}
        </span>
      )
    }, {
      Header: 'Total',
      accessor: 'stats.total',
      maxWidth: 120,
      Footer: (
        <span>
          <strong>T:</strong>{" "}
          {numberWithCommas(users.reduce((acc, u) => acc + u.stats.total, 0))}
        </span>
      )
    }, {
      id: 'd',
      Header: 'Profile',
      Cell: this.renderNameAndProfile,
      maxWidth: 80
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
      maxWidth: 80,
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
      id: 'r',
      Header: 'Reason?',
      accessor: r => {
        if (r.why_write_letters) {
          return 'present';
        }
        else {
          return 'absent';
        }
      },
      maxWidth: 80,
      filterable: true,
      Filter: ({ filter, onChange }) => (
        <select
          className="form-control"
          onChange={ event => onChange(event.target.value) }
          value={ filter ? filter.value : 'all' }
        >
          <option value="all">All</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
      ),
      filterMethod: (filter, row, column) => {
        if (filter.value === 'all') {
          return true;
        }
        if (filter.value === 'present') {
          return row._original.why_write_letters;
        }
        return !row._original.why_write_letters;
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


    let batchApproveButton;
    if(!this.state.batchApproving) {
      batchApproveButton = (
        <button className="btn btn-warning btn-sm"
          onClick={() => {this.setState({batchApproving: true})}}>
          Dangerously Batch Approve Users
        </button>
      )
    }

    return (
      <React.Fragment>
        {this.state.activeUserProfile && (
          <UserProfilePreview
            user={this.state.activeUserProfile}
            closeModal={this.hideUserInformation}
          />
        )}
        <div className="text-center mt-2 mb-2">
          {!this.state.batchApproving && batchApproveButton}
          {this.state.batchApproving &&
          <div>
            <p className="mr-4 ml-4 small">Are you sure you want to batch approve all pending volunteers? This cannot be undone.</p>
            <button className="btn btn-info btn-small mr-2" type="cancel"
            onClick={() => {this.cancelBatchApproval()}}>Cancel</button>

            <button className="btn btn-danger btn-small ml-2" type="submit"
            onClick={this.handleBatchApprovePending.bind(this, users)}>Batch Approve Users</button>
          </div>
          }
        </div>
        <ReactTable data={users} columns={columns} className="-striped -highlight" />
      </React.Fragment>
    );
  }
}

class Admin extends Component {
  render() {
    return (
      <div className="position-relative">
        <Header auth={this.props.auth}/>
        <UserTable />
        <Footer />
      </div>
    );
  }
}

export default Admin
