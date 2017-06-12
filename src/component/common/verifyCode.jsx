import React, { Component } from 'react'

export default class VerifyCode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mobile: null,
      vcTimer: 60,
      ready: true
    }
  }

  onVerifyCodeClick(e) {
    e.preventDefault()
    const { getVerifyCode } = this.props
    if(this.state.ready){
      getVerifyCode(this.state.mobile, this.state.vcType);
    }

    if(this.state.ready){
      this.timer = setInterval(function () {
        let vcTimer = this.state.vcTimer;
        this.setState({
          ready: false
        });
        vcTimer -= 1;
        if (vcTimer < 1) {
          this.setState({
            ready: true
          });
          vcTimer = 60;
          clearInterval(this.timer);
        }
        this.setState({
          vcTimer: vcTimer
        });
      }.bind(this), 1000);
    }
  }

  render() {
    let verifyCodeText = this.state.ready ? '点击获取' : this.state.vcTimer + '秒后获取';

    return (
      <button type="button" className="cap-btn" disabled={!this.state.ready} onClick={this.onVerifyCodeClick.bind(this)}>{verifyCodeText}</button>
    )
  }
}
