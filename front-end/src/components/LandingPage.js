import React, { Component } from 'react';

class LandingPage extends Component {
  render() {
    return (
      <div className="landing-page">
        <p>Welcome to a React+Passport Authentication Example</p>

        <h2>Instructions</h2>
        <p>Login by clicking the menu and selecting your provider. You will automatically be redirected to the dashboard on login. There is also an account page you can access to adjust your user profile.</p>
      </div>
    );
  }
}

export default LandingPage;
