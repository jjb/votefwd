// src/Auth.js

import auth0 from 'auth0-js';
import axios from 'axios';
import history from './history';

export default class Auth {
  webAuth = new auth0.WebAuth({
    domain: 'votefwd.auth0.com',
    clientID: process.env.REACT_APP_AUTH0_CLIENTID,
    redirectUri: `${process.env.REACT_APP_URL}/callback`,
    audience: 'https://votefwd.org/api',
    responseType: 'token id_token',
    scope: 'openid profile email read:user'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  handleAuthentication() {
    this.webAuth.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.persistUser(authResult, () => {
          history.replace('/dashboard');
        });
      } else if (err) {
        history.replace('/');
        console.log(err);
      }
    });
  }

  persistUser(authResult, callback) {
    axios({
      method: 'POST',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/user/new`,
      data: {
        auth0_id: authResult.idTokenPayload.sub,
        email: authResult.idTokenPayload.email
      }
    })
    .then(callback)
    .catch(function(error) {
      console.error(error)
    })
  }

  setSession(authResult) {
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('user_id', authResult.idTokenPayload.sub);
    this.webAuth.client.userInfo(authResult.accessToken, (err, profile) => {
      localStorage.setItem('picture_url', profile.picture);
    })
    history.replace('/');
  }

  logout() {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user_id');
    localStorage.removeItem('picture_url');
    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  login() {
    this.webAuth.authorize();
  }
}
