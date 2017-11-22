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
      keyword: '',
      sortBy: 'interviewRef',
      sortDirection: true,
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

  changeTab = (tab) => {

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
      sortBy: 'interviewRef',
      sortDirection: true,
    });
  }

  updateInputValue(evt) {
    if(evt.target.value.length != 0) {
      this.setState({
        keyword: evt.target.value,
        sortBy: 'similarity',
      });
    }
    else {
      this.setState({
        keyword: evt.target.value,
        sortBy: 'interviewRef',
        sortDirection: true,
      });
    }
  }

  similar = (keyword, word) => {
    let dp = [];

    for(let i = 0; i <= keyword.length; i++) {
      dp.push([]);
      for(let j = 0; j <= word.length; j++) {
        if(i == 0 || j == 0) {
          dp[i].push(0);
          continue;
        }
        
        if(keyword[i-1] == word[j-1]) dp[i].push(dp[i-1][j-1] + 1);
        else if(dp[i-1][j] > dp[i][j-1]) dp[i].push(dp[i-1][j]);
        else dp[i].push(dp[i][j-1]);
      }
    }

    return dp[keyword.length][word.length] / keyword.length;
  }

  filterUser = (users) => {
    if(this.state.keyword.length != 0) {
      let filteredUsers = [];
      
      for(let i = 0; i < users.length; i++) {  
        let filteredUser = users[i];

        if(this.state.keyword.length <= users[i].firstName.length || this.state.keyword.length <= users[i].lastName.length) {
          let firstSim = this.similar(this.state.keyword, users[i].firstName);
          let lastSim = this.similar(this.state.keyword, users[i].lastName);
          filteredUser.similarity = firstSim > lastSim ? firstSim : lastSim;
        }
        else filteredUser.similarity = this.similar(this.state.keyword, users[i].firstName + ' ' + users[i].firstName);

        if(filteredUser.similarity >= 0.7) filteredUsers.push(filteredUser);
      }

      if(this.state.sortBy == 'interviewRef') {
        if(this.state.sortDirection) return filteredUsers.sort((A, B) => A.interviewRef.localeCompare(B.interviewRef));
        else return filteredUsers.sort((B, A) => A.interviewRef.localeCompare(B.interviewRef));
      }
      else if(this.state.sortBy == 'name') {
        if(this.state.sortDirection) return filteredUsers.sort((A, B) => (A.firstName + A.lastName).localeCompare((B.firstName + B.lastName)));
        else return filteredUsers.sort((B, A) => (A.firstName + A.lastName).localeCompare((B.firstName + B.lastName)));
      }
      else if(this.state.sortBy == 'major') {
        if(this.state.sortDirection) return filteredUsers.sort((A, B) => A.major.localeCompare(B.major));
        else return filteredUsers.sort((B, A) => A.major.localeCompare(B.major));
      }
      else return filteredUsers.sort((A, B) => A.similarity < B.similarity);
    }
    else {
      
      if(this.state.sortBy == 'interviewRef') {
        if(this.state.sortDirection) return users.sort((A, B) => A.interviewRef.localeCompare(B.interviewRef));
        else return users.sort((B, A) => A.interviewRef.localeCompare(B.interviewRef));
      }
      else if(this.state.sortBy == 'name') {
        if(this.state.sortDirection) return users.sort((A, B) => (A.firstName + A.lastName).localeCompare((B.firstName + B.lastName)));
        else return users.sort((B, A) => (A.firstName + A.lastName).localeCompare((B.firstName + B.lastName)));
      }
      else if(this.state.sortBy == 'major') {
        if(this.state.sortDirection) return users.sort((A, B) => A.major.localeCompare(B.major));
        else return users.sort((B, A) => A.major.localeCompare(B.major));
      }
      else return users;

    }
  }

  changeSortBy = (sortBy) => {
    if(this.state.sortBy != sortBy) {
      this.setState({
        sortBy: sortBy,
        sortDirection: true
      });
    }
    else {
      this.setState({
        sortBy: sortBy,
        sortDirection: !this.state.sortDirection
      });
    }
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
          <UserList users={ this.filterUser(this.state.users) } title={ this.state.contentTitle } height={ this.state.height } onChange={ evt => this.updateInputValue(evt) } changeSortBy={ this.changeSortBy } />
        </div>
      </div>
    );
  }
}