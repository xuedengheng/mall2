import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import _ from 'lodash'
import moment from 'moment'
import classNames from 'classnames'

moment.locale('zh-cn')

import { Tool } from '../config/Tool'
import { ORDER_STATUS, PAY_WAY, REFUND_STATUS, EXPRESS_TYPE } from '../config/constant'

import template from './common/template'
import AttentionModal from './common/attentionModal'
import ConfirmModal from './common/confirmModal'

class Order extends Component {

  constructor(props) {
    super(props)
    this.timer = null
    this.state = {
      opParcel: null,
      isShowCancel: false,
      isShowAttention: false,
      isShowConfirm: false,
      isShowDelay: false,
      now: moment()
    }
  }

  componentWillMount() {
    const { id } = this.props.params
    this.props.getOrderDetail(id)
  }

  componentDidMount() {
    const that = this
    this.timer = setInterval(() => {
      const { detail } = this.props.order
      const newNow = moment()
      if (detail) {
        if (detail.orderStatus == '10') {
          const end = moment(detail.exprieTime)
          if (newNow.unix() >= end.unix()) {
            that.clearTimer()
            window.location.href = window.location.href
          }
        }
        _.forEach(detail.parcelList, parcel => {
          if (parcel.status == '40') {
            const deadline = moment(parcel.deadline)
            if (newNow.unix() >= deadline.unix()) {
              that.clearTimer()
              window.location.href = window.location.href
            }
          }
        })
      }
      this.setState({ now: moment() })
    }, 1000)
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  goToExpress(parcel, e) {
    e.preventDefault()
    if (parcel.expressCorp == 'JD') {
      hashHistory.push(`express/${parcel.expressNum}`)
    } else {
      const type = EXPRESS_TYPE[parcel.expressCorp] ? EXPRESS_TYPE[parcel.expressCorp].searchCode : ''
      const postId = parcel.expressNum || ''
      const url = encodeURIComponent(window.location.href)
      window.location.href = `https://m.kuaidi100.com/index_all.html?type=${type}&postid=${postId}&callbackurl=${url}`
    }
  }

  goToPay(parcel, e) {
    e.preventDefault()
    e.stopPropagation()
    const { detail } = this.props.order
    const now = moment()
    const exprieTime = moment(detail.exprieTime)
    if (now.unix() >= exprieTime.unix()) {
      Tool.alert('抱歉，该订单已超过有效支付期')
    } else {
      hashHistory.push(`pay?id=${parcel.orderId}&from=order&mode=immediately`)
    }
  }

  showAttentionModal(e) {
    e.preventDefault()
    this.setState({ isShowAttention: true })
  }

  closeAttentionModal() {
    this.setState({ isShowAttention: false })
  }

  handleRemind(type, e) {
    e.preventDefault()
    let typeText = type === 'allocate' ? '配货' : type === 'ship' ? '发货' : ''
    if (navigator.onLine) {
      Tool.alert(`提醒${typeText}成功`)
    } else {
      Tool.alert(`提醒${typeText}失败`)
    }
  }

  renderRefundStatus(parcel, detail) {
    const { now } = this.state
    if (detail.postPurchasedStatus) {
      let statusText = ''
      switch (detail.postPurchasedStatus) {
        case 'IN_PROGRESSING':
          statusText = '审核中'
          break
        case 'PENDING_RETURN':
          statusText = '请退货'
          break
        case 'USER_RETURNED':
          statusText = '已退货'
          break
        case 'RECEIEVE_RETURN':
          statusText = '已收货'
          break
        case 'PENDING_REFUND':
          statusText = '退款中'
          break
        case 'REFUNDED':
          statusText = '退款成功'
          break
        case 'REJECT':
          statusText = '退款失败'
          break
        default:
          statusText = REFUND_STATUS[detail.postPurchasedStatus]
          break
      }
      return <div className="status" onClick={this.goToRefund.bind(this, detail.orderId, detail.skuId)}>{statusText}</div>
    } else {
      if (detail.canRefund === 'Y') {
        if (parcel.status === '30' || parcel.status === '40') {
          return <div className="status" onClick={this.goToCreateRefund.bind(this, detail.orderId, detail.skuId)}>申请退款</div>
        } else if (parcel.status === '60') {
          const receiveTime = moment(parcel.receiveTime)
          if (now.unix() >= receiveTime.unix() + 7 * 24 * 60 * 60) {
            return <span></span>
          } else {
            return <div className="status" onClick={this.goToCreateRefund.bind(this, detail.orderId, detail.skuId)}>申请售后</div>
          }
        } else {
          return <span></span>
        }
      } else {
        return <span></span>
      }
    }
  }

  renderBtnWrap(parcel) {
    if (parcel.status === '10') {
      return (
        <div className="action-inner">
          <button className="btn pay" onClick={this.goToPay.bind(this, parcel)}>立即支付</button>
          <button className="btn" onClick={this.showCancelModal.bind(this, parcel)}>取消订单</button>
        </div>
      )
    } else if (parcel.status === '20') {
      return (
        <div className="action-inner">
          <button className="btn" onClick={this.handleRemind.bind(this, 'allocate')}>提醒配货</button>
        </div>
      )
    } else if (parcel.status === '30') {
      return parcel.isRemindedShipping === 'N' ? (
        <div className="action-inner">
          <button className="btn" onClick={this.handleRemind.bind(this, 'ship')}>提醒发货</button>
        </div>
      ) : (
        <div></div>
      )
    } else if (parcel.status === '40') {
      return (
        <div className="action-inner">
          <button className="btn pay" onClick={this.showConfirmModal.bind(this, parcel)}>确认收货</button>
          {parcel.expressCorp &&
            <button className="btn" onClick={this.goToExpress.bind(this, parcel)}>查看物流</button>
          }
          { parcel.isDelayedReceive === 'N' &&
            <button className="btn" onClick={this.showDelayModal.bind(this, parcel)}>延长收货</button>
          }
        </div>
      )
    } else if (parcel.status === '60') {
      return parcel.expressCorp && parcel.expressCorp !== 'JD' ? (
        <div className="action-inner">
          <button className="btn" onClick={this.goToExpress.bind(this, parcel)}>查看物流</button>
        </div>
      ) : <div></div>
    } else {
      return <div></div>
    }
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  goToCreateRefund(orderId, skuId, e) {
    e.preventDefault()
    hashHistory.push(`/refund/create?orderid=${orderId}&skuid=${skuId}`)
  }

  goToRefund(orderId, skuId, e) {
    e.preventDefault()
    hashHistory.push(`/refund/detail?orderid=${orderId}&skuid=${skuId}`)
  }

  goToProduct(id, e) {
    e.preventDefault()
    hashHistory.push(`/product/${id}`)
  }

  showCancelModal(parcel, e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      opParcel: parcel,
      isShowCancel: true
    })
  }

