import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'
import _ from 'lodash'

import { getPlatform } from '../config/constant'

import FootTab from './common/footTab'
import template from './common/template'

class Cart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inited: false,
      mode: 'submit',
      allEditDetailIds: [],
      allSubmitDetailIds: [],
      checkDetailIds: [],
      delInfo: [],
      cacheCarts: []
    }
  }

  componentWillMount() {
    this.props.getCartList(true)
    .then(json => {
      if (json && json.success) {
        this.setState({ inited: true })
      }
    })
    this.props.getCartAddressId('')
    this.props.addressList([])
  }

  componentWillReceiveProps(nextProps) {
    const { list } = nextProps.cart
    const { mode } = this.state
    const allEditDetailIds = this.getAllEditCartDetailIds(list)
    const allSubmitDetailIds = this.getAllSubmitCartDetailIds(list)
    this.setState({ allEditDetailIds, allSubmitDetailIds, cacheCarts: _.cloneDeep(list) })
    if (mode === 'edit' && allEditDetailIds.length === 0) {
      this.setState({ mode: 'submit', checkDetailIds: [] })
    }
  }

  getAllEditCartDetailIds(carts) {
    const ids = []
    carts.forEach((cart) => {
      cart.cartDetails.forEach((detail) => {
        ids.push(detail.cartDetailId)
      })
    })
    return ids
  }

  getAllSubmitCartDetailIds(carts) {
    const ids = []
    carts.forEach((cart) => {
      cart.cartDetails.forEach((detail) => {
        if (detail.valid) ids.push(detail.cartDetailId)
      })
    })
    return ids
  }

  changeMode(type, e) {
    e.preventDefault()
    this.setState({ mode: type, checkDetailIds: [], delInfo: [] })
  }

  handleAllOps(e) {
    e.preventDefault()
    const { mode, allEditDetailIds, allSubmitDetailIds, checkDetailIds } = this.state
    const { list } = this.props.cart
    const allDetailIds = mode === 'edit' ? allEditDetailIds : allSubmitDetailIds
    if (allDetailIds.length === checkDetailIds.length) {
      this.setState({ checkDetailIds: [] })
      if (mode === 'edit') {
        this.setState({ delInfo: [] })
      }
    } else {
      this.setState({ checkDetailIds: allDetailIds })
      if (mode === 'edit') {
        const delInfo = list.map((cart) => {
          const cartDatilIds = cart.cartDetails.map((detail) => {
            return detail.cartDetailId
          })
          return { cartId: cart.cartId, cartDetailId: cartDatilIds }
        })
        this.setState({ delInfo })
      }
    }
  }

  selectDetail(detail, e) {
    e.preventDefault()
    const { mode, checkDetailIds, delInfo } = this.state
    if (this.checkDetailSelected(detail)) {
      this.setState({ checkDetailIds: checkDetailIds.filter(id => id !== detail.cartDetailId) })
      if (mode === 'edit') {
        this.setState({ delInfo: this.deleteDetailInfo(detail) })
      }
    } else {
      if (mode === 'edit' || (mode === 'submit' && detail.valid)) {
        this.setState({ checkDetailIds: _.union(checkDetailIds, [detail.cartDetailId]) })
      }
      if (mode === 'edit') {
        this.setState({ delInfo: this.createDetailInfo(detail) })
      }
    }
  }

  createDetailInfo(detail) {
    const { delInfo } = this.state
    const cartIndex = _.findIndex(delInfo, (cart) => {
      return cart.cartId === detail.cartId
    })
    if (cartIndex < 0) {
      return delInfo.concat({ cartId: detail.cartId, cartDetailId: [detail.cartDetailId] })
    } else {
      const cartDatilIds = delInfo[cartIndex].cartDetailId
      return [
        ...delInfo.slice(0, cartIndex),
        { cartId: detail.cartId, cartDetailId: cartDatilIds.concat([detail.cartDetailId]) },
        ...delInfo.slice(cartIndex + 1)
      ]
    }
  }

  deleteDetailInfo(detail) {
    const { delInfo } = this.state
    const cartIndex = _.findIndex(delInfo, (cart) => {
      return cart.cartId === detail.cartId
    })
    if (cartIndex < 0) return delInfo
    const cartDatilIds = delInfo[cartIndex].cartDetailId
    const newCartDetailIds = _.difference(cartDatilIds, [detail.cartDetailId])
    return newCartDetailIds.length > 0 ? [
      ...delInfo.slice(0, cartIndex),
      { cartId: detail.cartId, cartDetailId: _.difference(cartDatilIds, [detail.cartDetailId]) },
      ...delInfo.slice(cartIndex + 1)
    ] : [
      ...delInfo.slice(0, cartIndex),
      ...delInfo.slice(cartIndex + 1)
    ]
  }

  checkDetailSelected(detail) {
    const { checkDetailIds } = this.state
    return checkDetailIds.indexOf(detail.cartDetailId) > -1
  }

  selectCart(cart, e) {
    e.preventDefault()
    const { mode, checkDetailIds } = this.state
    const cartDetailIds = cart.cartDetails.filter(detail => detail.valid).map(detail => detail.cartDetailId)
    if (this.checkCartSelected(cart)) {
      this.setState({ checkDetailIds: _.difference(checkDetailIds, cartDetailIds) })
      if (mode === 'edit') {
        this.setState({ delInfo: this.deleteCartInfo(cart) })
      }
    } else {
      this.setState({ checkDetailIds: _.union(checkDetailIds, cartDetailIds) })
      if (mode === 'edit') {
        this.setState({ delInfo: this.createCartInfo(cart) })
      }
    }
  }

  createCartInfo(selectedCart) {
    const { delInfo } = this.state
    const cartIndex = _.findIndex(delInfo, (cart) => {
      return cart.cartId === selectedCart.cartId
    })
    const cartDatilIds = selectedCart.cartDetails.map((detail) => {
      return detail.cartDetailId
    })
    if (cartIndex < 0) {
      return delInfo.concat({ cartId: selectedCart.cartId, cartDetailId: cartDatilIds })
    } else {
      return [
        ...delInfo.slice(0, cartIndex),
        { cartId: selectedCart.cartId, cartDetailId: cartDatilIds },
        ...delInfo.slice(cartIndex + 1)
      ]
    }
  }

  deleteCartInfo(selectedCart) {
    const { delInfo } = this.state
    const cartIndex = _.findIndex(delInfo, (cart) => {
      return cart.cartId === selectedCart.cartId
    })
    if (cartIndex < 0) return delInfo
    return [
      ...delInfo.slice(0, cartIndex),
      ...delInfo.slice(cartIndex + 1)
    ]
  }

  checkCartSelected(cart) {
    const { checkDetailIds } = this.state
    const cartDetailIds = cart.cartDetails.map(detail => detail.cartDetailId)
    for (let i = 0, len = cartDetailIds.length; i < len; i++) {
      if (checkDetailIds.indexOf(cartDetailIds[i]) < 0) return false
    }
    return true
  }

  setCount(type, detail, e) {
    e.preventDefault()
    if (type === 'subtract' && Number(detail.quantity) <= 1) return false
    if (type === 'plus' && Number(detail.quantity) === Number(detail.stock)) return false
    const quantity = type === 'plus' ? Number(detail.quantity) + 1 : Number(detail.quantity) - 1
    this.props.editCartDetailCount({ cartDetailId: detail.cartDetailId, quantity })
  }

  delCartDetails(e) {
    e.preventDefault()
    const { delInfo, checkDetailIds } = this.state
    if (checkDetailIds.length === 0) return false
    this.props.deleteCartDetail({ cartInfo: delInfo })
  }

  submitOrder(e) {
    e.preventDefault()
    const { checkDetailIds } = this.state
    if (checkDetailIds.length === 0) return false
    const preOrderCarts = this.createPreOrderCarts(checkDetailIds)
    this.props.submitCartDetail({ preOrderCarts, cartDetailIds: checkDetailIds.join(',') })
  }

  goToProduct(id, e) {
    e.preventDefault()
    hashHistory.push(`product/${id}`)
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  createPreOrderCarts(checkDetailIds) {
    const { cacheCarts } = this.state
    let newCacheCarts = _.cloneDeep(cacheCarts)
    for (let i = 0, len = newCacheCarts.length; i < len; i++) {
      newCacheCarts[i].cartDetails = newCacheCarts[i].cartDetails.filter((detail) => {
        return checkDetailIds.indexOf(detail.cartDetailId) > -1
      })
    }
    return newCacheCarts.filter((cart) => {
      return cart.cartDetails.length > 0
    })
  }

  renderSubmitModeList() {
    const { list } = this.props.cart
    const { inited } = this.state

    if (inited) {
      return list.length > 0 ? list.map((cart, index) => {
        return (
          <div key={index} className="platform-box">
            <div data-flex="dir:left cross:center box:first" className="title">
              <div
                className={classNames('check', { checked: this.checkCartSelected(cart) })}
                onClick={this.selectCart.bind(this, cart)}
                ></div>
              <p className="name">{cart.storeName}发货</p>
            </div>
            {cart.cartDetails.map((detail, index) => {
              return (
                <div key={index} data-flex="dir:left cross:center box:first" className="item">
                  <div
                    className={classNames('check', { checked: this.checkDetailSelected(detail) })}
                    onClick={this.selectDetail.bind(this, detail)}
                    ></div>
                  <div className="info">
                    <div className="pic" onClick={this.goToProduct.bind(this, detail.productId)}>
                      {!detail.valid &&
                        <div className="mask"></div>
                      }
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
                      <p className="attr">{detail.productAttr ? `规格：${detail.productAttr}` : ''}</p>
                      <p className="price" className={classNames('price', { 'not-valid': !detail.valid })}>¥{detail.price}</p>
                      {detail.valid ?
                        (
                          <div className="counter">
                            <div
                              className={classNames('subtract', { disabled: Number(detail.quantity) <= 1 })}
                              onClick={this.setCount.bind(this, 'subtract', detail)}
                              >-</div>
                            <div className="num">{detail.quantity}</div>
                            <div
                              className={classNames('plus', { disabled: Number(detail.quantity) >= Number(detail.stock) })}
                              onClick={this.setCount.bind(this, 'plus', detail)}
                              >+</div>
                          </div>
                        ) :
                        <p className="invalid">该商品失效</p>
                      }
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }) : (
        <div className="empty-box">
          <div className="pic"></div>
          <p className="text">购物车还空着</p>
        </div>
      )
    } else {
      return <div></div>
    }
  }

  renderEditModeList() {
    const { list } = this.props.cart
    const { inited } = this.state

    if (inited) {
      return list.length > 0 ? list.map((cart, index) => {
        return (
          <div key={index} className="platform-box">
            <div data-flex="dir:left cross:center box:first" className="title">
              <div
                className={classNames('check', { checked: this.checkCartSelected(cart) })}
                onClick={this.selectCart.bind(this, cart)}
                ></div>
              <p className="name">{cart.storeName}发货</p>
            </div>
            {cart.cartDetails.map((detail) => {
              return (
                <div key={detail.cartDetailId} data-flex="dir:left cross:center box:first" className="item">
                  <div
                    className={classNames('check', { checked: this.checkDetailSelected(detail) })}
                    onClick={this.selectDetail.bind(this, detail)}
                    ></div>
                  <div className="info">
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
                      <p className="attr">{detail.productAttr ? `规格：${detail.productAttr}` : ''}</p>
                      <p className="price">¥{detail.price}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }) : (
        <div className="empty-box">
          <div className="pic"></div>
          <p className="text">购物车还空着</p>
        </div>
      )
    } else {
      return <div></div>
    }
  }

  render() {
    const { list } = this.props.cart
    const { query } = this.props.location
    const { showFixed } = this.props.global
    const { mode, checkDetailIds, allEditDetailIds, allSubmitDetailIds } = this.state
    const allDetailIds = mode === 'edit' ? allEditDetailIds : allSubmitDetailIds
    const totalFee = list.reduce((acc, cart) => {
      return acc + cart.cartDetails.reduce((detailAcc, detail) => {
        const fee = checkDetailIds.indexOf(detail.cartDetailId) < 0 ? 0 : Number(detail.price) * Number(detail.quantity)
        return detailAcc + fee
      }, 0)
    }, 0)

    return (
      <div className="cart-wrap" style={{ paddingBottom: query.mode === 'product' ? '0.98rem' : '1.98rem' }}>
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">购物车</p>
          {mode === 'submit' ?
            <div className="page-btn" onClick={this.changeMode.bind(this, 'edit')}>编辑</div> :
            <div className="page-btn" onClick={this.changeMode.bind(this, 'submit')}>完成</div>
          }
        </div>
        {mode === 'submit' ? this.renderSubmitModeList() : this.renderEditModeList()}
        <div
          data-flex="dir:left cross:center box:justify"
          className={classNames('foot-action', { 'be-fixed': showFixed })}
          style={{ bottom: query.mode === 'product' ? '0' : '1rem' }}
          >
          <div className="action-box">
            <div
              className={classNames('check', { checked: allDetailIds.length > 0 && (allDetailIds.length === checkDetailIds.length) })}
              onClick={this.handleAllOps.bind(this)}
              ></div>
            <p className="text">全选</p>
          </div>
          <div className="total-inner">
            {mode === 'submit' && checkDetailIds.length > 0 &&
              <p className="fee">¥{totalFee.toFixed(2)}</p>
            }
            {mode === 'submit' && checkDetailIds.length > 0 &&
              <p className="freight">不包含运费</p>
            }
          </div>
          {mode === 'submit' ?
            <button
              className={classNames('submit-btn', 'submit', { disabled: checkDetailIds.length === 0 })}
              onClick={this.submitOrder.bind(this)}
              >结算</button> :
            <button
              className={classNames('submit-btn', 'del', { disabled: checkDetailIds.length === 0 })}
              onClick={this.delCartDetails.bind(this)}
              >删除</button>
          }
        </div>
        {query.mode !== 'product' &&
          <FootTab index="2" isFixed={showFixed}></FootTab>
        }
      </div>
    )
  }
}

export default template({
  id: 'cart',
  component: Cart,
  url: ''
})
