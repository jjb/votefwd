import React from 'react';
import { Redirect, Route, Router } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import Loading from './Loading';
import Login from './SecretLogin';
import Auth from './Auth';
import Pledge from './Pledge';
import Verify from './Verify';
import AdminRoute from './AdminRoute';
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

export const makeMainRoutes = () => {
  return (
      <Router history={history}>
        <React.Fragment>
          <Route exact path="/" render={(props) => <Home auth={auth} {...props} />} />
          <Route exact path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Loading {...props} />;
          }}/>
          <LoggedInRoute exact path="/dashboard" component={Dashboard} />
          <Route exact path="/secretlogin" render={(props) => <Login auth={auth} {...props} />} />
          <Route exact path="/pledge" render={(props) => <Pledge auth={auth} {...props} />} />
          <Route exact path="/verify" render={(props) => <Verify auth={auth} {...props} />} />
          <AdminRoute exact path="/admin" component={Admin} auth={auth} />
          <Route exact path="/privacy-policy" render={(props) => <Privacy auth={auth} {...props} />} />
          <Route exact path="/terms-of-use" render={(props) => <Terms auth={auth} {...props} />} />
        </React.Fragment>
      </Router>
  );
}
