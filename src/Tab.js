import React, { Component } from 'react';

export default class Tab extends Component {

  render() {

    let className;
    let containerClassName = 'tab-container';

    if(this.props.active) className = 'tab-active';
    else className = 'tab';

    return (
      <div className={ containerClassName } onClick={ () => { 
        window.scrollTo(0, 0);
        this.props.onClick();
        this.setState({
          hover: false
        });
      }} >
        <div className={ className } style={ this.props.center ? { justifyContent: 'center' } : null } >
            <img alt="" src={ this.props.icon } style={{ width: this.props.width, height: this.props.height, margin: 8 }} />
            <div className="tab-text" >{ this.props.text }</div>
        </div>
      </div>
    )
  }
}