  closeCancelModal() {
    this.setState({ isShowCancel: false })
  }

  showConfirmModal(parcel, e) {
    e.preventDefault()
    this.setState({
      opParcel: parcel,
      isShowConfirm: true
    })
  }

  closeConfirmModal() {
    this.setState({ isShowConfirm: false })
  }

  showDelayModal(parcel, e) {
    e.preventDefault()
    this.setState({
      opParcel: parcel,
      isShowDelay: true
    })
  }

  closeDelayModal() {
    this.setState({ isShowDelay: false })
  }

  confirmParcel() {
    const { opParcel } = this.state
    const { id } = this.props.params
    this.setState({ isShowConfirm: false })
    this.props.confirmParcel(opParcel.parcelId)
    .then(json => {
      Tool.alert('确认收货成功')
      this.props.getOrderDetail(id)
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }

  delayParcel() {
    const { opParcel } = this.state
    const { id } = this.props.params
    this.setState({ isShowDelay: false })
    this.props.delayParcel(opParcel.parcelId)
    .then(json => {
      Tool.alert('延长收货成功')
      this.props.getOrderDetail(id)
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }

  cancelOrder() {
    const { status } = this.props.order
    const { id } = this.props.params
    const { opParcel } = this.state
    this.setState({ isShowCancel: false })
    this.props.cancelOrder(opParcel.orderId)
    .then(json => {
      Tool.alert('取消订单成功')
      this.props.getOrderDetail(id)
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }

  render() {
    const { showFixed } = this.props.global
    const { detail } = this.props.order
    const { isShowAttention, isShowConfirm, isShowDelay, isShowCancel, now } = this.state

    const payEnd = detail && detail.exprieTime ? moment(detail.exprieTime) : moment()
    const payDuration = moment.duration(payEnd.diff(now))

    let hadFirstShip = false
    let hadFirstExpress = false
    let hadFirstReceive = false

    return detail ? (
      <div className="order-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">订单详情</p>
        </div>
        <p className="order-title">
          {detail.storeName}发货
          {detail.orderStatus == '10' && payDuration.asMilliseconds() > 0 &&
            <span className="util-close-time">{payDuration.minutes()}分{payDuration.seconds()}秒后关闭订单</span>
          }
        </p>
        <div className="post-list">
          <p className="mobile">{detail.contactsMobile}</p>
          <div data-flex="dir:left cross:center box:first" className="item">
            <div className="icon location"></div>
            <div className="info">
              <p className="name">收货人：{detail.contactsName}</p>
              <p className="addr">收货地址：{detail.contactsProvince} {detail.contactsCity} {detail.contactsTown} {detail.contactsBlock}{detail.contactsStreet}{detail.contactsAddress}</p>
            </div>
          </div>
          {detail.remark &&
            <div data-flex="dir:left cross:center box:first" className="item">
              <div className="icon msg"></div>
              <div className="info">
                <p className="msg-title">买家留言</p>
                <p className="msg">{detail.remark}</p>
              </div>
            </div>
          }
        </div>
        {detail.parcelList.map((parcel, index) => {
          const receiveEnd = parcel.deadline ? moment(parcel.deadline) : moment()
          const receiveDuration = moment.duration(receiveEnd.diff(now))

          return (
            <div key={parcel.parcelId} className="package-box">
              <div className="package-status">{ORDER_STATUS[parcel.status]}</div>
              <p className="title">
                包裹{index + 1}
                { parcel.status == '40' && receiveDuration.asMilliseconds() > 0 &&
                  <span className="bold">{receiveDuration.days()}天{receiveDuration.hours()}时{receiveDuration.minutes()}分{receiveDuration.seconds()}秒后自动收货</span>
                }
              </p>
              <div className="product-list">
                {parcel.orderDetailList.map((detail, index) => {
                  return (
                    <div key={detail.id} className="item">
                      <div className="num">x<span className="bold">{detail.quantity}</span></div>
                      { this.renderRefundStatus(parcel, detail) }
                      <div className="pic" onClick={this.goToProduct.bind(this, detail.productId)}>
                        <img src={detail.picture} />
                      </div>
                      <div className="right">
                        <p className="name">
                          {detail.activityType === 'TIME_LIMITATION' &&
                            <span className="spec">【限时购】</span>
                          }
                          {detail.activityType === 'NEW_USER_LIMITATION' &&
                            <span className="spec">【新人专享】</span>
                          }
                          {detail.productName}
                        </p>
                        <p className="attr">规格：{detail.productAttr}</p>
                        {detail.payPrice &&
                          <p className="price">¥{detail.payPrice}
                            {detail.payPrice != detail.price &&
                              <span className="origin-price">¥{detail.price}</span>
                            }
                          </p>
                        }
                        {!detail.payPrice &&
                          <p className="price">¥{detail.price}</p>
                        }

                      </div>
                    </div>
                  )
                })}
                { this.renderBtnWrap(parcel) }
              </div>
            </div>
          )
        })}
        <div className="total-box">
          <div className="text-inner">
            <p className="left">商品总计</p>
            <p className="right">¥ {detail.amount}</p>
          </div>
          {detail.isDiscounted == 'Y' &&
            <div className="text-inner">
              <p className="left">优惠总计</p>
              <p className="right">-¥ {(Number(detail.couponDiscount) + Number(detail.discount)).toFixed(2)}</p>
            </div>
          }
          <div className="text-inner">
            <p className="left">运费</p>
            <p className="right">¥ {detail.freight}</p>
          </div>
          <div className="fee-inner">
            <p className="left">实付</p>
            <p className="right">¥ {detail.payAmount}</p>
          </div>
        </div>
        <div className="info-box">
          <div data-flex="dir:left cross:center box:justify" className="service-inner" onClick={this.showAttentionModal.bind(this)}>
            <div className="icon service"></div>
            <p className="text">联系客服</p>
            <div className="icon go"></div>
          </div>
          <div className="text-box">
            {detail.orderId &&
              <div className="text-inner">
                <p className="left">订单编号</p>
                <p className="right">{detail.orderId}</p>
              </div>
            }
            {detail.createTime &&
              <div className="text-inner">
                <p className="left">提交时间</p>
                <p className="right">{detail.createTime}</p>
              </div>
            }
            {detail.orderStatus !== '10' && detail.orderStatus !== '90' && detail.prepayTime &&
              <div className="text-inner">
                <p className="left">支付时间</p>
                <p className="right">{detail.prepayTime}</p>
              </div>
            }
            {detail.orderStatus !== '10' && detail.orderStatus !== '90' && detail.payWay &&
              <div className="text-inner">
                <p className="left">支付方式</p>
                <p className="right">{PAY_WAY[detail.payWay]}</p>
              </div>
            }
            {detail.orderStatus !== '10' && detail.orderStatus !== '90' && detail.orderJnId &&
              <div className="text-inner">
                <p className="left">交易流水号</p>
                <p className="right">{detail.orderJnId}</p>
              </div>
            }
            {detail.orderStatus !== '10' && detail.orderStatus !== '90' && detail.orderStatus !== '20' && detail.allocateTime &&
              <div className="text-inner">
                <p className="left">配货时间</p>
                <p className="right">{detail.allocateTime}</p>
              </div>
            }
            {detail.parcelList.map((parcel, index) => {
              if (parcel.shippingTime) {
                const hadFirstShipCache = hadFirstShip
                hadFirstShip = true
                return (
                  <div key={index} className="text-inner">
                    {!hadFirstShipCache &&
                      <p className="left">发货时间</p>
                    }
                    <p className="right">{parcel.shippingTime} (包裹{index + 1})</p>
                  </div>
                )
              } else {
                return <div key={index}></div>
              }
            })}
            {detail.parcelList.map((parcel, index) => {
              if (parcel.expressNum) {
                const hadFirstExpressCache = hadFirstExpress
                hadFirstExpress = true
                return (
                  <div key={index} className="text-inner">
                    {!hadFirstExpressCache &&
                      <p className="left">快递单号</p>
                    }
                    <p className="right">{parcel.expressNum} (包裹{index + 1}，{EXPRESS_TYPE[parcel.expressCorp] ? EXPRESS_TYPE[parcel.expressCorp].name : parcel.expressCorp})</p>
                  </div>
                )
              } else {
                return <div key={index}></div>
              }
            })}
            {detail.parcelList.map((parcel, index) => {
              if (parcel.expressNum) {
                const hadFirstReceiveCache = hadFirstReceive
                hadFirstReceive = true
                return (
                  <div key={index} className="text-inner">
                    {!hadFirstReceiveCache &&
                      <p className="left">收货时间</p>
                    }
                    <p className="right">{parcel.receiveTime} (包裹{index + 1})</p>
                  </div>
                )
              } else {
                return <div key={index}></div>
              }
            })}
          </div>
        </div>
        {isShowAttention &&
          <AttentionModal isFixed={showFixed} onClose={this.closeAttentionModal.bind(this)}></AttentionModal>
        }
        {isShowConfirm &&
          <ConfirmModal
            isFixed={showFixed}
            tips="确认收到货物？"
            subTips="请确认您已收到该笔订单内所有商品"
            confirmBtnText="确认收货"
            onCancel={this.closeConfirmModal.bind(this)}
            onConfirm={this.confirmParcel.bind(this)}
            ></ConfirmModal>
        }
        {isShowDelay &&
          <ConfirmModal
            isFixed={showFixed}
            tips="确认延长收货？"
            subTips="确认后收货时间将延长至15天，每笔订单只可延长一次哦"
            confirmBtnText="确认延长"
            onCancel={this.closeDelayModal.bind(this)}
            onConfirm={this.delayParcel.bind(this)}
            ></ConfirmModal>
        }
        {isShowCancel &&
          <ConfirmModal
            isFixed={showFixed}
            tips="确认取消订单？"
            subTips="是否放弃支付该笔订单"
            confirmBtnText="放弃支付"
            cencelBtnText="考虑一下"
            onCancel={this.closeCancelModal.bind(this)}
            onConfirm={this.cancelOrder.bind(this)}
            ></ConfirmModal>
        }
      </div>
    ) : <div></div>
  }
}

export default template({
  id: 'order',
  component: Order,
  url: ''
})
