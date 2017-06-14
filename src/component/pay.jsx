import React, { Component } from 'react'
import { hashHistory, Lifecycle } from 'react-router'
import classNames from 'classnames'
import reactMixin from 'react-mixin'
import moment from 'moment'

import { isWx } from '../utils/ua'

import { Tool } from '../config/Tool'
import { PAY_WAY } from '../config/constant'

import template from './common/template'
import SkuModal from './common/skuModal'
import ConfirmModal from './common/confirmModal'

@reactMixin.decorate(Lifecycle)
class Pay extends Component {

  constructor(props) {
    super(props)
    this.state = {
      amount: '',
      isPaid: false,
      isShowSku: false,
      likeProductId: '',
      payWay: '',
      mode: 'pay',
      confirm: false,
      abandon: false,
      result: 'fail',
      resultObj: null
    }
    this.routerWillLeave = this.routerWillLeave.bind(this)
  }

  routerWillLeave(nextLocation) {
    const { isPaid } = this.state
    console.log(nextLocation)
    if (!isPaid) {
      this.setState({ abandon: true })
      return false
    }
  }

  componentWillMount() {
    const { query } = this.props.location
    if (query.callback == 1) {
      this.setState({
        amount: query.amount,
        isPaid: true,
        confirm: true
      })
    } else if (query.mode && query.mode === 'submit') {
      this.setState({ amount: query.amount })
    } else if (query.mode && query.mode === 'immediately') {
      this.props.getOrderDetail(query.id)
    }
    this.props.getPayToken()
    this.props.getSearchList(false, {})
  }

  goToOrder(e) {
    e.preventDefault()
    const { query } = this.props.location
    if (query.mode && query.mode === 'submit') {
      hashHistory.replace(`orders`)
    } else if (query.mode && query.mode === 'immediately') {
      hashHistory.replace(`order/${query.id}`)
    }
  }

  goToIndex(e) {
    e.preventDefault()
    hashHistory.replace('/')
  }

  goToProduct(productId, e) {
    e.preventDefault()
    hashHistory.replace(`product/${productId}`)
  }

  showSkuModal(productId, e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.changeShowSkuModal(true)
    this.setState({
      isShowSku: true,
      likeProductId: productId
    })
  }

  closeSkuModal() {
    this.props.changeShowSkuModal(false)
    this.setState({ isShowSku: false })
  }

