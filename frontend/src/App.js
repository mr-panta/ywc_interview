import React, { Component } from 'react';

import Tab from './Tab.js';
import UserList from './UserList.js';
import './App.css';

export default class App extends Component {

  users = [];
  groups = {
    'content': [],
    'design': [],
    'marketing': [],
    'programming': [],
  };

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      activeTab: 'main',
      contentTitle: 'ผู้ผ่านเข้ารอบทั้งหมด',
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
      
      that.users = data.sort((A, B) => A.interviewRef.localeCompare(B.interviewRef));
      that.setState({
        users: that.users
      });

      that.users.map((user) => {
        that.groups[user.major].push(user);
      });

    });

    this.changeTab = this.changeTab.bind(this);
  }

  changeTab(tab) {

    let users = this.users;
    let contentTitle = 'ผู้ผ่านเข้ารอบทั้งหมด';
    if(tab != 'main') {
      users = this.groups[tab];
      contentTitle = 'WEB ' + tab.toUpperCase();
    }

    this.setState({
      users: users,
      activeTab: tab,
      contentTitle: contentTitle,
    });
  }

  render() {
    return (
      <div className="container" >
        <div className="menu-container" >
          <div className="menu" >
            <Tab onClick={ () => { this.changeTab('main') } } active={ this.state.activeTab == 'main' } icon={ require('./image/logo.png') } width={ 150 } height={ 56 } center={ true } />
            <Tab onClick={ () => { this.changeTab('content') } } active={ this.state.activeTab == 'content' } text={ 'CONTENT' } icon={ require('./image/content.png') }  width={ 64 } height={ 64 }  />
            <Tab onClick={ () => { this.changeTab('design') } } active={ this.state.activeTab == 'design' } text={ 'DESIGN' } icon={ require('./image/design.png') }  width={ 64 } height={ 64 }  />
            <Tab onClick={ () => { this.changeTab('marketing') } } active={ this.state.activeTab == 'marketing' } text={ 'MARKETING' } icon={ require('./image/marketing.png') }  width={ 64 } height={ 64 }  />
            <Tab onClick={ () => { this.changeTab('programming') } } active={ this.state.activeTab == 'programming' } text={ 'PROGRAMMING' } icon={ require('./image/programming.png') }  width={ 64 } height={ 64 }  />
          </div>
        </div>
        <div className="content" >
          <UserList users={ this.state.users } title={ this.state.contentTitle } height={ this.state.height } />
        </div>
      </div>
    );
  }
}