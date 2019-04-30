import React, { Component } from 'react';
import { Link } from "react-router-dom";

import '../styles/AuthNav.css';

class AuthNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggleNavigation: props.toggleNavigation
    };
  }

  render() {
    return (
      <div className="auth-nav">
        <ul>
          <li><Link to="/" onClick={this.state.toggleNavigation}>Dashboard</Link></li>
          <li><Link to="/account" onClick={this.state.toggleNavigation}>Account</Link></li>
          <li><button className="is-text-link" onClick={this.logout}>Logout</button></li>
        </ul>
      </div>
    );
  }

  componentWillReceiveProps(props) {
    this.setState({
      toggleNavigation: props.toggleNavigation
    })
  }

  logout() {
    // signout implementation
    localStorage.removeItem('jwt');
    document.cookie='accesstoken=';
    window.location.href = '/';
  }
}

export default AuthNav;