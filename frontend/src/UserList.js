import React, { Component } from 'react'; 

export default class UserList extends Component {

  render() {

    return (
      <div >
        <div className="content-header" >
          <div className="content-title" >{ this.props.title } - { this.props.users.length } คน</div>
          <input type="text" placeholder="ค้นหา" value={ this.props.keyword } onChange={ this.props.onChange } />
          <div className="button" >
            <i className="fa fa-facebook" style={{ marginTop: 16, fontSize: 20 }} />
          </div>
        </div>
        <hr />
        <div>
          <table style={{ width: '100%' }} >
            <thead>
              <tr>
                <td style={{ width: 88, fontSize: 20 }} >
                  <span onClick={ () => this.props.changeSortBy('interviewRef') } className="table-header" >#</span>
                </td>
                <td style={{ fontSize: 20 }} >
                  <span onClick={ () => this.props.changeSortBy('name') } className="table-header" >ชื่อ-สกุล</span>
                </td>
                <td style={{ width: 152, fontSize: 20 }} >
                  <span onClick={ () => this.props.changeSortBy('major') } className="table-header" >สาขา</span>
                </td>
              </tr>
            </thead>

            <tbody>
              {
                this.props.users.map((user, index) => {
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
