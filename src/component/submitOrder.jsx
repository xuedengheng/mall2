import React, { Component } from 'react'
import { hashHistory, Lifecycle } from 'react-router'
import moment from 'moment'
import _ from 'lodash'
import classNames from 'classnames'
import reactMixin from 'react-mixin'

import { getPlatform } from '../config/constant'
import { Tool } from '../config/Tool'

import InvalidModal from './common/invalidModal'
import template from './common/template'
import CouponItem from './common/couponItem'

@reactMixin.decorate(Lifecycle)
class SubmitOrder extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isShowInvalid: false,
      invalidCartDetailIds: [],
      invalidCartDetails: [],
      remarks: [],
      selectedPromo: [],
      selectedCoupon: null,
      disuse: [],
      isShowPromo: false,
      isShowCoupon: false,
      activity: null
    }
    this.routerWillLeave = this.routerWillLeave.bind(this)
  }

  routerWillLeave(nextLocation) {
    const { isShowCoupon } = this.state
    if (isShowCoupon) {
      this.setState({ isShowCoupon: false })
      return false
    }
  }

  componentWillMount() {
    const { selectedCarts } = this.props.cart
    this.getActivity()
    this.props.addressList([])
    this.props.addressListRequest()
    if (selectedCarts.length > 0) {
      this.setState({ remarks: _.fill(Array(selectedCarts.length), '') })
      this.props.getPromotionList(this.createOrderSkuDTOs())
      .then(json => {
        this.props.getPromotionListSuccess(json.result)
        this.getFinalFee([])
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedAddressId } = nextProps.cart
    const { addressList } = nextProps.address
    if (!selectedAddressId && addressList.length > 0) {
      this.props.getCartAddressId(addressList.filter(address => address.defaultFlag == 'Y')[0].addressId)
    }
  }

  createOrderSkuDTOs(carts) {
    const { selectedCarts } = this.props.cart
    const cacheCarts = carts ? carts : selectedCarts
    return cacheCarts.map((cart) => {
      return {
        storeId: cart.storeId,
        skuPrices: cart.cartDetails.map((detail) => {
          return {
            price: Number(detail.price),
            quantity: Number(detail.quantity),
            skuId: detail.skuId
          }
        })
      }
    })
  }

  createOrderAmounts() {
    const { selectedCarts } = this.props.cart
    return selectedCarts.map((cart) => {
      return {
        platform: cart.storeId,
        amount: cart.cartDetails.reduce((detailAcc, detail) => {
          return detailAcc + Number(detail.price) * Number(detail.quantity)
        }, 0)
      }
    })
  }

  createSubmitOrderDTO() {
    const { selectedCarts, selectedAddressId } = this.props.cart
    const { list } = this.props.promotion
    const { remarks, selectedCoupon, activity, disuse } = this.state
    let dto = {
      addressId: selectedAddressId,
      promotionDTOs: (() => {
        if (selectedCoupon) {
          const couponPromo = _.find(list, promo => promo.type === 'COUPON')
          const usedCoupon = {
            ...couponPromo,
            coupons: couponPromo.coupons.filter(coupon => selectedCoupon.id === coupon.id)
          }
          return list.filter(promo => promo.type !== 'COUPON').filter(promo => disuse.indexOf(promo.type) < 0).concat([usedCoupon])
        } else {
          return list.filter(promo => promo.type !== 'COUPON').filter(promo => disuse.indexOf(promo.type) < 0)
        }
      })(),
      orderInfo: selectedCarts.map((cart, index) => {
        return {
          cartId: cart.cartId,
          remark: remarks[index],
          cartDetailId: cart.cartDetails.map(detail => detail.cartDetailId)
        }
      })
    }
    return activity ? {
      ...dto,
      activityId: activity.activityId,
      activityType: activity.activityType
    } : dto
  }

  createSubmitImediatelyOrderDTO() {
    const { selectedCarts, selectedAddressId } = this.props.cart
    const { list } = this.props.promotion
    const { remarks, selectedCoupon, activity, disuse } = this.state
    let dto = {
      addressId: selectedAddressId,
      promotionDTOs: (() => {
        if (selectedCoupon) {
          const couponPromo = _.find(list, promo => promo.type === 'COUPON')
          const usedCoupon = {
            ...couponPromo,
            coupons: couponPromo.coupons.filter(coupon => selectedCoupon.id === coupon.id)
          }
          return list.filter(promo => promo.type !== 'COUPON').filter(promo => disuse.indexOf(promo.type) < 0).concat([usedCoupon])
        } else {
          return list.filter(promo => promo.type !== 'COUPON').filter(promo => disuse.indexOf(promo.type) < 0)
        }
      })(),
      quantity: selectedCarts[0].cartDetails[0].quantity,
      remark: remarks[0],
      price: Number(selectedCarts[0].cartDetails[0].price),
      skuId: selectedCarts[0].cartDetails[0].skuId,
      storeId: selectedCarts[0].storeId
    }
    return activity ? {
      ...dto,
      activityId: activity.activityId,
      activityType: activity.activityType
    } : dto
  }

  getFinalFee(disuse) {
    const { list } = this.props.promotion
    const { selectedCoupon } = this.state
    const usedPromo = list.filter(promo => disuse.indexOf(promo.type) < 0)
    const filtedPromo = (() => {
      if (selectedCoupon) {
        const couponPromo = _.find(list, promo => promo.type === 'COUPON')
        const usedCoupon = {
          ...couponPromo,
          coupons: couponPromo.coupons.filter(coupon => selectedCoupon.id === coupon.id)
        }
        return usedPromo.filter(promo => promo.type !== 'COUPON').concat([usedCoupon])
      } else {
        return usedPromo.filter(promo => promo.type !== 'COUPON')
      }
    })()
    this.props.getFinalFee({ orderSkuDTOs: this.createOrderSkuDTOs(), promotionDTOs: filtedPromo })
  }

  goToAddress(e) {
    e.preventDefault()
    hashHistory.push('address')
  }

  goToSelectAddress(e) {
    e.preventDefault()
    hashHistory.push('address/select')
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  goToProduct(id, e) {
    e.preventDefault()
    hashHistory.push(`product/${id}`)
  }

  goToRule(e) {
    e.preventDefault()
    hashHistory.push(`lnk?u=${encodeURIComponent('http://cdn.9yiwu.com/H5/Rule/coupon_rule.html')}`)
  }

  showPromoModal(promo, e) {
    e.preventDefault()
    this.setState({
      selectedPromo: promo,
      isShowPromo: true
    })
  }

  closePromoModal() {
    this.setState({ isShowPromo: false })
  }

  addDisuse(type, e) {
    e.preventDefault()
    const { disuse } = this.state
    const newDisuse = _.union(disuse, [type])
    this.getFinalFee(newDisuse)
    this.setState({
      disuse: newDisuse,
      isShowPromo: false
    })
  }

  delDisuse(type, e) {
    e.preventDefault()
    const { disuse } = this.state
    const newDisuse = _.pull(disuse, type)
    this.getFinalFee(newDisuse)
    this.setState({
      disuse: newDisuse,
      isShowPromo: false
    })
  }

  showCouponModal(e) {
    e.preventDefault()
    this.setState({ isShowCoupon: true })
  }

  closeCouponModal(e) {
    e.preventDefault()
    this.setState({ isShowCoupon: false })
  }

  selectCoupon(coupon) {
    const { disuse, activity } = this.state
    if (!activity && coupon.available === 'Y') {
      this.setState({
        selectedCoupon: coupon,
        isShowCoupon: false
      })
      setTimeout(() => {
        this.getFinalFee(disuse)
      }, 0)
    }
  }

  unselectCoupon(e) {
    e.preventDefault()
    const { disuse } = this.state

    this.setState({
      selectedCoupon: null,
      isShowCoupon: false
    })
    setTimeout(() => {
      this.getFinalFee(disuse)
    }, 0)
  }

  submitOrder(e) {
    e.preventDefault()
    const { selectedAddressId, selectedCarts } = this.props.cart
    const { totalPayAmount } = this.props.promotion
    const { query } = this.props.location
    const mode = query.mode || 'normal'
    if (selectedAddressId === '') {
      Tool.alert('请选择收货地址')
    } else {
      if (mode === 'normal') {
        this.props.changeLoadingState(true)
        this.props.submitOrder(this.createSubmitOrderDTO())
        .then(json => {
          this.props.changeLoadingState(false)
          hashHistory.replace(`pay?orderdetail=${JSON.stringify(json.result.orderDetail)}&orderjnid=${json.result.orderJnId}&amount=${totalPayAmount}&mode=submit`)
        })
        .catch(error => {
          this.props.changeLoadingState(false)
          if (error.code) {
            if (error.code === 8012) {
              const invalidIds = error.json.result.notValidCartFroms[0].cartDetailId
              let invalidDetails = []
              for (let i = 0, iLen = selectedCarts.length; i < iLen; i++) {
                const cartDetails = selectedCarts[i].cartDetails
                for (let j = 0, jLen = cartDetails.length; j < jLen; j++) {
                  if (invalidIds.indexOf(cartDetails[j].cartDetailId) > -1) {
                    invalidDetails.push(cartDetails[j])
                  }
                }
              }
              this.setState({
                isShowInvalid: true,
                invalidCartDetailIds: invalidIds,
                invalidCartDetails: invalidDetails,
              })
            } else {
              Tool.alert(error.message)
            }
          }
          console.log(error)
        })
      } else {
        this.props.submitOrderImmediately(this.createSubmitImediatelyOrderDTO())
      }
    }
  }

  closeInvalidModal() {
    this.setState({ isShowInvalid: false })
  }

  removeInvalidDetails() {
    const { invalidCartDetailIds } = this.state
    const { selectedCarts } = this.props.cart
    let cacheCarts = selectedCarts.slice(0)
    for (let i = 0, len = cacheCarts.length; i < len; i++) {
      cacheCarts[i].cartDetails = cacheCarts[i].cartDetails.filter((detail) => {
        return invalidCartDetailIds.indexOf(detail.cartDetailId) < 0
      })
    }
    cacheCarts = cacheCarts.filter((cart) => {
      return cart.cartDetails.length > 0
    })
    if (cacheCarts.length > 0) {
      this.props.getSelectedCarts(cacheCarts)
      this.props.getPromotionList(this.createOrderSkuDTOs(cacheCarts))
      .then(json => {
        const filtedPromo = json.result
        this.props.getPromotionListSuccess(json.result)
        this.getFinalFee([])
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
      this.setState({
        isShowInvalid: false,
        disuse: []
      })
    } else {
      hashHistory.goBack()
    }
  }

  setRemark(index, e) {
    const { remarks } = this.state
    const val = e.target.value.trim()
    this.setState({
      remarks: [
        ...remarks.slice(0, index),
        val,
        ...remarks.slice(index + 1)
      ]
    })
  }

  getActivity() {
    const { selectedCarts } = this.props.cart

    for (let i = 0, len = selectedCarts.length; i < len; i++) {
      let cartDetails = selectedCarts[i].cartDetails
      for (let j = 0, jLen = cartDetails.length; j < jLen; j++) {
        if (cartDetails[j].activityType) {
          this.setState({
            activity: {
              activityType: cartDetails[j].activityType,
              activityId: cartDetails[j].activityId
            }
          })
          break
        }
      }
    }
  }

  render() {
    const { showFixed } = this.props.global
    const { addressList } = this.props.address
    const { selectedCarts, selectedAddressId } = this.props.cart
    const { query } = this.props.location
    const { list, orderSkuDTOs, promotionDiscountDTOs, totalAmount, totalFreight, totalPayAmount } = this.props.promotion
    const { activity, remarks, isShowPromo, selectedPromo, disuse, invalidCartDetails, isShowInvalid, isShowCoupon, selectedCoupon } = this.state
    const address = selectedAddressId ? addressList.filter((address) => {
      return selectedAddressId === address.addressId
    })[0] : null
    const productNum = selectedCarts.reduce((cartAcc, cart) => {
      return cartAcc + cart.cartDetails.reduce((detailAcc, detail) => {
        return detailAcc + Number(detail.quantity)
      }, 0)
    }, 0)
    const deductPromo = _.find(promotionDiscountDTOs, promo => promo.type === 'DEDUCTION')
    const newComerPromo = _.find(promotionDiscountDTOs, promo => promo.type === 'NEW_COMER')
    // 优惠券
    const couponPromo = _.find(list, promo => promo.type === 'COUPON')
    const usableCoupon = couponPromo && !activity ? couponPromo.coupons.filter(coupon => coupon.available === 'Y') : []
    const unusableCoupon = !couponPromo ? [] : activity ? couponPromo.coupons : couponPromo.coupons.filter(coupon => coupon.available === 'N')

    return isShowCoupon && couponPromo ? (
      <div className="coupons-wrap select-mode">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.closeCouponModal.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">选择优惠券</p>
          <div className="page-qaq" onClick={this.goToRule.bind(this)}></div>
        </div>
        {usableCoupon.length > 0 &&
          <div className="coupon-list">
            {usableCoupon.map((coupon, index) => {
              return <CouponItem
                      key={index}
                      mode="select"
                      coupon={coupon}
                      selectedCoupon={selectedCoupon}
                      onSelect={this.selectCoupon.bind(this, coupon)}></CouponItem>
            })}
          </div>
        }
        {unusableCoupon.length > 0 &&
          <div className="coupon-list unusable">
            <p className="unusable-tips" className={classNames('unusable-tips', { 'has-margin': usableCoupon.length === 0})}>以下优惠券不可用</p>
            {unusableCoupon.map((coupon, index) => {
              return <CouponItem
                      key={index}
                      disabled={true}
                      mode="select"
                      coupon={coupon}
                      onSelect={this.selectCoupon.bind(this, coupon)}></CouponItem>
            })}
          </div>
        }
        <div className="unuse-btn-box">
          <button className="unuse-btn" onClick={this.unselectCoupon.bind(this)}>不使用优惠</button>
        </div>
      </div>
    ) : (
      <div className="submit-order-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">提交订单</p>
        </div>
        {address ? (
          <div
            data-flex="dir:left cross:center box:last"
            className="post-box"
            onClick={this.goToSelectAddress.bind(this)}
            >
            <div className="info">
              <div className="name-inner">
                <p className="name">收货人：{address.name}</p>
                <p className="mobile">{address.mobile}</p>
              </div>
              <p className="text">收货地址：{`${address.province}${address.city}${address.town}${address.block}${address.street}${address.address}`}</p>
            </div>
            <div className="icon go"></div>
          </div>
        ) : (
          <div
            data-flex="dir:left cross:center box:last"
            className="post-box"
            onClick={this.goToAddress.bind(this)}
            >
            <div className="empty">
              <div className="pic"></div>
              <p className="tips">您还没有收货地址，去添加</p>
            </div>
            <div className="icon go"></div>
          </div>
        )
        }
        <div className="post-line"></div>
        <div className="fee-box">
          <div className="item">
            <p className="key">商品总计</p>
            <p className="value">¥{totalAmount}</p>
          </div>
          { _.find(list, promo => promo.type === 'DEDUCTION') &&
            <div
              data-flex="dir:left cross:center box:justify"
              className="item"
              onClick={this.showPromoModal.bind(this, _.find(list, promo => promo.type === 'DEDUCTION'))}>
              <p className="flex-key">活动优惠</p>
              <p className="flex-value">
                {deductPromo ? `-¥${deductPromo.totalDiscount}` : '未使用'}
              </p>
              <div className="icon go"></div>
            </div>
          }
          { _.find(list, promo => promo.type === 'NEW_COMER') &&
            <div
              data-flex="dir:left cross:center box:justify"
              className="item"
              onClick={this.showPromoModal.bind(this, _.find(list, promo => promo.type === 'NEW_COMER'))}>
              <p className="flex-key">新人活动</p>
              <p className="flex-value">
                {newComerPromo ? `-¥${newComerPromo.totalDiscount}` : '未使用'}
              </p>
              <div className="icon go"></div>
            </div>
          }
          { couponPromo &&
            <div
              data-flex="dir:left cross:center box:justify"
              className="item"
              onClick={this.showCouponModal.bind(this)}>
              <p className="flex-key">优惠券：{ selectedCoupon ? '已选择' : '未选择' }</p>
              <p className="flex-value">{ selectedCoupon ? selectedCoupon.name : `${couponPromo.coupons.length}张` }</p>
              <div className="icon go"></div>
            </div>
          }
          <div className="item">
            <p className="key">运费总计</p>
            <p className="value">¥{totalFreight}</p>
          </div>
        </div>
        {selectedCarts.length > 0 && selectedCarts.map((cart, index) => {
          const orderSkuDTO = _.find(orderSkuDTOs, dto => {
            return dto.storeId === cart.storeId
          })
          return (
            <div key={index} className="platform-box">
              <p className="title">{cart.storeName}发货</p>
              <div className="product-list">
                {cart.cartDetails.map((detail, index) => {
                  const skuPrice = orderSkuDTO ? _.find(orderSkuDTO.skuPrices, sku => {
                    return sku.skuId === detail.skuId
                  }) : null
                  return (
                    <div key={index} className="item">
                      <div className="num">x<span className="bold">{detail.quantity}</span></div>
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
                        <p className="attr">{detail.productAttr && `规格：${detail.productAttr}`}</p>
                        {skuPrice &&
                          <p className="price">¥{skuPrice.payPrice}
                            {skuPrice.payPrice != skuPrice.price &&
                              <span className="origin-price">¥{skuPrice.price}</span>
                            }
                          </p>
                        }
                        {!skuPrice &&
                          <p className="price">¥{detail.price}</p>
                        }
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="post-inner">
                <div className="item">
                  <p className="key">运费</p>
                  <p className="value">{orderSkuDTOs[index] && `¥${orderSkuDTOs[index].freight}`}</p>
                </div>
                <div className="item">
                  <p className="key">买家留言</p>
                  <div className="value input">
                    <input value={remarks[index]} placeholder="有什么要求通通告诉我们吧！" onChange={this.setRemark.bind(this, index)}/>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <p className="tips">您的订单可能会被陆续拆成多件包裹依次送达</p>
        <div className={classNames('submit-box', { 'be-fixed': showFixed })}>
          <button type="button" className="submit-btn" onClick={this.submitOrder.bind(this)}>立即结算</button>
          <div className="text-inner">
            <p className="count">共{productNum}件商品</p>
            <p className="fee">实付：<span className="bold">¥{totalPayAmount}</span></p>
          </div>
        </div>
        {isShowPromo &&
          <div className={classNames('promo-modal-wrap', { 'be-fixed': showFixed })}>
            <div className="background" onClick={this.closePromoModal.bind(this)}></div>
            <div className="promo-modal">
              <button type="button" className="close-btn" onClick={this.closePromoModal.bind(this)}></button>
              <p className="promo-title">{ selectedPromo.type === 'DEDUCTION' ? '活动优惠' : selectedPromo.type === 'NEW_COMER' ? '新人活动' : '' }</p>
              <div className="promo-list">
                { selectedPromo.promotions.filter(promo => promo.isEnable === 'Y').map((item, index) => {
                  return (
                    <div key={index} data-flex="dir:left box:first" className="item">
                      <div className="label-box"><div className="label">{item.label}</div></div>
                      <div className="info">
                        <p className="name">{item.name}</p>
                        <p className="desc">{item.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              {disuse.indexOf(selectedPromo.type) >= 0 &&
                <button className="use-btn" onClick={this.delDisuse.bind(this, selectedPromo.type)}>使用优惠</button>
              }
              {disuse.indexOf(selectedPromo.type) < 0 &&
                <button className="use-btn" onClick={this.addDisuse.bind(this, selectedPromo.type)}>不使用优惠</button>
              }
            </div>
          </div>
        }
        {isShowInvalid &&
          <InvalidModal
            isFixed={showFixed}
            list={invalidCartDetails}
            onCancel={this.closeInvalidModal.bind(this)}
            onConfirm={this.removeInvalidDetails.bind(this)}
            ></InvalidModal>
        }
      </div>
    )
  }
}

export default template({
  id: 'submitOrder',
  component: SubmitOrder,
  url: ''
})
