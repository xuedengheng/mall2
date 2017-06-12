import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import _ from 'lodash'
import classNames from 'classnames'
import Cookies from 'js-cookie'

import template from './common/template'

class RefundTrace extends Component {

  componentWillMount() {
    const { id } = this.props.params
    this.props.getRefundTrace(id)
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  render() {
    const account = Cookies.get('account') || ''
    const { trace } = this.props.refund
    const { showFixed } = this.props.global

    return (
      <div className="refund-trace-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">退款追踪</p>
        </div>
        { trace.map((item, index) => {
          return (
            <div key={index} className="trace-msg-box">
              <div data-flex="dir:left cross:center box:justify" className="title-inner">
                <div className={classNames('system', { me: item.operator === account, yiwu: item.operator === 'SYSTEM' })}></div>
                <p className="title">{item.operator === account ? '您' : item.operator === 'SYSTEM' ? '易物平台' : item.operator}</p>
                <p className="time">{item.createDate}</p>
              </div>
              <p className="content-inner" dangerouslySetInnerHTML={{ __html: item.message }}></p>
            </div>
          )
        }) }
      </div>
    )
  }
}

export default template({
  id: 'refundTrace',
  component: RefundTrace,
  url: ''
})
