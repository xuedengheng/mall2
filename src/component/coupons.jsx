import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'
import ReactPullLoad, { STATS } from 'react-pullload'

import template from './common/template'
import CouponItem from './common/couponItem'
import ConfirmModal from './common/confirmModal'

import { Tool } from '../config/Tool'

class Coupons extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hasMore: true,
      action: STATS.init,
      inited: false,
      status: 'ADOPTED',
      size: 10,
      isShowDel: false,
      delCoupon: null
    }
  }

  componentWillMount() {
    this.handRefreshing()
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  goToRule(e) {
    e.preventDefault()
    window.location.href = 'http://cdn.9yiwu.com/H5/Rule/coupon_rule.html'
  }

  changeStatus(status, e) {
    e.preventDefault()
    this.setState({ status })
    setTimeout(() => {
      this.handRefreshing()
    }, 200)
  }

  showDelModal(coupon) {
    this.setState({
      isShowDel: true,
      delCoupon: coupon
    })
  }

  closeDelModal(coupon) {
    this.setState({ isShowDel: false })
  }

  delCoupon() {
    const { delCoupon } = this.state
    this.props.delCoupon(delCoupon.id)
    .then(json => {
      Tool.alert('删除成功')
      this.handRefreshing()
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
    this.setState({ isShowDel: false })
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
    const { action, status, size } = this.state
    if (STATS.refreshing === action) return false
    const promise = this.props.getCouponList({ status: status, page: 0, size })
    if (promise) {
      promise.then(json => {
        this.setState({ inited: true })
        if (json && json.success) {
          setTimeout(() => {
            this.setState({
              hasMore: json.total > this.props.coupon.list.length,
              action: STATS.refreshed
            })
          }, 0)
        } else {
          this.setState({ hasMore: true, action: STATS.refreshed })
        }
      })
    }
    this.setState({ action: STATS.refreshing })
  }

  handLoadMore() {
    const { action, hasMore, status, size } = this.state
    const { page } = this.props.order
    if (STATS.loading === action) return false
    if (hasMore) {
      this.props.getCouponList({ status: status, page: page + 1, size })
      .then(json => {
        this.setState({ inited: true })
        if (json && json.success) {
          setTimeout(() => {
            this.setState({
              hasMore: json.total > this.props.coupon.list.length,
              action: STATS.reset
            })
          }, 0)
        } else {
          this.setState({ hasMore: true, action: STATS.reset })
        }
      })
      this.setState({ action: STATS.loading })
    } else {
      this.setState({ action: STATS.reset })
    }
  }

  renderCoupons() {
    const { list } = this.props.coupon
    const { inited, action, hasMore } = this.state

    if (list.length > 0) {
      return (
        <ReactPullLoad
          downEnough={100}
          action={action}
          handleAction={this.handleAction.bind(this)}
          hasMore={hasMore}
          distanceBottom={100}
          >
            <div className="coupon-list">
              { list.map((coupon, index) => {
                return <CouponItem
                        key={index}
                        mode="edit"
                        coupon={coupon}
                        onDel={this.showDelModal.bind(this, coupon)}></CouponItem>
              }) }
            </div>
        </ReactPullLoad>
      )
    } else if (inited) {
      return (
        <div className="empty-box">
          <div className="pic"></div>
          <p className="text">还没有优惠券</p>
        </div>
      )
    } else {
      return <div></div>
    }
  }

  render() {
    const { showFixed } = this.props.global
    const { status, isShowDel } = this.state

    return (
      <div className="coupons-wrap">
        <div className={classNames('page-header', 'no-border', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">我的优惠券</p>
          <div className="page-qaq" onClick={this.goToRule.bind(this)}></div>
        </div>
        <div data-flex="dir:left cross:center box:mean" className={classNames('coupon-category', { 'be-fixed': showFixed })}>
          <div
            className={classNames('item', { selected: status === 'ADOPTED' })}
            onClick={this.changeStatus.bind(this, 'ADOPTED')}
            >未使用</div>
          <div
            className={classNames('item', { selected: status === 'USED' })}
            onClick={this.changeStatus.bind(this, 'USED')}
            >已使用</div>
          <div
            className={classNames('item', { selected: status === 'EXPIRED' })}
            onClick={this.changeStatus.bind(this, 'EXPIRED')}
            >已过期</div>
        </div>
        {this.renderCoupons()}
        {isShowDel &&
          <ConfirmModal
            isFixed={showFixed}
            tips="确认删除该优惠券？"
            onCancel={this.closeDelModal.bind(this)}
            onConfirm={this.delCoupon.bind(this)}
            ></ConfirmModal>
        }
      </div>
    )
  }
}

export default template({
  id: 'coupons',
  component: Coupons,
  url: ''
})
