import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import _ from 'lodash'
import classNames from 'classnames'
import Cookies from 'js-cookie'
import moment from 'moment'
import { getFirstValidSku, getSkuTypes, getSkuSquare, getSkuMatrix, updateSkuSquare, skuSquareSelectedKeys, getSkuByKeys, productInvalidSkuFilter } from "../../utils/skuSelector"

import { track, CART_FROM } from '../../utils/sa'
import { Tool } from '../../config/Tool'

export default class SkuModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      now: moment(),
      selectedSku: {},
      quantity: 1,
      skuSquare: {},
      skuMatrix: {},
      skuTypes: [],
      initSku: {},
      modalProduct: {
        promotions: [],
        sku: [],
        attribute: []
      }
    }
  }

  componentWillMount(){
    this.props.getModalProduct(this.props.productId).then(()=>{
      this.setStateModalProduct()
      this.setSkuProperty()
      this.initSkuMatrixAndSquare()
    })
  }

  componentDidMount() {
    this.timer = setInterval(() => {
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

  setStateModalProduct(){
    let product = productInvalidSkuFilter(this.props.modalProduct)
    this.setState({modalProduct: product})
  }

  //selectedSku是真正选择到可购买的sku，当存在时，加入购物车的按钮才可选
  //initSku只是用在sku-box里数据的展示，
  //当selectedSku修改时，initSku也会修改，但当selectedSku变成null时，initSku不变
  setSkuProperty(){
    const product = this.state.modalProduct
    product.pictureUrls = product.pictureUrls || []
    const skus = product.sku || []
    let firstValidSku = getFirstValidSku(product)
    if(firstValidSku) {
      this.setState({selectedSku: {}})
      this.setState({
        initSku: {
          activityId: '',
          activityType: '',
          picture: product.picture,
          price: product.price,
          originPrice: product.originPrice,
          productId: product.productId,
          stock: product.stock
        }
      }) //初始化sku，主要用作打开小窗口修改时看到选择sku的不同，区别于selectedSku
    }else{
      this.setState({selectedSku: {}})
      this.setState({
        initSku: {
          activityId: '',
          activityType: '',
          picture: product.picture,
          price: product.price,
          originPrice: product.originPrice,
          productId: product.productId,
          stock: product.stock
        }
      })
    }
    this.setState({skuTypes: getSkuTypes(product)})
  }

  initSkuMatrixAndSquare(){
    if(_.isEmpty(this.state.modalProduct.attribute)) return false
    const product = this.state.modalProduct
    this.setState({skuMatrix: getSkuMatrix(product)})
    this.setState({skuSquare: getSkuSquare(product, this.state.selectedSku)})
  }

  onChangeSelectedSku(skuId, e) {
    let sku = _.find(this.state.modalProduct.sku, (sku)=> sku.skuId == skuId)
    this.setState({ selectedSku: sku })
  }

	//点击属性时，修改skuTypes
  onChangeSelectedSkuTypes(attrValue, attrId, e){
    let newSkuSquare = updateSkuSquare(this.state.skuSquare, this.state.skuMatrix, attrValue, attrId)
    this.setState({ skuSquare: newSkuSquare })
    let selected_keys = skuSquareSelectedKeys(this.state.skuSquare)
    let filtedSku = getSkuByKeys(this.state.skuMatrix, this.state.modalProduct, selected_keys)

    console.log( "selected keys", selected_keys , "filtedSku", filtedSku)

    if( filtedSku ){
      this.setState({ selectedSku: filtedSku })
      this.setState({ initSku: filtedSku })
    }else {
      this.setState({ selectedSku: {} })
    }

  }

  hasSku(){ return !( _.isEmpty(this.state.modalProduct.sku) ) }

  skuClassName(sku){
    let result = "item "
    if(!sku || _.isEmpty( this.state.selectedSku )) return result
    if(sku.skuId == this.state.selectedSku.skuId) result += "selected "
    if(sku.stock == "0") result += "disabled"
    return result
  }

  skuTypesClassName(skuType, attrValue, e){
    //改成从skuSquare里拿
    const squareObject = _.find( this.state.skuSquare[ skuType["attrId"] ], (object)=> object.attrValue == attrValue) || {}
    let className = `item ${squareObject.selected ? "selected" : ""} ${squareObject.disabled ? "disabled" : ""}`
    return className
  }

  cartBtnClassName(){
    if(this.state.selectedSku){
      return "cart-btn"
    }else{
      return "cart-btn cart-btn-disabled"
    }
  }

  increaseQuantity(quantity){
    const { selectedSku } = this.state
    if(_.isEmpty(selectedSku)) return false
    if (quantity >= selectedSku.stock) return false
    let result = quantity + 1
    if(result > selectedSku.stock) result = selectedSku.stock
    this.setState({ quantity: result })
  }

  decreaseQuantity(quantity){
    if (quantity === 1) return false
    let result = quantity - 1
    if(result < 1) result = 1
    this.setState({ quantity: result })
  }

  skuInner(){ return _.isEmpty(this.state.skuTypes) ? this.noSkuTypesTemplate() : this.skuTypesTemplate() }

  skuTypesTemplate(){
    let skus = this.state.modalProduct.sku || []
    return (
      <div className="attr-inner">
      {
        this.state.skuTypes.map((skuType, index)=>{
          return (
            <div key={index} className="attr-item">
            <p className="attr-title">请选择{skuType["attrName"]}：</p>
            <div key={index} className="list">
              {
                skuType["values"].map((value, index)=>{
                  return <button key={index} type="button" onClick={this.onChangeSelectedSkuTypes.bind(this, value, skuType["attrId"])} className={ this.skuTypesClassName(skuType, value)}>{value}</button>
                })
              }
            </div>
            </div> )
        })
      }
      </div>
    )

  }

  noSkuTypesTemplate(){
    let skus = this.state.modalProduct.sku || []
    return (
      <div className="attr-inner">
      <p className="attr-title">请选择规格：</p>
        {
          skus.map((sku, index)=>{
            return (
              <div key={index} className="list">
                <button type="button" onClick={sku.stock == "0" ? "" : this.onChangeSelectedSku.bind(this, sku.skuId)} className={ this.skuClassName(sku) }>{sku.skuName}</button>
              </div>
            )
          })
        }
      </div>
    )
  }

  skuPrice() {
    const { selectedSku, quantity } = this.state
    return _.isEmpty(selectedSku) ?  "" : `￥${ (selectedSku.price * quantity).toFixed(2) }`
  }

  onAddSkuCart(){
    const { addCart, productFrom } = this.props
    const { modalProduct, quantity, selectedSku } = this.state
    const account = Cookies.get('account') || ''
    if(_.isEmpty(selectedSku)) return false
    if (selectedSku.stock === 0 || quantity > selectedSku.stock ) return false
    if (account !== '') {
      let params = {
        price: Number(selectedSku.price),
        skuId: selectedSku.skuId,
        storeId: modalProduct.storeId,
        quantity
      }
      if (modalProduct.activity) {
        params.activityId = modalProduct.activity.activityId
        params.activityType = modalProduct.activity.activityType
      }
      addCart(params)
      .then(json => {
        this.props.getCartList()
        this.props.onClose()
        Tool.alert('添加成功')
        track('add_to_car', {
          product_id: modalProduct.productId,
          store_name: modalProduct.storeName,
          store_id: modalProduct.storeId,
          product_category_name: modalProduct.fullCategoryName,
          source_page: CART_FROM[productFrom],
          product_category_id: modalProduct.catalogId,
          product_spec: selectedSku.attribute.map(attr => attr.attrValue).join(','),
          product_name: modalProduct.name,
          product_price: Number(selectedSku.price),
          product_count: quantity
        })
      })
      .catch(error => {
        this.props.onClose()
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    } else {
      hashHistory.push('login?back=once')
    }
  }


  onChangeSelectedSku(skuId, e) {
    let sku = _.find(this.state.modalProduct.sku, (sku)=> sku.skuId == skuId)
    this.setState({ selectedSku: sku })
  }


  handleClose(e) {
    e.preventDefault()
    this.props.onClose()
  }

  renderFee() {
    const { selectedSku } = this.state

    if (!_.isEmpty(selectedSku)) {
      if (selectedSku.activityType) {
        return <div className="fee">¥{selectedSku.price}<span className="origin">¥{selectedSku.originPrice}</span></div>
      } else {
        return <div className="fee">¥{selectedSku.price}</div>
      }
    } else {
      return <div className="fee"></div>
    }
  }

  renderCartTitle() {
    const { now, modalProduct, initSku } = this.state
    const inActivity = (() => {
      if (initSku.activityType === 'NEW_USER_LIMITATION' || initSku.activityType === 'TIME_LIMITATION') {
        const start = moment(modalProduct.activity.start)
        const end = moment(modalProduct.activity.end)
        return now.unix() >= start.unix() && now.unix() < end.unix()
      } else {
        return false
      }
    })()

    return (
      <div className="info">
        {inActivity && initSku.activityType === 'NEW_USER_LIMITATION' &&
          <div className="new-user-icon">新人专享</div>
        }
        {inActivity && initSku.activityType === 'TIME_LIMITATION' &&
          <div className="time-limit-icon"></div>
        }
        <p className="sku-title">{initSku.skuName || modalProduct.name}</p>
        {modalProduct.storeId !== 'JD' &&
          <p className="stock">库存：{initSku.stock}</p>
        }
      </div>
    )
  }

  render() {
    const { showFixed } = this.props.global
    const { selectedSku, initSku, quantity, modalProduct } = this.state

    return (
      <div className={classNames('sku-modal-wrap', { 'be-fixed': showFixed })}>
        <div className="background" onClick={this.handleClose.bind(this)}></div>
        <div className="sku-modal">
          <div className="header">
            <div className="pic">
              <img src={initSku.picture} />
            </div>
            {this.renderCartTitle()}
          </div>
          <div className="sku-box">
            {this.skuInner()}
            <div className="count-inner">
              <p className="count-title">请选择数量：</p>
              <div className="counter">
                <div
                  className={classNames('subtract', { disabled: _.isEmpty(selectedSku) || quantity <= 1 })}
                  onClick={this.decreaseQuantity.bind(this, quantity)}
                  >-</div>
                <div className="num">{quantity}</div>
                <div
                  className={classNames('plus', { disabled: _.isEmpty(selectedSku) || quantity >= selectedSku.stock })}
                  onClick={this.increaseQuantity.bind(this, quantity)}
                  >+</div>
              </div>
            </div>
          </div>
          <div className="sku-action">
            <div
              className={classNames('cart-btn', { disabled: _.isEmpty(selectedSku) })}
              onClick={this.onAddSkuCart.bind(this)}
              >加入购物车</div>
            {this.renderFee()}
          </div>
        </div>
      </div>
    )
  }
}
