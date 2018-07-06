import React from 'react';
import { Route, Router } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import Callback from './Callback';
import Auth from './Auth';
import Pledge from './Pledge';
import Admin from './Admin';
import history from './history';

const auth = new Auth();

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}

export const makeMainRoutes = () => {
  return (
      <Router history={history}>
        <React.Fragment>
          <Route exact path="/" render={(props) => <Home auth={auth} {...props} />} />
          <Route exact path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} /> 
          }}/>
          <Route exact path="/dashboard" render={(props) => <Dashboard auth={auth} {...props} />} />
          <Route exact path="/pledge" render={(props) => <Pledge auth={auth} {...props} />} />
          <Route exact path="/admin" render={(props) => <Admin auth={auth} {...props} />} />
        </React.Fragment>
      </Router>
  );
}
