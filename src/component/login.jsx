import React, { Component } from 'react'
import { hashHistory, Link, Lifecycle } from 'react-router'
import classNames from 'classnames'
import reactMixin from 'react-mixin'

import template from './common/template'
import { Tool } from '../config/Tool'

@reactMixin.decorate(Lifecycle)
class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      canBack: false,
      mobile: null,
      password: null
    }
    this.routerWillLeave = this.routerWillLeave.bind(this)
  }

  routerWillLeave(nextLocation) {
    const { canBack } = this.state
    const { query } = this.props.location
    console.log(nextLocation)
    if (nextLocation.action !== 'POP' || (nextLocation.action === 'POP' && canBack)) {
      return true
    } else {
      this.setState({ canBack: true })
      setTimeout(() => {
        if (query.back && query.back === 'once') {
          hashHistory.goBack()
        } else {
          hashHistory.go(-2)
        }
      }, 300)
      return false
    }
  }

  formCheck() {
    let mobile   = this.state.mobile
    let password = this.state.password

    let res = null

    if(!Tool.phoneCheck(mobile)){
      res = "请输入正确手机号"
    }else if (password==null || password.length < 6 || password.length > 15 ) {
      res = "请输入密码（6-15字符）"
    }else{
      res = true
    }

    return res
  }

  onLoginClick(e) {
    e.preventDefault()
    const { getToken } = this.props
    const { query } = this.props.location
    let formCheckRes = this.formCheck(this)

    if (formCheckRes == true) {
      getToken(this.state.mobile, this.state.password)
      .then(json => {
        if (json && json.success) {
          if (query.redirectUrl) {
            let url = `${query.redirectUrl}?from=H5&mChannal=YX_APP&account=${json.userInfo.mobile}&token=${json.token}`
            window.location.replace(url)
          } else {
            hashHistory.replace('/login?back=once')
            hashHistory.goBack()
          }
        }
      })
    } else {
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

  goBack(e) {
    e.preventDefault()
    const { query } = this.props.location
    if (query.back && query.back === 'once') {
      hashHistory.goBack()
    } else {
      hashHistory.go(-2)
    }
  }

  goToRegister(e) {
    e.preventDefault()
    hashHistory.push('register')
  }

  render() {
    const { showFixed } = this.props.global
    const { mobile, password } = this.state

    return (
      <div className="login-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title"></p>
          <div className="page-btn" onClick={this.goToRegister.bind(this)}>立即注册</div>
        </div>
        <div className="logo-box"></div>
        <div className="form">
          <div className="input-frag">
            <input className="input-inner" type="tel" placeholder="手机号" maxLength="20" ref="mobileInput" onChange={this.handleInput.bind(this, 'mobile')}/>
            {mobile &&
              <button type="button" className="del-btn" onClick={this.handleDel.bind(this, 'mobile')}></button>
            }
          </div>
          <div className="input-frag">
            <input className="input-inner" type="password" placeholder="登录密码" maxLength="15" ref="passwordInput" onChange={this.handleInput.bind(this, 'password')}/>
            {password &&
              <button type="button" className="del-btn" onClick={this.handleDel.bind(this, 'password')}></button>
            }
          </div>
          <button type="submit" className={this.formCheck(this)==true ? 'submit-btn active' : 'submit-btn'} onClick={this.onLoginClick.bind(this)}>登录</button>
        </div>
        <div className="footer">
          <Link to="/forget" className="to-forget">忘记密码</Link>
        </div>
      </div>
    )
  }
}

export default template({
    id: 'login',
    component: Login,
    url: ''
})
