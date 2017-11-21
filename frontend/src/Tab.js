import React, { Component } from 'react';

export default class Tab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hover: false
    }
  }

  mouseEnter() {
    if(this.props.active) return;
    
    this.setState({
      hover: true
    });
  }

  mouseLeave() {
    if(this.props.active) return;
    
    this.setState({
      hover: false
    });
  }

  render() {

    let className;
    let containerClassName = 'tab-container';

    if(this.state.hover) className = 'tab-hover';
    else if(this.props.active) className = 'tab-active';
    else className = 'tab';

    return (
      <div className={ containerClassName } >
        <div className={ className } style={ this.props.center ? { justifyContent: 'center' } : null } onMouseEnter={ () => this.mouseEnter() } onMouseLeave={ () => this.mouseLeave() } >
            <img src={ this.props.icon } style={{ width: this.props.width, height: this.props.height, margin: 8 }} />
            <div className="tab-text" >{ this.props.text }</div>
        </div>
      </div>
    )
  }
}
