import React, { Component } from 'react';
import graph from 'fb-react-sdk';
import FacebookLogin from 'react-facebook-login';
import Tab from './Tab.js';
import UserList from './UserList.js';
import ContactUs from './ContactUs.js';
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

    graph.setAccessToken('1545978732149875|ih_Uy4tMCykczT_ENLQCjs8TlAg');

    this.state = {
      users: [],
      activeTab: 'main',
      contentTitle: 'ผู้ผ่านเข้ารอบทั้งหมด',
      keyword: '',
      sortBy: 'interviewRef',
      sortDirection: true,
      showPopup: true,
      thaiName: '',
      englishName: '',
      firends: [],
      picture: null,
      facebookAuth: false,
      filteredUsers: [],
      popupType: 0,
      contactUs: false,
    };

    document.body.style.overflow = 'hidden';

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
        return that.groups[user.major].push(user);
      });

    });

    this.changeTab = this.changeTab.bind(this);

  }

  filterUser = (users) => {
    if(this.state.keyword.length !== 0) {
      let filteredUsers = [];
      
      for(let i = 0; i < users.length; i++) {  
        let filteredUser = users[i];

        if(this.state.keyword.length <= users[i].firstName.length || this.state.keyword.length <= users[i].lastName.length) {
          let firstSim = this.similar(this.state.keyword, users[i].firstName);
          let lastSim = this.similar(this.state.keyword, users[i].lastName);
          filteredUser.similarity = firstSim > lastSim ? firstSim : lastSim;
        }
        else filteredUser.similarity = this.similar(this.state.keyword, users[i].firstName + ' ' + users[i].lastName);

        if(filteredUser.similarity >= 0.7) filteredUsers.push(filteredUser);
      }

      if(this.state.sortBy === 'interviewRef') {
        if(this.state.sortDirection) return filteredUsers.sort((A, B) => A.interviewRef.localeCompare(B.interviewRef));
        else return filteredUsers.sort((B, A) => A.interviewRef.localeCompare(B.interviewRef));
      }
      else if(this.state.sortBy === 'name') {
        if(this.state.sortDirection) return filteredUsers.sort((A, B) => (A.firstName + A.lastName).localeCompare((B.firstName + B.lastName)));
        else return filteredUsers.sort((B, A) => (A.firstName + A.lastName).localeCompare((B.firstName + B.lastName)));
      }
      else if(this.state.sortBy === 'major') {
        if(this.state.sortDirection) return filteredUsers.sort((A, B) => A.major.localeCompare(B.major));
        else return filteredUsers.sort((B, A) => A.major.localeCompare(B.major));
      }
      else return filteredUsers.sort((A, B) => B.similarity - A.similarity);
    }
    else {
      
      if(this.state.sortBy === 'interviewRef') {
        if(this.state.sortDirection) return users.sort((A, B) => A.interviewRef.localeCompare(B.interviewRef));
        else return users.sort((B, A) => A.interviewRef.localeCompare(B.interviewRef));
      }
      else if(this.state.sortBy === 'name') {
        if(this.state.sortDirection) return users.sort((A, B) => (A.firstName + A.lastName).localeCompare((B.firstName + B.lastName)));
        else return users.sort((B, A) => (A.firstName + A.lastName).localeCompare((B.firstName + B.lastName)));
      }
      else if(this.state.sortBy === 'major') {
        if(this.state.sortDirection) return users.sort((A, B) => A.major.localeCompare(B.major));
        else return users.sort((B, A) => A.major.localeCompare(B.major));
      }
      else return users;

    }
  }

  responseFacebook = (response) => {
    if(response.status !== 'unknown') {
      let that = this;
      console.log(response);
      graph.get(response.id, function(err, res) {
        console.log(res);
        that.setState({
          facebookAuth: true,
          facebookId: response.id,
          thaiName: that.getThaiName(response.name, res.name),
          englishName: that.getEnglishName(response.name, res.name),
          friends: response.friends.data,
          picture: response.picture.data,
        });

        if(that.state.thaiName !== '') {

          let users = [];
          for(let i = 0; i < that.users.length; i++) {
            let filteredUser = {};
            Object.assign(filteredUser, that.users[i]);
            filteredUser.similarity = that.similar(that.state.thaiName, filteredUser.firstName + ' ' + filteredUser.lastName);
            users.push(filteredUser);
          }

          users = users.sort((A, B) => B.similarity - A.similarity).filter((user) => user.similarity >= 0.75);

          that.setState({
            filteredUsers: users
          });
        }

        let friends = [];
        that.state.friends.map((user) => {
          let newUser = {};
          Object.assign(newUser, user);
          newUser.simUser = {};

          graph.get(newUser.id, function(err2, res2) {
            newUser.thaiName = that.getThaiName(newUser.name, res2.name);
            newUser.englishName = that.getEnglishName(newUser.name, res2.name);
            if(newUser.thaiName !== '') {
              Object.assign(newUser.simUser, that.users[0]);
              newUser.simUser.similarity = that.similar(newUser.thaiName, newUser.simUser.firstName + ' ' + newUser.simUser.lastName);
              for(let i = 1; i < that.users.length; i++) {
                let sim = that.similar(newUser.thaiName, that.users[i].firstName + ' ' + that.users[i].lastName);
                if(sim > newUser.simUser.similarity) {
                  newUser.simUser = {};
                  Object.assign(newUser.simUser, that.users[i]);
                  newUser.simUser.similarity = sim;
                }
              }

            }
            friends.push(newUser);
          });
        });

        that.setState({
          friends: friends
        });

        console.log(that.state.friends);

      });
    }

    return true;
  }

  closePopup() {
    this.setState({
      showPopup: false
    });

    document.body.style.overflow = 'auto';
  }

  renderPopup() {
    return (
      <div className="popup-container" >
        <div className="popup-content" >
          <div className="popup" >
            <div style={{ textAlign: 'left', marginLeft: 12 }} >
              <span style={{ cursor: 'pointer', fontSize: 24 }} onClick={ () => this.closePopup() } >X</span>
            </div>
            { this.state.facebookAuth && 
              <div style={{ marginTop: -36 }} >
                <span style={{ fontSize: 24 }} >
                  <span className="link" onClick={() => this.setState({ popupType: 0 })} >คุณ</span> · <span className="link" onClick={() => this.setState({ popupType: 1 })} >เพื่อน</span>
                </span>
                <hr/>
                {
                  this.state.popupType === 0 &&
                  <div style={{ textAlign: 'left', height: 360, overflow: 'auto' }}>
                    <div style={{ marginBottom: 4 }} > 
                      <span>ค้นหารายชื่อ: </span>
                      { this.state.thaiName.length > 0 && <a target="_blank" href={ 'https://www.facebook.com/' + this.state.facebookId }> { this.state.thaiName }</a> }                
                      { this.state.thaiName.length === 0 && <a target="_blank" href={ 'https://www.facebook.com/' + this.state.facebookId }> { this.state.englishName }</a> }
                    </div>
                    { this.state.thaiName.length > 0 && this.state.filteredUsers.map((user, index) => {
                      return (
                        <div key={ index } className="user-info" style={ user.similarity > 0.75 ? { color: 'green' } : null  } >
                          <span>รายชื่อใกล้เคียงอันดับที่ { index+1 }</span>
                          <div style={{ marginTop: 8, textAlign: 'left', fontSize: 18, paddingLeft: 16 }}>
                            <div >#{ user.interviewRef }</div>
                            <div >ชื่อ-สกุล: { user.firstName + ' ' + user.lastName }</div>
                            <div >สาขา: WEB { user.major.toUpperCase() }</div>
                            <div >ความใกล้เคียง: { Math.round(user.similarity * 100) }%</div>
                          </div>
                        </div>
                        );
                      })
                    }

                    { this.state.thaiName.length === 0 &&
                      <div style={{ textAlign: 'center', fontSize: 24, color: 'gray', paddingTop: 100 }}>
                        ระบบไม่พบข้อมูลชื่อภาษาไทยของคุณ
                      </div>
                    }
                  </div>
                }
                {
                  this.state.popupType === 1 &&
                  <div style={{ textAlign: 'left', height: 360, overflow: 'auto' }}>
                  { this.state.friends.map((user, index) => {
                      return (
                        <div key={ index } className="user-info" >
                          <a target="_blank" href={ 'https://www.facebook.com/' + user.id } >
                            { user.thaiName === '' ? user.name : user.thaiName }
                          </a>
                          {
                            user.thaiName === '' &&
                            <div style={{ marginTop: 8, textAlign: 'center', fontSize: 18, color: 'gray' }}>ระบบไม่พบข้อมูลชื่อภาษาไทย</div>
                          }
                          {
                            user.thaiName !== '' && user.simUser.similarity < 0.65 &&
                            <div style={{ marginTop: 8, textAlign: 'center', fontSize: 18, color: 'gray' }}>ไม่พบรายชื่อใกล้เคียง</div>
                          }
                          {
                            user.thaiName !== '' && user.simUser.similarity >= 0.65 &&
                            <div style={{ marginTop: 8, textAlign: 'left', fontSize: 18, paddingLeft: 16 }}>
                              <div >#{ user.simUser.interviewRef }</div>
                              <div >ชื่อ-สกุล: { user.simUser.firstName + ' ' + user.simUser.lastName }</div>
                              <div >สาขา: WEB { user.simUser.major.toUpperCase() }</div>
                              <div >ความใกล้เคียง: { Math.round(user.simUser.similarity * 100) }%</div>
                            </div>
                          }
                        </div>
                      );
                    })
                  }
                  </div>
                }
              </div>
            }
            { !this.state.facebookAuth &&
              <div style={{ paddingTop: 100 }} >
                <div style={{ marginBottom: 24 }} >ให้ facebook ช่วยค้นหารายชื่อคุณและเพื่อนของคุณ</div>
                <hr style={{ width: 400, marginBottom: 24 }} />
                <FacebookLogin
                  appId="1545978732149875"
                  version='2.8'
                  autoLoad={false}
                  fields="name,email,friends,picture"
                  scope="public_profile,email,user_friends"
                  callback={this.responseFacebook} 
                  disableMobileRedirect={true}
                />
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div> 
        { this.state.showPopup && this.renderPopup() }
        { this.state.contactUs && <ContactUs onClick={ () => { this.toggleContactUs() } } /> }
        <div className="container" >
          <div className="menu-container" >
            <div className="menu" >
              <Tab onClick={ () => { this.changeTab('main') } } active={ this.state.activeTab === 'main' } icon={ require('./image/logo.png') } width={ 150 } height={ 56 } center={ true } />
              <Tab onClick={ () => { this.changeTab('content') } } active={ this.state.activeTab === 'content' } text={ 'CONTENT' } icon={ require('./image/content.png') }  width={ 64 } height={ 64 } />
              <Tab onClick={ () => { this.changeTab('design') } } active={ this.state.activeTab === 'design' } text={ 'DESIGN' } icon={ require('./image/design.png') }  width={ 64 } height={ 64 } />
              <Tab onClick={ () => { this.changeTab('marketing') } } active={ this.state.activeTab === 'marketing' } text={ 'MARKETING' } icon={ require('./image/marketing.png') }  width={ 64 } height={ 64 } />
              <Tab onClick={ () => { this.changeTab('programming') } } active={ this.state.activeTab === 'programming' } text={ 'PROGRAMMING' } icon={ require('./image/programming.png') }  width={ 64 } height={ 64 } />
              <Tab onClick={ () => { this.toggleContactUs() } } text={ 'CONTACT US' } width={ 64 } height={ 64 } center={ true } />
            </div>
          </div>
          <div className="content" >
            <UserList users={ this.filterUser(this.state.users) } title={ this.state.contentTitle } height={ this.state.height } onChange={ evt => this.updateInputValue(evt) } changeSortBy={ this.changeSortBy } picture={ this.state.picture } onClickFacebook={ () => {
              this.setState({ showPopup: true });
              document.body.style.overflow = 'hidden';
            }} />
          </div>
        </div>
      </div>
    );
  }

  changeTab = (tab) => {

    let users = this.users;
    let contentTitle = 'ผู้ผ่านเข้ารอบทั้งหมด';
    if(tab !== 'main') {
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

    return true;
  }

  updateInputValue(evt) {
    if(evt.target.value.length !== 0) {
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

    return true;
  }

  similar = (keyword, word) => {
    let dp = [];

    for(let i = 0; i <= keyword.length; i++) {
      dp.push([]);
      for(let j = 0; j <= word.length; j++) {
        if(i === 0 || j === 0) {
          dp[i].push(0);
          continue;
        }
        
        if(keyword[i-1] === word[j-1]) dp[i].push(dp[i-1][j-1] + 1);
        else if(dp[i-1][j] > dp[i][j-1]) dp[i].push(dp[i-1][j]);
        else dp[i].push(dp[i][j-1]);
      }
    }

    return dp[keyword.length][word.length] / keyword.length;
  }

  changeSortBy = (sortBy) => {
    if(this.state.sortBy !== sortBy) {
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

  getThaiName(A, B) {
    if(A[0] > 'z') return A;
    if(B[0] > 'z') return B;

    return '';
  }

  getEnglishName(A, B) {
    if(A[0] < 'z') return A;
    if(B[0] < 'z') return B;

    return '';
  } 

  toggleContactUs() {
    this.setState({
      contactUs: !this.state.contactUs,
    });

    if(!this.state.contactUs) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }
}