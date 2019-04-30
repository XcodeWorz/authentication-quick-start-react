import React, { Component } from 'react';
import { Route } from "react-router-dom";
import { AnimatedSwitch } from 'react-router-transition';
import queryString from 'query-string';
import axios from 'axios';
import swal from 'sweetalert2';
import swalWithReactContent from 'sweetalert2-react-content';
import settings from './settings';

import LandingPage from './components/LandingPage';
import Navigation from './components/Navigation';
import Header from './components/Header';
import AuthNav from './components/dashboard/AuthNav';
import Login from './components/Login';

import Account from './components/dashboard/Account';
import Dashboard from './components/dashboard/Dashboard';

import './App.css';

const sweetAlert = swalWithReactContent(swal);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNavigation: false,
      authenticated: false
    }

    this.toggleNavigation = this.toggleNavigation.bind(this);
  }

  render() {
    return (
      <div className="App">
        <Header
          showNavigation={this.state.showNavigation}
          authenticated={this.state.authenticated}
          toggleNavigation={this.toggleNavigation} />
        <main>
            {(this.state.authenticated) ? (
              <Navigation show={this.state.showNavigation}>
                <AuthNav toggleNavigation={this.toggleNavigation} />
              </Navigation>
            ) : (
              <Navigation show={this.state.showNavigation}>
                <Login toggleNavigation={this.toggleNavigation} />
              </Navigation>
            )}
          {(!this.state.authenticated) ? (
            <AnimatedSwitch
              atEnter={{ opacity: 0 }}
              atLeave={{ opacity: 0 }}
              atActive={{ opacity: 1 }}
              className="switch-wrapper">
              <Route exact path="/" component={LandingPage} />
            </AnimatedSwitch>
          ):(
            <AnimatedSwitch
              atEnter={{ opacity: 0 }}
              atLeave={{ opacity: 0 }}
              atActive={{ opacity: 1 }}
              className="switch-wrapper">
              <Route exact path="/"
                render={(props) => <Dashboard {...props} authenticated={this.state.authenticated} />} />
              <Route path="/account"
                render={(props) => <Account {...props} authenticated={this.state.authenticated} />} />
            </AnimatedSwitch>
          )}
        </main>
      </div>
    );
  }
  
  componentWillMount() {
    var query = queryString.parse(this.props.location.search);

    console.log(query);

    if (typeof query !== 'undefined' && typeof query.success !== 'undefined') {
      sweetAlert.fire({
        position: 'bottom',
        type: (query.success === 'false') ? 'error' : 'success',
        showConfirmButton: false,
        timer: 5000,
        toast: true,
        html: <p>{query.message}</p>,
        customClass: 'mirax-toast-box mirax-toast-box-error'
      })

      if (query.success === 'true') {
        this.setState({authenticated: true});
        window.localStorage.setItem('jwt', query.token);
      }

      this.props.history.push('/');
    } else if (localStorage.getItem('jwt') && typeof localStorage.getItem('jwt') !== 'undefined' && localStorage.getItem('jwt').length > 0) {
      axios.defaults.baseURL = settings.apiurl;
      axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('jwt');
      
      axios.get('/auth/verify')
      .then(response => {
        if (response.data.success) {
          this.setState({ authenticated: true });
        } else {
          console.error('JWT Invalid');
        }
      });
    }
  }

  toggleNavigation() {
    this.setState({showNavigation: !this.state.showNavigation});
  }
}

export default App;