  changePayWay(way, e) {
    e.preventDefault()
    const { payWay } = this.state
    if (payWay === way) {
      this.setState({ payWay: '' })
    } else {
      this.setState({ payWay: way })
    }
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  checkResult() {
    const { id } = this.props.params
    const { detail } = this.props.order
    const { query } = this.props.location
    let orderJnId = ''
    if ( (query.callback && query.callback == 1) || (query.mode && query.mode === 'submit') ) {
      orderJnId = query.orderjnid
    } else if (query.mode && query.mode === 'immediately') {
      orderJnId = detail.orderJnId
    }
    this.props.checkPayResult(orderJnId)
    .then(json => {
      if (json && json.success) {
        this.setState({ resultObj: json.result })
        if (json.result.payStatus == '60') {
          this.setState({ mode: 'result', confirm: false, result: 'success' })
        } else {
          this.setState({ mode: 'result', confirm: false, result: 'fail' })
        }
      }
    })
  }

  abandonPay() {
    const { query } = this.props.location
    this.setState({
      abandon: false,
      isPaid: true
    })
    setTimeout(() => {
      if (query.from && query.from === 'order') {
        hashHistory.goBack()
      } else if (query.mode) {
        if (query.mode === 'submit') {
          hashHistory.replace('/orders?from=pay')
        } else {
          hashHistory.replace(`/order/${query.id}?from=pay`)
        }
      }
    }, 300)
  }

  closeAbandonModal() {
    this.setState({
      abandon: false
    })
  }

  toPay(e) {
    e && e.preventDefault()
    const that = this
    const { query } = this.props.location
    const { detail } = this.props.order
    const { token } = this.props.payment
    const { payWay, amount } = this.state
    let orderJnId = ''
    let orderDetail = ''
    if (query.mode && query.mode === 'submit') {
      orderJnId = query.orderjnid
      orderDetail = query.orderdetail
    } else if (query.mode && query.mode === 'immediately') {
      orderJnId = detail.orderJnId
      orderDetail = JSON.stringify([{ orderId: detail.orderId }])
    }
    const chooseParams = {
      tradeType: 'APP',
      orderJnId: orderJnId,
      orderDetail: orderDetail,
      payWay: payWay
    }
    const params = {
      unionPayFlag: query.flag ? query.flag : 'union',
      tradeType: 'JSAPI',
      token
    }
    if ((!amount && !detail) || !payWay) return false
    this.props.changeLoadingState(true)
    this.props.choosePayWay(chooseParams)
    .then(json => {
      console.log(json)
      const result = json.result
      const newParams = {
        ...params,
        orderDetail: result.orderDetail,
        orderJnId: result.orderJnId,
        orderDate: result.orderDate,
        orderTime: result.orderTime
      }
      this.props.payOrder(result.payWay, newParams, query.mode, query.id)
      .then(json => {
        this.props.changeLoadingState(false)
        if (!json.result.payInfo) {
          Tool.alert('缺少支付参数')
          return false
        }
        this.setState({ isPaid: true })
        switch (payWay) {
          case 'WEIXIN':
            const { appid, timestamp, noncestr, sign, prepayid } = json.result.payInfo
            const wxPay = () => {
              WeixinJSBridge.invoke('getBrandWCPayRequest', {
                "appId": appid,
                "timeStamp": timestamp,
                "nonceStr": noncestr,
                "package": `prepay_id=${prepayid}`,
                "signType": "MD5",
                "paySign": sign
              },
              function(res) {
                if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                  that.setState({ confirm: true })
                }
              })
            }
            if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
              wxPay()
            } else {
              if (document.addEventListener) {
                document.addEventListener("WeixinJSBridgeReady", wxPay, false)
              } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", wxPay)
                document.attachEvent("onWeixinJSBridgeReady", wxPay)
              }
            }
            break
          case 'ALIPAY':
          case 'FEIMA':
            if (query.mode && query.mode === 'submit') {
              hashHistory.replace(`pay?callback=1&mode=submit&orderjnid=${result.orderJnId}&amount=${amount}`)
            } else if (query.mode && query.mode === 'immediately') {
              hashHistory.replace(`pay?callback=1&id=${query.id}&mode=immediately&orderjnid=${result.orderJnId}`)
            }
            setTimeout(() => {
              window.location.href = json.result.payInfo.payUrl
            }, 0)
            break
          default:
            break
        }
        this.setState({ confirm: true })
      })
      .catch(error => {
        this.props.changeLoadingState(false)
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    })
    .catch(error => {
      this.props.changeLoadingState(false)
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }

  showPayWrap() {
    const { query } = this.props.location
    const { showFixed } = this.props.global
    const { detail } = this.props.order
    const { payWay, confirm, abandon, amount } = this.state
    return (
      <div className="pay-wrap no-bottom">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">选择支付方式</p>
        </div>
        <div className="total-fee">
          <p className="key">订单金额</p>
          <p className="value">¥ {query.mode === 'submit' ? amount : detail ? detail.payAmount : ''}</p>
        </div>
        <div className="pay-list">
          {isWx() &&
            <div className="item" onClick={this.changePayWay.bind(this, 'WEIXIN')}>
              <div className={classNames('check', { checked: payWay === 'WEIXIN' })}></div>
              <div className="right">
                <div className="wpay"></div>
                <div className="info">
                  <p className="title">微信支付</p>
                  <p className="desc">需安装微信客户端</p>
                </div>
              </div>
            </div>
          }
          <div className="item" onClick={this.changePayWay.bind(this, 'FEIMA')}>
            <div className={classNames('check', { checked: payWay === 'FEIMA' })}></div>
            <div className="right">
              <div className="feima"></div>
              <div className="info">
                <p className="title">飞马钱包</p>
                <p className="desc">需安装飞马钱包客户端</p>
              </div>
            </div>
          </div>
        </div>
        <button className={classNames('pay-btn', { 'pay-btn-disabled': (!amount && !detail) || !payWay })} onClick={this.toPay.bind(this)}>立即支付</button>
        {confirm &&
          <ConfirmModal
            isFixed={showFixed}
            tips="请问是否确认您已完成支付？"
            onConfirm={this.checkResult.bind(this)}
            ></ConfirmModal>
        }
        {abandon &&
          <ConfirmModal
            isFixed={showFixed}
            tips="您确定放弃支付吗？"
            confirmBtnText="放弃支付"
            cencelBtnText="考虑一下"
            onCancel={this.closeAbandonModal.bind(this)}
            onConfirm={this.abandonPay.bind(this)}
            ></ConfirmModal>
        }
      </div>
    )
  }

  showResultWrap() {
    const { showFixed, showSkuModal } = this.props.global
    const { detail } = this.props.order
    const { list } = this.props.searchList
    const { isShowSku, result, resultObj } = this.state

    const style = showSkuModal ? {
      height: '100%',
      overflow: 'hidden'
    } : {}

    return (
      <div className="pay-wrap no-bottom" style={style}>
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <p className="page-title">支付结果</p>
        </div>
        <div className="order-status">
          <div style={{ height: '0.4rem' }}></div>
          <div className={classNames('icon', { success: result === 'success', fail: result === 'fail' })}></div>
          <p className="text">{result === 'success' ? '支付成功' : '支付失败'}</p>
          {result === 'success' &&
            <p className="tips">恭喜你，该订单已成功支付</p>
          }
        </div>
        <div className="order-info">
          <div className="text-inner">
            <p className="left">支付金额</p>
            <p className="right">{resultObj ? `¥${resultObj.payAmount}` : ''}</p>
          </div>
          <div className="text-inner">
            <p className="left">交易单号</p>
            <p className="right">{resultObj ? resultObj.orderId : ''}</p>
          </div>
          {result === 'success' &&
            <div className="text-inner">
              <p className="left">支付时间</p>
              <p className="right">{resultObj ? moment(resultObj.payDateTime, 'YYYYMMDD HHmmss').format('YYYY-MM-DD HH:mm:ss') : ''}</p>
            </div>
          }
          <div className="text-inner">
            <p className="left">支付方式</p>
            <p className="right">{resultObj ? PAY_WAY[resultObj.payWay] : ''}</p>
          </div>
          {result === 'success' &&
            <div className="text-inner">
              <p className="left">流水单号</p>
              <p className="right">{resultObj ? resultObj.payNo : ''}</p>
            </div>
          }
        </div>
        <div className="order-action">
          <button className="btn order" onClick={this.goToOrder.bind(this)}>查看订单</button>
          <button className="btn" onClick={this.goToIndex.bind(this)}>返回首页</button>
        </div>
        <div data-flex="main:center cross:center" className="guess-title">
          <div className="decoration"></div>
          <p className="text">猜你还喜欢</p>
          <div className="decoration"></div>
        </div>
        <div className="product-box">
          {list.length > 0 && list.map((item, index) => {
            return (
              <div key={index} className="product" onClick={this.goToProduct.bind(this, item.productId)}>
                {item.activityType && item.activityType === 'NEW_USER_LIMITATION' &&
                  <div className="new-user-icon">新人专享</div>
                }
                {item.activityType && item.activityType === 'TIME_LIMITATION' &&
                  <div className="time-limit-icon"></div>
                }
                <div className="pic">
                  <img src={item.picture} />
                </div>
                <p className="title">{item.name}</p>
                <p className="price">¥ {item.price.toFixed(2)}</p>
                <div className="icon cart" onClick={this.showSkuModal.bind(this, item.productId)}></div>
              </div>
            )
          })}
        </div>
        {isShowSku &&
          <SkuModal
            onClose={this.closeSkuModal.bind(this)}
            {...this.props}
            productId={this.state.likeProductId}
            productFrom="list"></SkuModal>
        }
      </div>
    )
  }

  render() {
    const { mode } = this.state
    return mode === 'pay' ? this.showPayWrap() : this.showResultWrap()
  }
}

export default template({
  id: 'pay',
  component: Pay,
  url: ''
})
