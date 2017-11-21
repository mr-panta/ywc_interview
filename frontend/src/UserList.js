import React, { Component } from 'react'; 

export default class UserList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      keyword: ''
    };

  }

  updateInputValue = function(evt) {
    this.setState({
      keyword: evt.target.value
    });
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

  filterUser = function(users) {
    if(this.state.keyword != '') {
      let filteredUsers = [];
      
      for(let i = 0; i < users.length; i++) {  
        let filteredUser = users[i];
        filteredUser.similarity = this.similar(this.state.keyword, users[i].firstName + ' ' + users[i].lastName);
        if(filteredUser.similarity >= 0.65) filteredUsers.push(filteredUser);
      }

      return filteredUsers.sort((A, B) => {
        return A.similarity < B.similarity;
      });
    }
    else return users;
  }

  render() {

    return (
      <div >
        <div className="content-header" >
          <div className="content-title" >{ this.props.title }</div>
          <input type="text" placeholder="ค้นหา" value={ this.state.keyword } onChange={evt => this.updateInputValue(evt) } />
          <div className="button" >
            <i className="fa fa-search" style={{ marginTop: 16 }} />
          </div>
        </div>
        <hr />
        <div>
          <table style={{ width: '100%' }} >
            <thead>
              <tr>
                <td style={{ width: 88, fontSize: 20 }} >#</td>
                <td style={{ fontSize: 20 }} >ชื่อ-สกุล</td>
                <td style={{ width: 152, fontSize: 20 }} >สาขา</td>
              </tr>
            </thead>

            <tbody>
              {
                this.filterUser(this.props.users).map((user, index) => {
                  return (
                    <tr key={ index } >
                      <td style={{ width: 88 }} >{ user.interviewRef } </td>
                      <td >{ user.firstName } { user.lastName } </td>
                      <td style={{ width: 152 }} >WEB { user.major.toUpperCase() }</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
