import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'

import { CDN_HOST } from '../config/constant'

import template from './common/template'

class More extends React.Component {

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  goToAbout(e) {
    e.preventDefault()
    hashHistory.push('/about')
  }

  goToRefund(e) {
    e.preventDefault()
    window.location.href = `${CDN_HOST}/yiwu/YXshipping.html`
  }

  render() {
    const { showFixed } = this.props.global

    return (
      <div className="more-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">更多</p>
        </div>
        <div className="user-action">
          <div data-flex="dir:left cross:center box:last" className="item" onClick={this.goToAbout.bind(this)}>
            <p className="name">关于我们</p>
            <div className="icon go"></div>
          </div>
          <div data-flex="dir:left cross:center box:last" className="item" onClick={this.goToRefund.bind(this)}>
            <p className="name">研选售后</p>
            <div className="icon go"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default template({
  id: 'more',
  component: More,
  url: ''
})
