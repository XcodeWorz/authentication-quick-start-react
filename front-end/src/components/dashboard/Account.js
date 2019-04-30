import React, { Component } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import settings from '../../settings';
import swal from 'sweetalert2';
import swalWithReactContent from 'sweetalert2-react-content';

import '../styles/Forms.css';

const sweetAlert = swalWithReactContent(swal);

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: props.authenticated,
      profile: {},
      displayName: '',
      name: ''
    };

    this.handleAuthenticationRedirect(props.authenticated);

    this.loadProfile();
    this.handleChange = this.handleChange.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  render() {
    return (
      <div className="Account">
        <h2>Account Information</h2>
        <div>
          <p>Display Name</p>
          <input className="form-element" type="type" name="displayName" placeholder="Display Name" onChange={this.handleChange} value={this.state.displayName} />
        </div>
        <div>
        <p>Name</p>
          <input className="form-element" type="type" name="name" placeholder="Name" onChange={this.handleChange} value={this.state.name} />
        </div>
        <div>
          <button className="form-element mt-1 mb-2" onClick={this.updateProfile}>Save Changes</button>
        </div>
        <div>
          <h3>Linked Accounts</h3>
          <button className="form-element mt-1" disabled={this.isLinked('google')} onClick={this.googleAuthentication}><i className="fab fa-google"></i> {(!this.isLinked('google')) ? 'Link with Google' : 'Google Already Linked'}</button>
          <button className="form-element mt-1" disabled={this.isLinked('twitch')} onClick={this.twitchAuthentication}><i className="fab fa-twitch"></i> {(!this.isLinked('twitch')) ? 'Link with Twitch' : 'Twitch Already Linked'}</button>
        </div>
        <div>
          <p>Account Created: <Moment fromNow>{this.state.profile.created}</Moment></p>
        </div>
      </div>
    );
  }

  loadProfile() {
    this.getProfile()
    .then(data => {
      console.log(data);
      this.setState({
        profile: data,
        displayName: data.displayName,
        name: data.name
      });
    })
  }
  
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  getProfile() {
    axios.defaults.baseURL = settings.apiurl;
    axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('jwt');
    
    return new Promise((resolve) => {
      axios.get('/profile')
      .then(response => {
        if (response.data.success) {
          delete response.data.success;
          resolve(response.data);
        } else {
          console.error('Encountered a problem fetching the profile');
        }
      });
    });
  }

  isLinked(value) {
    if (typeof this.state.profile === 'undefined' || typeof this.state.profile.provider === 'undefined')
      return false;

    for(var i = 0; i < this.state.profile.provider.length; i++) {
      if (this.state.profile.provider[i].includes(value))
        return true;
    }

    return false;
  }

  updateProfile() {
    axios.defaults.baseURL = settings.apiurl;
    axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('jwt');

    axios.post("/profile/update", {
      profile: {
        name: this.state.name,
        displayName: this.state.displayName
      }
    }).then(function (res) {
      sweetAlert.fire({
        position: 'bottom',
        type: 'success',
        showConfirmButton: false,
        timer: 5000,
        toast: true,
        html: <p>Successfully updated.</p>,
        customClass: 'mirax-toast-box mirax-toast-box-error'
      })

      console.log(res.data);
    }).catch(err => {
      console.error(err);
    });
  }

  googleAuthentication() {
    document.cookie='accesstoken=' + localStorage.getItem('jwt');
    window.location.href = settings.apiurl + 'auth/google';
  }

  twitchAuthentication() {
    document.cookie='accesstoken=' + localStorage.getItem('jwt');
    window.location.href = settings.apiurl + 'auth/twitch';
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

export default Account;
