import axios from 'axios';
import React from 'react';
import { Redirect, Route, Router } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import Loading from './Loading';
import Login from './SecretLogin';
import Auth from './Auth';
import Pledge from './Pledge';
import Admin from './Admin';
import Privacy from './Privacy';
import Terms from './Terms';
import history from './history';

const auth = new Auth();
const { isAuthenticated } = auth;

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}

// This higher-order component pattern taken from
// https://tylermcginnis.com/react-router-protected-routes-authentication/
//
// Ensures there is a logged in user.  If not, redirects to /
const LoggedInRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated() === true
      ? <Component auth={auth} {...props} />
      : <Redirect to={{ pathname: '/' }} />
  )} />
);

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

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    <AdminChecker component={Component} auth={auth} {...props} />
  )} />
);

export const makeMainRoutes = () => {
  return (
      <Router history={history}>
        <React.Fragment>
          <Route exact path="/" render={
            (props) => isAuthenticated() ? (<Dashboard auth={auth} {...props} />) : (<Home auth={auth} {...props} />)
          } />
          <Route exact path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Loading {...props} />;
          }}/>
          <LoggedInRoute exact path="/dashboard" component={Dashboard} />
          <Route exact path="/secretlogin" render={(props) => <Login auth={auth} {...props} />} />
          <Route exact path="/pledge" render={(props) => <Pledge auth={auth} {...props} />} />
          <AdminRoute exact path="/admin" component={Admin} />
          <Route exact path="/privacy-policy" render={(props) => <Privacy auth={auth} {...props} />} />
          <Route exact path="/terms-of-use" render={(props) => <Terms auth={auth} {...props} />} />
        </React.Fragment>
      </Router>
  );
}
