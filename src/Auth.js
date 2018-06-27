// src/Auth.js

import auth0 from 'auth0-js';
import axios from 'axios';
import history from './history';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'votefwd.auth0.com',
    clientID: process.env.REACT_APP_AUTH0_CLIENTID,
    redirectUri: `${process.env.REACT_APP_URL}/callback`,
    audience: 'https://votefwd.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {

        //This is trash and doesnt work, but is kinda part way there https://auth0.com/docs/api/authentication#implicit-grant
        function reqListener () {
          console.log(this.responseText);
        }
        var api_auth = new XMLHttpRequest();
        api_auth.addEventListener("load", reqListener);
        api_auth.open("GET",
              'https://votefwd.auth0.com/authorize?' +
              'audience=https://votefwd.auth0.com/api&' +
              'scope=read&' +
              'response_type=token&' +
              'client_id=' + process.env.REACT_APP_AUTH0_CLIENTID +
              'redirectUri=' + process.env.REACT_APP_URL + '/callback' + '&' +
              'prompt=none'
              // redirect_uri=http://localhost:3000&
              // state=STATE& // probably should have this post mvp
              // nonce=NONCE // this too
        );
        api_auth.send();

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
    axios.post(`${process.env.REACT_APP_API_URL}/user/new`,
      { auth0_id: authResult.idTokenPayload.sub })
    .then(callback)
    .catch(function(error) {
      console.error(error)
    });
  }

  setSession(authResult) {
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('user_id', authResult.idTokenPayload.sub);
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
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
    this.auth0.authorize();
  }
}
