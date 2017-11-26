import React, { Component } from 'react';

export default class ContactUs extends Component {

  render() {

    return (
      <div className="popup-container" >
        <div className="popup-content" >
          <div className="popup" >
            <div style={{ textAlign: 'left', marginLeft: 12 }} >
              <span style={{ cursor: 'pointer', fontSize: 24 }} onClick={ this.props.onClick } >X</span>
            </div>
            <div style={{ marginTop: -36 }} >
              <span style={{ fontSize: 24 }} >ติดต่อเรา</span>
              <hr/>
              <div className="user-info" style={{ fontSize: 32, paddingTop: 100, textAlign: 'center', height: 230 }} >
                <div>พี่เบ๊บ - 064-174-7080</div>
                <div>พี่ฟง - 092-458-7067</div>
                <div>พี่เบนซ์ - 085-666-7571</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
