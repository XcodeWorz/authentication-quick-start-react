import React, { Component } from 'react';
import './styles/Navigation.css';

class Navigation extends Component {
  constructor(props) {
      super(props);
      this.state = {
          show: props.show,
          content: props.children
      };
  }

  render() {
    return (
      <div className={(this.state.show) ? 'navigation navigation-show' : 'navigation'}>
        {this.state.content}
      </div>
    );
  }

  componentWillReceiveProps(props) {
    this.setState({
      show: props.show,
      content: props.children
    })
  }
}

export default Navigation;
