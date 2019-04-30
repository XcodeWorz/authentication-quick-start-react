import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNavigation: props.showNavigation,
      authenticated: props.authenticated,
      toggleNavigation: props.toggleNavigation
    }
  }

  render() {
    return (
      <header>
          <div className="header-item logo"><Link to="/"><h1>React Atuh Example</h1></Link></div>
          <div className="header-item header-item-nav" onClick={this.state.toggleNavigation}>
            {(this.state.showNavigation) ? (
              <i className="fas fa-times"></i>
            ) : (this.state.authenticated) ? (
              <i className="fas fa-bars"></i>
            ) : (
              <i className="fas fa-sign-in-alt"></i>
            )}
          </div>
        </header>
    );
  }

  componentWillReceiveProps(props) {
    this.setState({
      showNavigation: props.showNavigation,
      authenticated: props.authenticated,
      toggleNavigation: props.toggleNavigation
    })
  }
}

export default Header;
