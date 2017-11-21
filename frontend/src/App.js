import React, { Component } from 'react';

import Tab from './Tab.js';
import './App.css';

export default class App extends Component {

  constructor(props) {
    super(props);

    let body = document.body, html = document.documentElement;
    let height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

    this.state = {
      users: [],
      height: height - 32,
      activeTab: 'main',
    };

    let that = this;
    let url = 'https://ywc15.ywc.in.th/api/interview';

    fetch(url)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(data) {
      that.setState({
        users: data
      });
    });
  }

  render() {
    return (
      <div className="container" style={{ height: this.state.height }} >
        <div className="menu" >
          <Tab active={ this.state.activeTab == 'main' } icon={ require('./image/logo.png') } width={ 150 } height={ 56 } center={ true } />
          <Tab active={ this.state.activeTab == 'content' } text={ 'CONTENT' } icon={ require('./image/content.png') }  width={ 64 } height={ 64 }  />
          <Tab active={ this.state.activeTab == 'design' } text={ 'DESIGN' } icon={ require('./image/design.png') }  width={ 64 } height={ 64 }  />
          <Tab active={ this.state.activeTab == 'marketing' } text={ 'MARKETING' } icon={ require('./image/marketing.png') }  width={ 64 } height={ 64 }  />
          <Tab active={ this.state.activeTab == 'programming' } text={ 'PROGRAMMING' } icon={ require('./image/programming.png') }  width={ 64 } height={ 64 }  />
        </div>
        <div className="content" ></div>
      </div>
    );
  }
}