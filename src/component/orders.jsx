import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import moment from 'moment'
import _ from 'lodash'
import classNames from 'classnames'
import ReactPullLoad, { STATS } from 'react-pullload'

import { ORDER_STATUS, getPlatform } from '../config/constant'
import { Tool } from '../config/Tool'

import template from './common/template'
import ConfirmModal from './common/confirmModal'

class Orders extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hasMore: true,
      action: STATS.init,
      isShowCancel: false,
      isShowDelete: false,
      opOrder: null
    }
  }

  componentWillMount() {
    const { query } = this.props.location
    const { order } = this.props
    this.props.getOrderList({ pageNo: 1, orderStatus: query.status ? query.status : '' })
    .then(json => {
      if (json && json.success) {
        this.setState({ hasMore: json.pageCount > json.page })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    const { query } = this.props.location
    const nextStatus = nextProps.location.query.status
    if (nextStatus !== query.status) {
      window.scrollTo(0, 0)
      this.setState({ action: STATS.refreshing })
      this.props.getOrderList({ orderStatus: nextStatus ? nextStatus : '', pageNo: 1 })
      .then(json => {
        if (json && json.success) {
          this.setState({
            hasMore: json.pageCount > json.page,
            action: STATS.refreshed
          })
        } else {
          this.setState({
            hasMore: true,
            action: STATS.reset
          })
        }
      })
    }
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  goToPay(order, e) {
    e.preventDefault()
    e.stopPropagation()
    const now = moment()
    const exprieTime = moment(order.exprieTime)
    if (now.unix() >= exprieTime.unix()) {
      Tool.alert('抱歉，该订单已超过有效支付期')
    } else {
      hashHistory.push(`pay?id=${order.orderId}&from=order&mode=immediately&flag=single`)
    }
  }

  goToProduct(id, e) {
    e.preventDefault()
    e.stopPropagation()
    hashHistory.push(`/product/${id}`)
  }

  goToDetail(id, e) {
    e.preventDefault()
    hashHistory.push(`order/${id}`)
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
    const { action } = this.state
    const { list, status } = this.props.order
    if (STATS.refreshing === action) return false
    this.props.getOrderList({ orderStatus: status, pageNo: 1 })
    .then(json => {
      if (json && json.success) {
        this.setState({
          hasMore: json.pageCount > json.page,
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
    const { action, hasMore } = this.state
    const { list, status, page } = this.props.order
    if (STATS.loading === action) return false
    if (hasMore) {
      this.props.getOrderList({ orderStatus: status, pageNo: page + 1 })
      .then(json => {
        if (json && json.success) {
          this.setState({
            hasMore: json.pageCount > json.page,
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
      this.setState({ action: STATS.reset })
    }
  }

  showCancelModal(order, e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      opOrder: order,
      isShowCancel: true
    })
  }

  closeCancelModal() {
    this.setState({ isShowCancel: false })
  }

  showDeleteModal(order, e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      opOrder: order,
      isShowDelete: true
    })
  }

  closeDeleteModal() {
    this.setState({ isShowDelete: false })
  }

  cancelOrder() {
    const { status } = this.props.order
    const { opOrder } = this.state
    this.setState({ isShowCancel: false })
    this.props.cancelOrder(opOrder.orderId)
    .then(() => {
      this.props.getOrderList({ orderStatus: status, pageNo: 1 })
    })
  }

  deleteOrder() {
    const { status } = this.props.order
    const { opOrder } = this.state
    this.setState({ isShowDelete: false })
    this.props.deleteOrder(opOrder.orderId)
    .then(() => {
      this.props.getOrderList({ orderStatus: status, pageNo: 1 })
    })
  }

  changeStatus(status, e) {
    e.preventDefault()
    const { order } = this.props
    if (status !== order.status) {
      hashHistory.replace(`orders?status=${status}`)
      // window.scrollTo(0, 0)
      // this.setState({ action: STATS.refreshing })
      // this.props.getOrderList({ orderStatus: status, pageNo: 1 })
      // .then(json => {
      //   if (json && json.success) {
      //     this.setState({
      //       hasMore: json.pageCount > json.page,
      //       action: STATS.refreshed
      //     })
      //   } else {
      //     this.setState({
      //       hasMore: true,
      //       action: STATS.reset
      //     })
      //   }
      // })
    }
  }

  render() {
    const that = this
    const { showFixed } = this.props.global
    const { status, list } = this.props.order
    const { action, hasMore, isShowCancel, isShowDelete } = this.state

    return (
      <div className="orders-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">我的订单</p>
        </div>
        <div
          data-flex="dir:left cross:center box:mean"
          className={classNames('order-category', { 'be-fixed': showFixed })}>
          <div
            className={classNames('item', { selected: status === '' })}
            onClick={this.changeStatus.bind(this, '')}
            >全部</div>
          <div
            className={classNames('item', { selected: status === '10' })}
            onClick={this.changeStatus.bind(this, '10')}
            >待支付</div>
          <div
            className={classNames('item', { selected: status === '20' })}
            onClick={this.changeStatus.bind(this, '20')}
            >待配货</div>
          <div
            className={classNames('item', { selected: status === '30' })}
            onClick={this.changeStatus.bind(this, '30')}
            >待发货</div>
          <div
            className={classNames('item', { selected: status === '40' })}
            onClick={this.changeStatus.bind(this, '40')}
            >待收货</div>
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
                {list.map(item => {
                  return (
                    <div key={item.orderId} className="order-box">
                      {(item.orderStatus == '60' || item.orderStatus == '90') &&
                        <div className="del-btn" onClick={this.showDeleteModal.bind(this, item)}>
                          <i className="icon trash"></i>删除
                        </div>
                      }
                      <p className="title">{item.storeName}发货</p>
                      {item.parcelList.length > 0 &&
                        <div className="product-list" onClick={this.goToDetail.bind(this, item.orderId)}>
                          {item.parcelList.map((parcel, index) => {
                            return parcel.orderDetailList.length > 0 ? (
                              <div key={index} className="item">
                                <div className="pic">
                                  <img src={parcel.orderDetailList[0].picture} />
                                </div>
                                <div className="info">
                                  <div className="package">包裹{index + 1}</div>
                                  <div className="status">{ORDER_STATUS[parcel.status]}</div>
                                </div>
                                <div className="right">
                                  <p className="name">
                                    {parcel.orderDetailList[0].activityType === 'TIME_LIMITATION' &&
                                      <span className="spec">【限时购】</span>
                                    }
                                    {parcel.orderDetailList[0].activityType === 'NEW_USER_LIMITATION' &&
                                      <span className="spec">【新人专享】</span>
                                    }
                                    {parcel.orderDetailList[0].productName}
                                  </p>
                                  <p className="count">共{parcel.orderDetailList.length}种商品</p>
                                </div>
                              </div>
                            ) : (
                              <div key={index}></div>
                            )
                          })}
                          {item.orderStatus == '10' &&
                            <div className="action-inner">
                              <button className="btn pay" onClick={this.goToPay.bind(this, item)}>立即支付</button>
                              <button className="btn" onClick={this.showCancelModal.bind(this, item)}>取消订单</button>
                              <p className="fee">实付：¥{item.payAmount}</p>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  )
                })}
            </ReactPullLoad>
          ) : (
            <div className="empty-box">
              <div className="pic"></div>
              <p className="text">还没有相关订单</p>
            </div>
          )
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
        {isShowDelete &&
          <ConfirmModal
            isFixed={showFixed}
            tips="确认删除该订单？"
            subTips="删除后您将无法查看该笔订单信息"
            confirmBtnText="删除"
            onCancel={this.closeDeleteModal.bind(this)}
            onConfirm={this.deleteOrder.bind(this)}
            ></ConfirmModal>
        }
      </div>
    )
  }
}

export default template({
  id: 'orders',
  component: Orders,
  url: ''
})
