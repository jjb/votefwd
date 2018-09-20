import axios from 'axios';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import Loading from './Loading';

// Ensures the logged in user is an admin.  If not, redirects to /
class AdminChecker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isAdmin: false
    };
  }

  componentDidMount() {
    let user_id = localStorage.getItem('user_id');
    if (user_id) {
      axios({
        headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}/s/isAdmin`,
        params: { auth0_id: user_id }
      })
      .then(res => {
        this.setState({ loading: false, isAdmin: res.data.is_admin === true });
      })
      .catch(err => {
        this.setState({ loading: false, isAdmin: false });
      });
    }
    else {
      this.setState({ loading: false, isAdmin: false });
    };
  }

  render() {
    if (this.state.loading) {
      return <Loading {...this.props} />;
    }
    else if (this.state.isAdmin === false) {
      return <Redirect to={{ pathname: '/' }} />;
    }
    const Component = this.props.component;
    return <Component {...this.props} />;
  }
}

// This higher-order component pattern taken from
// https://tylermcginnis.com/react-router-protected-routes-authentication/
const AdminRoute = ({ component: Component, auth, ...rest }) => (
  <Route {...rest} render={(props) => (
    <AdminChecker component={Component} auth={auth} {...props} />
  )} />
);

export default AdminRoute;
