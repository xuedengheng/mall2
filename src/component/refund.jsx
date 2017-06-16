import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import _ from 'lodash'
import classNames from 'classnames'

import template from './common/template'
import ConfirmModal from './common/confirmModal'

import { REFUND_TYPE, EXPRESS_TYPE, RECEIVE_FLAG } from '../config/constant'
import { Tool } from '../config/Tool'

class Refund extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isShowConfirm: false
    }
  }

  componentWillMount() {
    const { query } = this.props.location
    this.props.getRefundDetailSuccess(null)
    if (query.requestid) {
      this.props.getRefundDetail(query.requestid)
    } else if (query.orderid && query.skuid) {
      this.props.getRefundDetailBySku({ orderId: query.orderid, skuId: query.skuid })
    }
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  goToTrace(id, e) {
    e.preventDefault()
    hashHistory.push(`/refund/trace/${id}`)
  }

  goToSalesReturn(id, e) {
    e.preventDefault()
    hashHistory.push(`/refund/salesreturn/${id}`)
  }

  goToModifyRefund(id, e) {
    e.preventDefault()
    hashHistory.push(`/refund/update/${id}`)
  }

  goToExpress(detail, e) {
    if (detail.snapshot.express == 'JD') {
      hashHistory.push(`express/${detail.jdOrderId}`)
    } else {
      const type = EXPRESS_TYPE[detail.snapshot.express] ? EXPRESS_TYPE[detail.snapshot.express].searchCode : ''
      const postId = detail.snapshot.expressFormId || ''
      const url = encodeURIComponent(window.location.href)
      window.location.href = `https://m.kuaidi100.com/index_all.html?type=${type}&postid=${postId}&callbackurl=${url}`
    }
  }

  showConfirmModal() {
    this.setState({ isShowConfirm: true })
  }

  closeConfirmModal() {
    this.setState({ isShowConfirm: false })
  }

  confirmJDReturn() {
    const { detail } = this.props.refund
    const { query } = this.props.location

    this.setState({ isShowConfirm: false })
    this.props.changeLoadingState(true)
    this.props.confirmJDReturn(detail.requestId)
    .then(json => {
      this.props.changeLoadingState(false)
      if (query.requestid) {
        this.props.getRefundDetail(query.requestid)
      } else if (query.orderid && query.skuid) {
        this.props.getRefundDetailBySku({ orderId: query.orderid, skuId: query.skuid })
      }
    })
    .catch(error => {
      this.props.changeLoadingState(false)
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }

  render() {
    const { showFixed } = this.props.global
    const { detail } = this.props.refund
    const { isShowConfirm } = this.state

    const store = 'JD'

    const status = 'PENDING_RETURN'

    return (
      <div className="refund-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">退款详细</p>
        </div>
        { detail &&
          <div className="recently-msg-box">
            <div data-flex="dir:left cross:center box:first" className="msg-title-inner">
              <div className="system"></div>
              <p className="title">{detail.shortcut.title}</p>
            </div>
            <p className="msg-content" dangerouslySetInnerHTML={{ __html: detail.shortcut.content }}></p>
            { detail.status === 'IN_PROGRESSING' &&
              <button type="button" className="msg-btn" onClick={this.goToModifyRefund.bind(this, detail.requestId)}>修改退款申请</button>
            }
            { detail.status === 'PENDING_RETURN' && detail.platform !== 'JD' &&
              <button type="button" className="msg-btn" onClick={this.goToSalesReturn.bind(this, detail.requestId)}>填写退货信息</button>
            }
            { detail.status === 'PENDING_RETURN' && detail.platform === 'JD' &&
              <button type="button" className="msg-btn" onClick={this.showConfirmModal.bind(this, detail.requestId)}>京东已取件</button>
            }
            { detail.status === 'USER_RETURNED' && detail.platform !== 'JD' &&
              <button type="button" className="msg-btn" onClick={this.goToExpress.bind(this, detail)}>查看物流</button>
            }
          </div>
        }
        { detail &&
          <div className="trace-box">
            <div
              data-flex="dir:left cross:center box:last"
              className="title-inner"
              onClick={this.goToTrace.bind(this, detail.requestId)}>
              <p className="name">退款追踪</p>
              <div className="icon go"></div>
            </div>
            <div className="content-inner">
              <p className="left">退款类型</p>
              <p className="right">{REFUND_TYPE[detail.requestRefundType]}</p>
            </div>
            { detail.requestRefundType === 'RETURN_AND_REFUND' &&
            <div className="content-inner">
              <p className="left">收货状态</p>
              <p className="right">{RECEIVE_FLAG[detail.receievedFlag]}</p>
            </div>
            }
            <div className="content-inner">
              <p className="left">退款数量</p>
              <p className="right">{detail.refundNumber}</p>
            </div>
            <div className="content-inner">
              <p className="left">退款金额</p>
              <p className="right">{detail.refundAmount.toFixed(2)}元</p>
            </div>
            <div className="content-inner">
              <p className="left">退款理由</p>
              <p className="right">{detail.remark}</p>
            </div>
            <div className="content-inner">
              <p className="left">退款编号</p>
              <p className="right">{detail.requestId}</p>
            </div>
            <div className="content-inner">
              <p className="left">申请时间</p>
              <p className="right">{detail.createDate}</p>
            </div>
            {detail.platform === 'JD' &&
              <div className="content-inner">
                <p className="left">收件人</p>
                <p className="right">{detail.pickupAddress.contactor}</p>
              </div>
            }
            {detail.platform === 'JD' &&
              <div className="content-inner">
                <p className="left">手机号码</p>
                <p className="right">{detail.pickupAddress.mobile}</p>
              </div>
            }
            {detail.platform === 'JD' &&
              <div className="content-inner">
                <p className="left">取件地址</p>
                <p className="right">{detail.pickupAddress.provinceName + detail.pickupAddress.cityName + detail.pickupAddress.countryName + detail.pickupAddress.villageName + detail.pickupAddress.address}</p>
              </div>
            }
          </div>
        }
        {isShowConfirm &&
          <ConfirmModal
            isFixed={showFixed}
            tips="确认已取件？"
            subTips="请确认京东人员已收取您的退款货物"
            onCancel={this.closeConfirmModal.bind(this)}
            onConfirm={this.confirmJDReturn.bind(this)}
            ></ConfirmModal>
        }
      </div>
    )
  }
}

export default template({
  id: 'refund',
  component: Refund,
  url: ''
})
