// src/admin/AdminUser.js

import React, { Component } from 'react';
import axios from 'axios';
import { Header } from '../Header';
import { Footer } from '../Footer';

class AdminUser extends Component {
  constructor(props) {
    super(props)

    this.state = { user: undefined };
  }

  getUser(UserId) {
    console.log(UserId);
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/s/user`,
      params: {
        auth0_id: UserId 
      }
    })
    .then(res => {
      console.log(res.data);
      this.setState({ user: res.data });
    })
    .catch(err => {
      console.error(err);
    });
  }

  componentWillMount() {
    console.log(this.props.match.params.id);
    this.getUser(this.props.match.params.id);
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

  render() {
    return (
      <React.Fragment>
        <Header auth={this.props.auth}/>
        <div>foo</div>
        <Footer />
      </React.Fragment>
    )}
}

export default AdminUser
