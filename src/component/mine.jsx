import React, { Component } from 'react'
import { Link, hashHistory } from 'react-router'
import { isWx } from '../utils/ua'
import Cookies from 'js-cookie'

import FootTab from './common/footTab'
import template from './common/template'
import AttentionModal from './common/attentionModal'

class Mine extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showAttention: false
    }
  }

  componentWillMount() {
    const promise = this.props.getMineUser()
    if (promise) {
      promise.then(json => {
        if (json && json.success) {
          this.props.getOrderStatusCount()
          this.props.getCouponCount()
          isWx() && this.props.getInvitationList()
        }
      })
    }
  }

  gotoProfile() {
    hashHistory.push('profile')
  }

  showAttentionModal(e) {
    e.preventDefault()
    this.setState({ showAttention: true })
  }

  goToAddr(e) {
    e.preventDefault()
    hashHistory.push('address')
  }

  goToOrders(e) {
    e.preventDefault()
    hashHistory.push('orders')
  }

  goToMore(e) {
    e.preventDefault()
    hashHistory.push('more')
  }

  goToRefunds(e) {
    e.preventDefault()
    hashHistory.push('refunds')
  }

  goToCoupons(e) {
    e.preventDefault()
    hashHistory.push('coupons')
  }

  goToInvitation(e) {
    e.preventDefault()
    const account = Cookies.get('account') || ''
    const { list } = this.props.invitation
    let url = list[0].refLink.indexOf('?') >= 0 ? `${list[0].refLink}&from=H5&mChannal=YX_APP` : `${list[0].refLink}?from=H5&mChannal=YX_APP`
    url = account ? `${url}&account=${account}` : url
    window.location.href = url
  }

  goToOrdersByStatus(type, e) {
    e.preventDefault()
    hashHistory.push(`orders?status=${type}`)
  }

  closeAttentionModal() {
    this.setState({ showAttention: false })
  }

  getOrderStatusCount(status) {
    const { counts } = this.props.order
    if (counts.length === 0) return 0
    const index = _.findIndex(counts, (item) => {
      return item.orderStatus === status
    })
    if (index < 0) return 0
    return counts[index].orderCount
  }

  omitOrderStatusCount(count) {
    return count > 99 ? '99+' : count
  }

  render() {
    const { user } = this.props.mine
    const { counts } = this.props.order
    const { count } = this.props.coupon
    const { list } = this.props.invitation
    const { showFixed } = this.props.global
    const { showAttention } = this.state

    return (
      <div className="personal-wrap">
        <div data-flex="dir:left cross:center box:justify" className="user-profile" onClick={this.gotoProfile.bind(this)}>
          <div className="avatar">
            {user.avatar &&
              <img src={user.avatar} />
            }
          </div>
          <p className="name">{user.nickName}</p>
          <div className="icon go"></div>
        </div>
        <div className="user-order">
          <div data-flex="dir:left cross:center box:justify" className="title" onClick={this.goToOrders.bind(this)}>
            <p className="name">我的订单</p>
            <p className="subName">查看全部订单</p>
            <div className="icon go"></div>
          </div>
          <div data-flex="dir:left main:center cross:center box:mean" className="status">
            <div className="item" onClick={this.goToOrdersByStatus.bind(this, '10')}>
              <div className="icon pending">
                {this.getOrderStatusCount(10) > 0 &&
                  <div className="dotted">{this.omitOrderStatusCount(this.getOrderStatusCount(10))}</div>
                }
              </div>
              <p className="name">待支付</p>
            </div>
            <div className="item" onClick={this.goToOrdersByStatus.bind(this, '30')}>
              <div className="icon paid">
                {this.getOrderStatusCount(30) > 0 &&
                  <div className="dotted">{this.omitOrderStatusCount(this.getOrderStatusCount(30))}</div>
                }
              </div>
              <p className="name">待发货</p>
            </div>
            <div className="item" onClick={this.goToOrdersByStatus.bind(this, '40')}>
              <div className="icon shipping">
                {this.getOrderStatusCount(40) > 0 &&
                  <div className="dotted">{this.omitOrderStatusCount(this.getOrderStatusCount(40))}</div>
                }
              </div>
              <p className="name">待收货</p>
            </div>
            <div className="item" onClick={this.goToRefunds.bind(this)}>
              <div className="icon refund"></div>
              <p className="name">退款/售后</p>
            </div>
          </div>
        </div>
        <div className="user-action">
          <div data-flex="dir:left cross:center box:justify" className="item" onClick={this.goToCoupons.bind(this)}>
            <p className="name">我的优惠券</p>
            <p className="info">{count}张</p>
            <div className="icon go"></div>
          </div>
          {list.length > 0 &&
            <div data-flex="dir:left cross:center box:justify" className="item" onClick={this.goToInvitation.bind(this)}>
              <p className="name">邀请好友</p>
              <p className="info">立即邀请</p>
              <div className="icon go"></div>
            </div>
          }
          <div data-flex="dir:left cross:center box:last" className="item" onClick={this.goToAddr.bind(this)}>
            <p className="name">地址管理</p>
            <div className="icon go"></div>
          </div>
          <div data-flex="dir:left cross:center box:last" className="item" onClick={this.showAttentionModal.bind(this)}>
            <p className="name">关注我们</p>
            <div className="icon go"></div>
          </div>
          <div data-flex="dir:left cross:center box:last" className="item" onClick={this.goToMore.bind(this)}>
            <p className="name">更多</p>
            <div className="icon go"></div>
          </div>
        </div>
        <FootTab index="3" isFixed={showFixed}></FootTab>
        {showAttention &&
          <AttentionModal isFixed={showFixed} onClose={this.closeAttentionModal.bind(this)}></AttentionModal>
        }
      </div>
    )
  }
}

export default template({
  id: 'mine',
  component: Mine,
  url: ''
})
