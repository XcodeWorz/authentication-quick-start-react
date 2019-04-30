import React, { Component } from 'react';
import { Link } from "react-router-dom";
import settings from '../settings';

import './styles/Login.css';
import './styles/Forms.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggleNavigation: props.toggleNavigation
    };
  }

  render() {
    return (
      <div className="login">
        <h2 className="login-header">Login / Signup</h2>
        <p>Login with the provider of your choice, this works as both a signup and a login, it will detect if an account with the email on the provider matches to prevent duplicate account creation.</p>
        
        <button className="form-element mt-1" onClick={this.googleAuthentication}><i className="fab fa-google"></i> Login with Google</button>
        <button className="form-element mt-1" onClick={this.twitchAuthentication}><i className="fab fa-twitch"></i> Login with Twitch</button>
      </div>
    );
  }

  googleAuthentication() {
    window.location.href = settings.apiurl + 'auth/google';
  }

  twitchAuthentication() {
    window.location.href = settings.apiurl + 'auth/twitch';
  }

  componentWillReceiveProps(props) {
    this.setState({
      toggleNavigation: props.toggleNavigation
    })
  }
}

export default Login;
