import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import classNames from 'classnames'

import template from './common/template'
import { Tool } from '../config/Tool'
import { CDN_HOST } from '../config/constant'

import { track } from '../utils/sa'
import { isPassword } from '../utils/reg'

class Register extends Component {
  constructor(props) {
    super(props)
    this.timer = null
    this.state = {
      mobile: '',
      password: null,
      verifyCode: null,
      isChecked: false,
      vcType: 'REG',
      vcTimer: 60,
      ready: true
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  formCheck() {
    let mobile   = this.state.mobile
    let password = this.state.password
    let verifyCode = this.state.verifyCode
    let isChecked  = this.state.isChecked

    let res = null

    if (!Tool.phoneCheck(mobile)) {
      res = "请输入正确手机号"
    } else if (password == null || password.length < 6 || password.length > 15) {
      res = "请输入密码（6-15字符）"
    } else if (!isPassword(password)) {
      res = "密码只能由字母数字下划线组成"
    } else if (verifyCode == null || password.length > 6) {
      res = "请输入6位短信验证码"
    } else if (!isChecked) {
      res = "请查看用户协议"
    } else {
      res = true
    }

    return res
  }

  onVerifyCodeClick(e) {
    e.preventDefault()
    const { getVerifyCode } = this.props
    const { mobile, ready, vcType } = this.state

    if (ready) {
      if (!Tool.phoneCheck(mobile)) {
        Tool.alert('请输入正确手机号')
      } else {
        this.props.changeLoadingState(true)
        getVerifyCode(mobile, vcType)
        .then(json => {
          this.props.changeLoadingState(false)
          Tool.alert(json.msg)
          this.timer = setInterval(() => {
            let vcTimer = this.state.vcTimer
            this.setState({ ready: false })
            vcTimer -= 1
            if (vcTimer < 1) {
              this.setState({ ready: true })
              vcTimer = 60
              clearInterval(this.timer)
            }
            this.setState({ vcTimer: vcTimer })
          }, 1000)
          track('verification_code', {
            mobile: mobile,
            is_successful: true
          })
        })
        .catch(error => {
          this.props.changeLoadingState(false)
          if (error.code) Tool.alert(error.message)
          console.log(error)
          track('verification_code', {
            mobile: mobile,
            is_successful: false
          })
        })
      }
    }
  }

  onRegisterClick(e) {
    e.preventDefault()
    const { registerReq } = this.props
    let attrs = this.state
    let formCheckRes = this.formCheck(this)

    if(formCheckRes==true){
      registerReq(attrs.mobile, attrs.password, attrs.verifyCode);
    }else{
      Tool.alert(formCheckRes)
    }
  }

  handleInput(type, e) {
    // 判断 value 是否符合规则
    let value = e.target.value
    this.setAttr(type, value);
  }

  handleDel(type, e) {
    this.setAttr(type, null);
    this.refs[`${type}Input`].value = '';
  }

  setAttr(key, value) {
    this.setState({[`${key}`]: value});
  }

  toggleIsChecked() {
    this.setState({isChecked: !this.state.isChecked});
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  render() {
    const { showFixed } = this.props.global
    const { mobile, password } = this.state
    let verifyCodeText = this.state.ready ? '点击获取' : this.state.vcTimer + '秒后获取';
    return (
      <div className="reg-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">注册</p>
        </div>
        <div className="form">
          <div className="input-frag">
            <input className="input-inner" type="tel" placeholder="手机号" maxLength="20" ref="mobileInput" onChange={this.handleInput.bind(this, 'mobile')}/>
            {mobile &&
              <button type="button" className="del-btn" onClick={this.handleDel.bind(this, 'mobile')}></button>
            }
          </div>
          <div className="input-frag">
            <input className="input-inner" type="text" placeholder="请输入验证码" maxLength="6" onChange={this.handleInput.bind(this, 'verifyCode')}/>
            <button type="button" className="cap-btn" disabled={!this.state.ready} onClick={this.onVerifyCodeClick.bind(this)}>{verifyCodeText}</button>
          </div>
          <div className="input-frag">
            <input className="input-inner" type="password" placeholder="登录密码（6-15字符）" maxLength="15" ref="passwordInput" onChange={this.handleInput.bind(this, 'password')}/>
            {password &&
              <button type="button" className="del-btn" onClick={this.handleDel.bind(this, 'password')}></button>
            }
          </div>
          <div className="checkbox-frag">
            <p className="text">
              已阅读并同意
              <a href={`${CDN_HOST}/yiwu/YXagreement.html`} className="lnk">《易物网用户协议》</a>
            </p>
            <div className={this.state.isChecked ? 'check checked' : 'check'} onClick={this.toggleIsChecked.bind(this)}></div>
          </div>
          <button type="submit" className={this.formCheck(this)==true ? 'submit-btn active' : 'submit-btn'} onClick={this.onRegisterClick.bind(this)}>立即注册</button>
        </div>
      </div>
    )
  }
}

export default template({
  id: 'register',
  component: Register,
  url: ''
})
