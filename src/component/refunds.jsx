import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import _ from 'lodash'
import classNames from 'classnames'
import ReactPullLoad, { STATS } from 'react-pullload'

import { REFUND_STATUS } from '../config/constant'

import template from './common/template'

class Refunds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasMore: true,
      action: STATS.init,
      total: 0,
      query: {
        size: 10
      }
    }
  }

  componentWillMount() {
    const { page } = this.props.refund
    const { query } = this.state
    this.props.getRefundList({ page, size: query.size })
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  goToDetail(id, e) {
    e.preventDefault()
    hashHistory.push(`refund/detail?requestid=${id}`)
  }

  handleAction(action) {
    if (action === this.state.action) return false

    if (action === STATS.refreshing) {
      this.handRefreshing()
    } else if (action === STATS.loading) {
      this.handLoadMore()
    } else{
      this.setState({ action: action })
    }
  }

  handRefreshing() {
    const { action, query } = this.state
    const { list } = this.props.refund
    if (STATS.refreshing === action) return false
    this.props.getRefundList({ page: 0, size: query.size })
    .then(json => {
      if (json && json.success) {
        const hasMore = list.length < json.total
        this.setState({
          hasMore,
          action: STATS.refreshed
        })
      }
    })
    .catch(() => {
      this.setState({
        hasMore: true,
        action: STATS.refreshed
      })
    })
    this.setState({ action: STATS.refreshing })
  }

  handLoadMore() {
    const { action, query, hasMore } = this.state
    const { list, page } = this.props.refund
    if (STATS.loading === action) return false
    if (hasMore) {
      this.props.getRefundList({ page: page + 1, size: query.size })
      .then(json => {
        if (json && json.success) {
          const hasMore = list.length < json.total
          this.setState({
            hasMore,
            action: STATS.reset
          })
        }
      })
      .catch(() => {
        this.setState({
          hasMore: true,
          action: STATS.reset
        })
      })
      this.setState({ action: STATS.loading })
    } else {
      this.setState({
        action: STATS.reset
      })
    }
  }

  render() {
    const { showFixed } = this.props.global
    const { list } = this.props.refund
    const { action, hasMore } = this.state

    return (
      <div className="refunds-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">退款/售后</p>
        </div>
        {list.length > 0 ?
          (
            <ReactPullLoad
              downEnough={100}
              action={action}
              handleAction={this.handleAction.bind(this)}
              hasMore={hasMore}
              distanceBottom={100}
              >
              {list.map((item, index) => {
                return (
                  <div key={index} className="refund-box">
                    <div
                      data-flex="dir:left cross:center box:justify"
                      className="title-inner"
                      onClick={this.goToDetail.bind(this, item.requestId)}>
                      <p className="title">{item.merchantName}发货</p>
                      <p className={classNames('status', { fail: item.status === 'REJECT' || item.status === 'NO_RECEIEVE_RETURN' })}>{REFUND_STATUS[item.status]}</p>
                      <div className="icon go"></div>
                    </div>
                    <div className="product-list">
                      <div data-flex="dir:left cross:center box:justify" className="item">
                        <div className="pic">
                          <img src={item.skuPicture} />
                        </div>
                        <div className="info">
                          <p className="name">
                            {item.activityType === 'TIME_LIMITATION' &&
                              <span className="spec">【限时购】</span>
                            }
                            {item.activityType === 'NEW_USER_LIMITATION' &&
                              <span className="spec">【新人专享】</span>
                            }
                            {item.productName}
                          </p>
                          <p className="attr">规格：{item.skuName}</p>
                        </div>
                        <div className="num">
                          <p className="amount">¥{item.unitPrice}</p>
                          <p className="quantity">x{item.refundNumber}</p>
                        </div>
                      </div>
                    </div>
                    <div className="amount-inner">
                      <p className="text">退款金额：<span className="bold">¥{item.refundAmount.toFixed(2)}</span></p>
                      <p className="text">交易金额：¥{item.amount.toFixed(2)}</p>
                    </div>
                  </div>
                )
              })}
            </ReactPullLoad>
          ) :
          (
            <div className="empty-box">
              <div className="pic"></div>
              <p className="text">暂无退款信息</p>
            </div>
          )
        }
      </div>
    )
  }
}

export default template({
  id: 'refunds',
  component: Refunds,
  url: ''
})
