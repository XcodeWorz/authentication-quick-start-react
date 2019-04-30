import React, { Component } from 'react';
import '../styles/Forms.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: props.authenticated
    };

    this.handleAuthenticationRedirect(props.authenticated);
  }

  render() {
    return (
      <div className="Dashboard">
        <p>login successful, you can navigate to the account page to modify your profile.</p>
      </div>
    );
  }

  redirect(path) {
    this.props.history.push(path)
  }

  componentWillReceiveProps(props) {
    this.setState({
      authenticated: props.authenticated
    })
  }

  handleAuthenticationRedirect(authenticated) {
    if (!authenticated) this.props.history.push('/');
  }
}

export default Dashboard;
