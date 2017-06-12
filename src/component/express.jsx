import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import _ from 'lodash'
import classNames from 'classnames'

import template from './common/template'

class Express extends Component {

  componentWillMount() {
    const { id } = this.props.params
    this.props.getJdExpressList(id)
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  render() {
    const { id } = this.props.params
    const { showFixed } = this.props.global
    const newJdList = _.reverse(this.props.express.jdList.slice(0))

    return (
      <div className="express-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">查看物流</p>
        </div>
        <div data-flex="dir:left cross:center box:first" className="express-info-box">
          <div className="pic">
            <img src={require('../images/jd_express.png')} />
          </div>
          <div className="info">
            <p className="name">京东快递</p>
            <p className="text">物流编号：{id}</p>
          </div>
        </div>
        <div className="express-history-box">
          <p className="title">物流追踪</p>
          <div className="history-list">
            {newJdList.map((step, index) => {
              return (
                <div key={index} className="history-step">
                  <div className="step-line"></div>
                  <div className="step-dot"></div>
                  <div className="step-content">
                    <p className="text">{step.content}</p>
                    <p className="time">{step.msgTime}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default template({
  id: 'express',
  component: Express,
  url: ''
})
