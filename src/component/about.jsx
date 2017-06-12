import React, { Component } from 'react'
import { Link, hashHistory } from 'react-router'
import classNames from 'classnames'

import { CDN_HOST } from '../config/constant'

import template from './common/template'

class About extends React.Component {

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  goToIntro(e) {
    e.preventDefault()
    window.location.href = `${CDN_HOST}/yiwu/YXabout_us.html`
  }

  goToAgreement(e) {
    e.preventDefault()
    window.location.href = `${CDN_HOST}/yiwu/YXagreement.html`
  }

  render() {
    const { showFixed } = this.props.global

    return (
      <div className="more-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">关于我们</p>
        </div>
        <div className="logo-box">
          <div className="logo">
            <img src={require('../images/logo.png')} />
          </div>
        </div>
        <div className="user-action no-margin">
          <div data-flex="dir:left cross:center box:last" className="item" onClick={this.goToIntro.bind(this)}>
            <p className="name">平台介绍</p>
            <div className="icon go"></div>
          </div>
          <div data-flex="dir:left cross:center box:last" className="item" onClick={this.goToAgreement.bind(this)}>
            <p className="name">用户协议</p>
            <div className="icon go"></div>
          </div>
        </div>
        <div className="copyright">
          <p className="content">前海易物(深圳)电子商务有限公司</p>
          <p className="content">Copyright &copy; 2016 YiWu,Icn. All Rights Reserved</p>
        </div>
      </div>
    )
  }
}

export default template({
  id: 'about',
  component: About,
  url: ''
})
