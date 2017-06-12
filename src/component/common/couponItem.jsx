import React, { Component } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { hashHistory } from 'react-router'
import Swipeable from 'react-swipeable'

export default class CouponItem extends Component {

  constructor(props) {
    super(props)
    this.state = {
      openIntro: false,
      showDel: false
    }
  }

  goToLnk(e) {
    e.preventDefault()
    e.stopPropagation()
    const { coupon } = this.props
    if (coupon.linkRef) {
      window.location.href = coupon.linkRef
    } else {
      hashHistory.push('/')
    }
  }

  changeIntro(bool, e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ openIntro: bool })
  }

  swipedLeft(e, x, y, isFlick, velocity) {
    const { mode, coupon } = this.props
    if (mode === 'edit' && (coupon.status === 'EXPIRED' || coupon.status === 'USED')) {
      this.setState({ showDel: true })
    }
  }

  swipedRight(e, x, y, isFlick, velocity) {
    const { mode, coupon } = this.props
    if (mode === 'edit') {
      this.setState({ showDel: false })
    }
  }

  delCoupon(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onDel()
  }

  selectCoupon(e) {
    e.preventDefault()
    e.stopPropagation()
    const { mode } = this.props
    if (mode === 'select') {
      this.props.onSelect()
    }
  }

  renderDivider() {
    const { disabled, mode, coupon } = this.props

    if (disabled === true || (mode === 'edit' && coupon.status === 'EXPIRED') || (mode === 'select' && coupon.available === 'N')) {
      return (
        <div className="divider">
          <img src={require('../../images/youhuiquan_grey.png')} />
        </div>
      )
    } else if (coupon.type === 'DD') {
      return (
        <div className="divider">
          <img src={require('../../images/youhuiquan_yellow.png')} />
        </div>
      )
    } else {
      return (
        <div className="divider">
          <img src={require('../../images/youhuiquan_red.png')} />
        </div>
      )
    }
  }

  render() {
    const { disabled, mode, coupon, selectedCoupon } = this.props
    const { openIntro, showDel } = this.state
    const adoptedDate = moment(coupon.adoptedDate).format('YYYY-MM-DD')
    const expiredDate = moment(coupon.expiredDate).format('YYYY-MM-DD')

    return (
      <Swipeable
        onSwipedLeft={this.swipedLeft.bind(this)}
        onSwipedRight={this.swipedRight.bind(this)}
        >
        <div
          className={classNames('coupon-item', {
            gray: disabled === true || (mode === 'edit' && coupon.status === 'EXPIRED') || (mode === 'select' && coupon.available === 'N'),
            yellow: coupon.type === 'DD'
          })}
          style={{ transform: showDel ? 'translateX(-1.78rem)' : 'translateX(0)' }}
          onClick={this.selectCoupon.bind(this)}
          >
          <div data-flex="dir:left cross:center box:last" className="info">
            <div className="info-inner">
              <p className="name">{coupon.name}</p>
              <p className="time">有效期：{adoptedDate} 至 {expiredDate}</p>
            </div>
            {mode === 'edit' && coupon.status === 'ADOPTED' &&
              <div className="lnk" onClick={this.goToLnk.bind(this)}>立即使用</div>
            }
            {mode === 'select' && selectedCoupon && coupon.id === selectedCoupon.id &&
              <div className="selected"></div>
            }
          </div>
          {this.renderDivider()}
          <div data-flex="dir:left box:last" className="intro">
            <p className="intro-text" className={classNames('intro-text', { unfold: openIntro })}>{coupon.description}</p>
            {!openIntro &&
              <div className="open" onClick={this.changeIntro.bind(this, true)}></div>
            }
            {openIntro &&
              <div className="close" onClick={this.changeIntro.bind(this, false)}></div>
            }
          </div>
          {mode === 'edit' && (coupon.status === 'USED' || coupon.status === 'EXPIRED') &&
            <div className="del-box" onClick={this.delCoupon.bind(this)}>
              <div className="del-icon"></div>
            </div>
          }
        </div>
      </Swipeable>
    )
  }
}
