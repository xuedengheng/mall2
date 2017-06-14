import React, { Component } from 'react'
import { Link } from 'react-router'
import Carousel from 'nuka-carousel'
import { hashHistory } from 'react-router'
import LazyLoad from 'react-lazyload'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { getFirstValidSku, getSkuTypes, getSkuSquare, getSkuMatrix, updateSkuSquare, skuSquareSelectedKeys, getSkuByKeys, productInvalidSkuFilter } from "../utils/skuSelector"
import _ from "lodash"
import classNames from 'classnames'
import Cookies from 'js-cookie'
import moment from 'moment'

import { getPlatform } from '../config/constant'
import { Tool } from '../config/Tool'

import { track, CART_FROM } from '../utils/sa'
import storage from '../utils/storage'

import AttentionModal from './common/attentionModal'
import AddressSelector from './common/addressSelector'
import PromoModal from './common/promoModal'
import SkuModal from './common/skuModal'
import template from './common/template'
import GalleryWrap from './common/galleryWrap'

const areaKey = 'ywyx_jd_area'

class Product extends Component  {

  constructor(props) {
    super(props)
    this.timer = null
    this.state = {
      mode: 'normal',
      hadStorage: true,
      isShowPromo: false,
      isShowAttention: false,
      isShowCart: false,
      isShowAddr: false,
      isShowGallery: false,
      cartMode: 'normal',
      quantity: 1,
      selectedSku: {},
      initSku: {},
      tab: 'detail',
      isShowSkuModal: false,
      skuTypes: [],
      skuSquare: {},
      skuMatrix: {},
      selectedArea: null,
      product: {
        promotions: [],
        sku: [],
        attribute: []
      },
      now: moment()
    }
  }

  componentWillMount() {
    const { id } = this.props.params
    const area = storage.get(areaKey)
    const account = Cookies.get('account') || ''
    this.props.getCartAddressId('')
    this.props.addressList([])
    if (area) {
      this.setState({ selectedArea: area })
    }
    if (account !== '') {
      this.props.getCartList()
    }
    this.props.getProduct(id).then(json => {
      if (json && json.success) {
        const detail = json.result
        const richId = detail.storeId === 'JD' ? detail.tpProductId : id
        this.setStateProduct()
        this.setSkuProperty()
        this.initSkuMatrixAndSquare()
        this.props.getSearchList(false, { catalogIds: detail.catalogId, pageNo: 0 })
        this.props.getRichProduct(detail.storeId === 'JD', richId)
        if (detail.storeId === 'JD' && area) {
          this.checkJdStorage(area, detail.sku)
        }
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    const { selectedArea } = this.state
    if( nextProps.params.id != this.props.params.id ){
      this.props.getProduct(nextProps.params.id).then(json => {
        if (json && json.success) {
          const detail = json.result
          const richId = detail.storeId === 'JD' ? detail.tpProductId : nextProps.params.id
          this.setStateProduct()
          this.setSkuProperty()
          this.initSkuMatrixAndSquare()
          this.props.getSearchList(false, { catalogIds: detail.catalogId })
          this.props.getRichProduct(detail.storeId === 'JD', richId)
          if (detail.storeId === 'JD' && selectedArea) {
            this.checkJdStorage(selectedArea, detail.sku)
          }
          this.setState({ tab: 'detail' })
          document.querySelector('.product-wrap').scrollTop = 0
        }
      })
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ now: moment() })
    }, 1000)
  }

  componentWillUnmount() {
    if (document.querySelector('.product-wrap')) {
      document.querySelector('.product-wrap').removeEventListener('scroll', this.handleScroll.bind(this), false)
    }
    this.clearTimer()
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  goToCart(e) {
    e.preventDefault()
    hashHistory.push('cart?mode=product')
  }

  goToActivity(activity, e) {
    e.preventDefault()
    if (activity.activityType === 'TIME_LIMITATION') {
      hashHistory.push('timelimit')
    } else if (activity.activityType === 'NEW_USER_LIMITATION') {
      window.location.href = activity.url
    }
  }

  productWrapLoaded(e) {
    document.querySelector('.product-wrap').removeEventListener('scroll', this.handleScroll.bind(this), false)
    document.querySelector('.product-wrap').addEventListener('scroll', this.handleScroll.bind(this), false)
  }

  handleScroll(e) {
    const $wrap = document.querySelector('.product-wrap')
    const $box = document.querySelector('.rich-detail-box') || document.querySelector('.product-box')
    const $tab = document.querySelector('.filter-box')
    if ($wrap.scrollTop >= $box.offsetTop - $tab.clientHeight) {
      this.setState({
        mode: 'detail'
      })
    } else {
      this.setState({
        mode: 'normal'
      })
    }
  }

  selectTab(type, e) {
    e.preventDefault()
    this.setState({ tab: type })
    setTimeout(() => {
      let $wrap = document.querySelector('.product-wrap')
      const $box = document.querySelector('.rich-detail-box') || document.querySelector('.product-box')
      const $tab = document.querySelector('.filter-box')
      $wrap.scrollTop = $box.offsetTop - $tab.clientHeight
    }, 100)
  }

  selectProduct(id, e) {
    e.preventDefault()
    hashHistory.push(`product/${id}`)
  }

  showPromoModal(e) {
    e.preventDefault()
    this.setState({ isShowPromo: true })
  }

  closePromoModal() {
    this.setState({ isShowPromo: false })
  }

  showAttentionModal(e) {
    e.preventDefault()
    this.setState({ isShowAttention: true })
  }

  closeAttentionModal() {
    this.setState({ isShowAttention: false })
  }

  showGallery() {
    document.querySelector('.product-wrap').removeEventListener('scroll', this.handleScroll.bind(this), false)
    this.setState({ isShowGallery: true })
  }

  closeGallery() {
    this.setState({ isShowGallery: false })
  }

  setStateProduct() {
    let product = productInvalidSkuFilter(this.props.product)
    this.setState({product: product})
  }

  //selectedSku是真正选择到可购买的sku，当存在时，加入购物车的按钮才可选
  //initSku只是用在sku-box里数据的展示，
  //当selectedSku修改时，initSku也会修改，但当selectedSku变成null时，initSku不变
  setSkuProperty(){
    const product = this.state.product
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
    if(_.isEmpty(this.state.product.attribute)) return false
    const product = this.state.product
    this.setState({skuMatrix: getSkuMatrix(product)})
    this.setState({skuSquare: getSkuSquare(product, this.state.selectedSku)})
  }

  returnHomePage(e){
    e.preventDefault()
    hashHistory.push('/');
  }

  closeProductCart(e) {
    e.preventDefault()
    this.setState({ isShowCart: !this.hasSku() })
  }

  onClickAddCartInProduct(mode, e) {
    e.preventDefault()
    const { selectedArea, product, hadStorage } = this.state
    if (product.stock <= 0 || product.status == 0 || !hadStorage) return false
    if (product.storeId == 'JD') {
      if (selectedArea) {
        this.setStateProduct()
        this.setSkuProperty()
        this.initSkuMatrixAndSquare()
        this.setState({
          cartMode: mode,
          isShowCart: this.hasSku()
        })
      } else {
        Tool.alert('请选择配送区域')
      }
    } else {
      this.setStateProduct()
      this.setSkuProperty()
      this.initSkuMatrixAndSquare()
      this.setState({
        cartMode: mode,
        isShowCart: this.hasSku()
      })
    }
  }

  onChangeSelectedSku(skuId, e) {
    let sku = _.find(this.state.product.sku, (sku)=> sku.skuId == skuId)
    this.setState({ selectedSku: sku })
    this.setState({ initSku: sku })
  }

	//点击属性时，修改skuTypes
  onChangeSelectedSkuTypes(attrValue, attrId, e){
    let newSkuSquare = updateSkuSquare(this.state.skuSquare, this.state.skuMatrix, attrValue, attrId)
    this.setState({ skuSquare: newSkuSquare })
    let selected_keys = skuSquareSelectedKeys(this.state.skuSquare)
    let filtedSku = getSkuByKeys(this.state.skuMatrix, this.state.product, selected_keys)

    if (filtedSku) {
      this.setState({ selectedSku: filtedSku })
      this.setState({ initSku: filtedSku })
    } else {
      this.setState({ selectedSku: {}})
    }

  }

  hasSku() {
    return !( _.isEmpty(this.state.product.sku) )
  }

  skuClassName(sku){
    let result = "item "
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
    if(!_.isEmpty( this.state.selectedSku )){
      return "cart-btn"
    }else{
      return "cart-btn cart-btn-disabled"
    }
  }

  buyBtnClassName(){
    if(!_.isEmpty( this.state.selectedSku )){
      return "buy-btn"
    }else{
      return "buy-btn buy-btn-disabled"
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
    this.setState({quantity: result})
  }

  skuInner(){ return _.isEmpty(this.state.skuTypes) ? this.noSkuTypesTemplate() : this.skuTypesTemplate() }

  skuTypesTemplate(){
    return (
    <div className="sku-inner">
      { this.state.skuTypes.map((skuType, index)=>{
        return (
        <div key={index} className="sku-item">
          <p className="title">请选择{skuType["attrName"]}</p>
            <div key={index} className="list">
            {
              skuType["values"].map((value, index)=>{
                return (
                  <button key={index} type="button" onClick={this.onChangeSelectedSkuTypes.bind(this, value, skuType["attrId"])}  className={this.skuTypesClassName(skuType, value)}  >{value}</button>
                )
              })
            }
            </div>
        </div>
        )
      }) }
    </div>
    )
  }

  noSkuTypesTemplate(){
    let skus = this.state.product.sku || []
    return   (
    <div className="sku-inner">
      <div className="sku-item">
        <p className="title">请选择类型</p>
        {skus.map((sku, index)=>{
          return (
            <div key={index} className="list">
              <button type="button" onClick={sku.stock == "0" ? "" : this.onChangeSelectedSku.bind(this, sku.skuId)}  className={this.skuClassName(sku)}  >{sku.skuName}</button>
            </div>
          )
        })}
      </div>
    </div>
    )
  }

  checkProduct(cb) {
    const { product, selectedSku, quantity, selectedArea } = this.state
    this.props.changeLoadingState(true)
    this.props.getProductForState(product.productId)
    .then(json => {
      this.props.changeLoadingState(false)
      this.props.getProductSuccess(json.result)
      const detail = json.result
      let flag = false
      if (detail.status != '1' || !detail.sku) {
        Tool.alert('该商品已失效，请重新购买')
      } else {
        const sku = _.find(detail.sku, sku => sku.skuId === selectedSku.skuId)
        if (!sku) {
          Tool.alert('该商品已失效，请重新购买')
        } else if (sku.price != selectedSku.price) {
          Tool.alert('商品价格有变动，请查看')
        } else if (quantity > sku.stock) {
          Tool.alert('库存不足')
        } else {
          flag = true
        }
      }
      if (flag) {
        cb && cb()
      } else {
        this.setStateProduct()
        this.setSkuProperty()
        this.initSkuMatrixAndSquare()
        this.setState({ isShowCart: false })
        if (detail.storeId === 'JD' & selectedArea) {
          this.checkJdStorage(selectedArea, detail.sku)
        }
      }
    })
    .catch(error => {
      this.props.changeLoadingState(false)
      this.setState({ isShowCart: false })
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
  }

  onAddSkuCart() {
    const { addCart } = this.props
    const { product, selectedSku, quantity } = this.state
    const account = Cookies.get('account') || ''
    if(_.isEmpty(selectedSku)) return false
    if (selectedSku.stock === 0 || quantity > selectedSku.stock ) return false
    if (account !== '') {
      let params = {
        price: Number(selectedSku.price),
        skuId: selectedSku.skuId,
        storeId: product.storeId,
        quantity
      }
      if (product.activity) {
        params.activityId = product.activity.activityId
        params.activityType = product.activity.activityType
      }
      this.checkProduct(() => {
        addCart(params)
        .then(json => {
          this.props.getCartList()
          this.setState({ isShowCart: false })
          Tool.alert('添加成功')
          track('add_to_car', {
            product_id: product.productId,
            store_name: product.storeName,
            store_id: product.storeId,
            product_category_name: product.fullCategoryName,
            source_page: CART_FROM['detail'],
            product_category_id: product.catalogId,
            product_spec: selectedSku.attribute.map(attr => attr.attrValue).join(','),
            product_name: product.name,
            product_price: Number(selectedSku.price),
            product_count: quantity
          })
        })
        .catch(error => {
          this.setState({ isShowCart: false })
          if (error.code) Tool.alert(error.message)
          console.log(error)
        })
      })
    } else {
      hashHistory.push('login?back=once')
    }
  }

  onSubmitOrderImmediately() {
    const { product } = this.props
    const { quantity } = this.state
    const account = Cookies.get('account') || ''
    const sku = this.state.selectedSku
    if(_.isEmpty(sku)) return false
    if (sku.stock === 0 || quantity > sku.stock ) return false
    if (account !== '') {
      this.checkProduct(() => {
        const cart = [
          {
            storeId: product.storeId,
            storeName: product.storeName,
            cartDetails: [
              {
                activityId: sku.activityId || '',
                activityType: sku.activityType || '',
                productId: product.productId,
                skuId: sku.skuId,
                quantity: quantity,
                picture: sku.picture,
                productName: product.name,
                productAttr: sku.attribute.reduce((acc, attr, index) => {
                  return index === 0 ? acc + attr.attrValue : acc + '/' + attr.attrValue
                }, ''),
                price: sku.price
              }
            ]
          }
        ]
        this.props.getSelectedCarts(cart)
        hashHistory.push('submitorder?mode=immediately')
      })
    } else {
      hashHistory.push('login?back=once')
    }
  }

  onOpenSkuModal(productId, e){
    e.preventDefault()
    e.stopPropagation()
    this.setState({likeProductId: productId})
    this.setState({isShowSkuModal: true})
  }

  closeSkuModal(){
    this.setState({ isShowSkuModal: false })
  }

  renderAreaName() {
    const { selectedArea } = this.state
    let area = ''
    if (selectedArea.province) {
      area += selectedArea.province.name
    }
    if (selectedArea.city) {
      area += selectedArea.city.name
    }
    if (selectedArea.county) {
      area += selectedArea.county.name
    }
    if (selectedArea.town) {
      area += selectedArea.town.name
    }
    return area
  }

  renderAreaCode(addr) {
    let area = ''
    area += addr.province ? addr.province.code : '0'
    area += addr.city ? `_${addr.city.code}` : '_0'
    area += addr.county ? `_${addr.county.code}` : '_0'
    area += addr.town ? `_${addr.town.code}` : '_0'
    return area
  }

  modifyStorage(e) {
    e.preventDefault()
    document.querySelector('.product-wrap').removeEventListener('scroll', this.handleScroll.bind(this), false)
    this.setState({ isShowAddr: true })
  }

  handleAddrClose() {
    this.setState({ isShowAddr: false })
  }

  handleAddrChoose(addr) {
    const { product } = this.state
    storage.set(areaKey, addr)
    this.checkJdStorage(addr, product.sku)
  }

  checkJdStorage(addr, skus) {
    this.props.checkJdStorage({
      area: this.renderAreaCode(addr),
      skuNums: skus.map(item => {
        return {
          // num: Number(item.stock),
          num: 1,
          skuId: Number(item.thirdSkuid)
        }
      })
    })
    .then(json => {
      if (json.result.length > 0) {
        let hasStorage = true
        for (let i = 0, len = json.result.length; i < len; i++) {
          if (json.result[i].stockStateId === 34) {
            hasStorage = false
            break
          }
        }
        this.setState({ hadStorage: hasStorage })
      } else {
        this.setState({ hadStorage: false })
      }
    })
    .catch(error => {
      if (error.code) Tool.alert(error.message)
      console.log(error)
    })
    this.setState({
      selectedArea: addr,
      isShowAddr: false
    })
  }

  renderCarousel(pictures) {
    const decorators = [{
      component: React.createClass({
        render() {
          const dotArr = new Array(this.props.slideCount).fill('')
          return (
            <div className="banner-carousel-dots">
              {dotArr.map((item, index) => {
                return (
                  <div key={index} className={classNames('dot', { 'dot-active': this.props.currentSlide === index })}>
                    <span></span>
                  </div>
                )
              })}
            </div>
          )
        }
      }),
      position: 'BottomCenter'
    }]

    if (pictures.length > 1) {
      return (
        <Carousel autoplay={true} autoplayInterval={3000} decorators={decorators} wrapAround={true}>
          { pictures.map((url, index) => {
            return (
              <div key={index}>
                <LazyLoad throttle={200} height={200}>
                  <ReactCSSTransitionGroup key="1"
                    transitionName="fade"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <img
                      src={url}
                      onLoad={() => { window.dispatchEvent(new Event('resize')) }}
                      onClick={this.showGallery.bind(this)} />
                  </ReactCSSTransitionGroup>
                </LazyLoad>
              </div>
            )
          }) }
        </Carousel>
      )
    } else {
      return (
        <div className="item">
          <LazyLoad throttle={200} height={200}>
            <ReactCSSTransitionGroup key="1"
              transitionName="fade"
              transitionAppear={true}
              transitionAppearTimeout={500}
              transitionEnter={false}
              transitionLeave={false}>
              <img src={pictures[0]} onClick={this.showGallery.bind(this)} />
            </ReactCSSTransitionGroup>
          </LazyLoad>
        </div>
      )
    }
  }

  renderPrice() {
    const { now, product } = this.state
    if (product.activity && (now.unix() >= moment(product.activity.start).unix() && now.unix() < moment(product.activity.end).unix())) {
      return <p className="price">¥{product.activity.minPrice}<span className="origin">¥{product.originPrice}</span></p>
    } else {
      return <p className="price">¥{product.originPrice}</p>
    }
  }

  formatTime(num) {
    const newNum = Math.abs(num)
    return newNum < 10 ? '0' + newNum : '' + newNum
  }

  renderActivity() {
    const { now, product } = this.state
    let status = ''
    let duration = null
    let time = ''
    if (product.activityType === 'TIME_LIMITATION' || product.activityType === 'NEW_USER_LIMITATION') {
      const start = moment(product.activity.start)
      const end = moment(product.activity.end)
      const name = (() => {
        switch (product.activityType) {
          case 'TIME_LIMITATION':
            return '限时购'
          case 'NEW_USER_LIMITATION':
            return product.activity.name
          default:
            return ''
        }
      })()
      if (now.unix() < start.unix()) {
        status = '准时开启'
        duration = moment.duration(now.diff(start))
        time = `离开始还有 ${duration.days() > 0 ? `${Math.abs(duration.days())}天` : ''}${this.formatTime(duration.hours())}:${this.formatTime(duration.minutes())}:${this.formatTime(duration.seconds())}`
      } else if (now.unix() >= start.unix() && now.unix() < end.unix()) {
        status = '已开始'
        duration = moment.duration(end.diff(now))
        time = `离结束还有 ${this.formatTime(duration.hours())}:${this.formatTime(duration.minutes())}:${this.formatTime(duration.seconds())}`
      } else if (now.unix() >= end.unix()) {
        return <div></div>
      }
      return (
        <div
          data-flex="dir:left cross:center box:justify"
          className="time-limit-inner"
          onClick={this.goToActivity.bind(this, product.activity)}
          >
          <p className="name">
            {name}
            {product.activityType === 'TIME_LIMITATION' &&
              <span className="status">{ now.unix() < start.unix() ? `¥${product.activity.minPrice}` : status }</span>
            }
          </p>
          <p className="time">{time}</p>
          <div className="icon go"></div>
        </div>
      )
    }
    return <div></div>
  }

  renderCartTitle() {
    const { now, product, initSku } = this.state
    const inActivity = (() => {
      if (initSku.activityType === 'NEW_USER_LIMITATION' || initSku.activityType === 'TIME_LIMITATION') {
        const start = moment(product.activity.start)
        const end = moment(product.activity.end)
        return now.unix() >= start.unix() && now.unix() < end.unix()
      } else {
        return false
      }
    })()

    return (
      <div className="title-inner">
        {inActivity && initSku.activityType === 'NEW_USER_LIMITATION' &&
          <div className="new-user-icon">新人专享</div>
        }
        {inActivity && initSku.activityType === 'TIME_LIMITATION' &&
          <div className="time-limit-icon"></div>
        }
        {inActivity &&
          <p className="price">¥{initSku.price}<span className="origin">¥{initSku.originPrice}</span></p>
        }
        {!inActivity &&
          <p className="price">¥{initSku.price}</p>
        }
        {product.storeId !== 'JD' &&
          <p className="stock">库存：{initSku.stock}</p>
        }
      </div>
    )
  }

  renderGallery() {
    const { product } = this.state
    const pictures = (() => {
      if (product.pictureUrls && product.pictureUrls.length > 0) {
        return product.pictureUrls
      } else if (product.picture) {
        return [product.picture]
      } else {
        return null
      }
    })()
    return <GalleryWrap pictures={pictures} onClose={this.closeGallery.bind(this)}></GalleryWrap>
  }

  render() {
    const { showFixed } = this.props.global
    const cartLength = this.props.cart.list.length
    const productId = this.props.params.id
    const guessList = this.props.searchList.list
    const richProduct = this.props.richProduct.detail
    const { selectedSku, quantity, now, product, hadStorage, tab, selectedArea, isShowGallery, isShowAttention, isShowCart, isShowSkuModal, isShowPromo, isShowAddr, cartMode, mode } = this.state
    const freightFreeThresholdText = (() => {
      if (product.freightFreeThreshold) {
        const threshold = Number(product.freightFreeThreshold)
        if (threshold <= 0) {
          return `包邮：${product.storeName}商品全场包邮`
        } else {
          return `包邮：${product.storeName}商品满${threshold}元包邮`
        }
      } else {
        return ''
      }
    })()
    const stockEmptyText = product.storeId && product.storeId == 'JD' ? '非常抱歉，您所选配送地区该商品暂时缺货' : '非常抱歉，该商品暂时缺货'

    const style = {
      paddingBottom: isShowSkuModal || isShowCart ? '0' : '1rem',
      overflowY: isShowSkuModal || isShowCart ? 'hidden' : 'scroll'
    }

    return isShowAddr ? (
      <AddressSelector {...this.props} onChoose={this.handleAddrChoose.bind(this)} onClose={this.handleAddrClose.bind(this)}></AddressSelector>
    ) : isShowGallery ? this.renderGallery() : (
      <div className="product-wrap" style={style} onLoad={this.productWrapLoaded.bind(this)}>
        <div className="pic-box">
          {product.activity && this.renderActivity()}
          {product.pictureUrls && product.pictureUrls.length > 0 ?
            this.renderCarousel(product.pictureUrls) :
            product.picture ? (
              <div className="item">
                <LazyLoad throttle={200} height={200}>
                  <ReactCSSTransitionGroup key="1"
                    transitionName="fade"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <img src={product.picture} onClick={this.showGallery.bind(this)} />
                  </ReactCSSTransitionGroup>
                </LazyLoad>
              </div>
            ) : (
              <div></div>
            )
          }
        </div>
        {mode === 'normal' &&
          <div className="go-back" onClick={this.goBack.bind(this)}></div>
        }
        {mode === 'normal' &&
          <div className="to-cart" onClick={this.goToCart.bind(this)}></div>
        }
        <div className="title-box">
          <p className="title">{product.name}</p>
          {this.renderPrice()}
          <p className="digest">
            <span className="type">{product.storeName && `[${product.storeName}]`}</span>
            {product.introduce}
          </p>
        </div>
        <div className="attr-box">
          <div
            data-flex="dir:left cross:center box:last"
            className="item"
            onClick={this.onClickAddCartInProduct.bind(this, 'normal')}>
            <p className="text">规格数量选择</p>
            <div className="icon go"></div>
          </div>
          {product.freightFreeThreshold &&
            <div data-flex="dir:left cross:center box:last" className="item">
              <p className="text">{freightFreeThresholdText}</p>
              {/* <div className="icon go"></div> */}
            </div>
          }
          {product.promotions.length > 0 &&
            <div
              data-flex="dir:left cross:center box:last"
              className="item"
              onClick={this.showPromoModal.bind(this)}>
              <p className="text sale">
                {product.promotions.length}个优惠：
                <span className="label">{product.promotions[0].label}</span>
                <span className="t">{product.promotions[0].name}</span>
              </p>
              <div className="icon go"></div>
            </div>
          }
          {product.storeId && product.storeId === 'JD' &&
            <div
              data-flex="dir:left cross:center box:justify"
              className="item"
              onClick={this.modifyStorage.bind(this)}>
              <p className="text storage">送至</p>
              <p className="text">{selectedArea ? this.renderAreaName() : ''}</p>
              <div className="icon go"></div>
            </div>
          }
        </div>
        {mode === 'detail' &&
          <div className={classNames('page-header', { 'be-fixed': showFixed })}>
            <div className="page-back" onClick={this.goBack.bind(this)}>
              <div className="icon back"></div>
            </div>
            <p className="page-title">商品详情</p>
            <div className="page-cart" onClick={this.goToCart.bind(this)}>
              {cartLength > 0 &&
                <div className="dotted"></div>
              }
            </div>
          </div>
        }
        <div
          data-flex="dir:left main;center cross:center box:mean"
          className={classNames('filter-box', { 'fliter-box-fixed': mode === 'detail' })}>
          <div className={classNames('item', { selected: tab === 'detail' })} onClick={this.selectTab.bind(this, 'detail')}>图文详情</div>
          <div className={classNames('item', { selected: tab === 'guess' })} onClick={this.selectTab.bind(this, 'guess')}>猜你喜欢</div>
        </div>
        {tab === 'detail' &&
          <div className="rich-detail-box" dangerouslySetInnerHTML={{ __html: richProduct }}></div>
        }
        {tab === 'guess' &&
          <div className="product-box">
            {guessList.filter(item => item.productId !== productId).map((item, index) => {
              return (
                <div key={index} className="product" onClick={this.selectProduct.bind(this, item.productId)}>
                  <div className="pic">
                    <img src={item.picture} />
                  </div>
                  <p className="title">{item.name}</p>
                  <p className="price">¥ {item.price.toFixed(2)}</p>
                  <div className="icon cart" onClick={this.onOpenSkuModal.bind(this, item.productId)} ></div>
                </div>
              )
            })}
          </div>
        }
        <div className={classNames('product-action', { 'be-fixed': showFixed })}>
          {(product.stock <= 0 || product.status == 0 || !hadStorage) &&
            <div className="stock-empty-text">{stockEmptyText}</div>
          }
          {(product.stock <= 0 || product.status == 0 || !hadStorage) &&
            <button className="empty-btn">抱歉，暂无库存</button>
          }
          {product.stock > 0 && product.status != 0 && hadStorage &&
            <button className="buy-btn" onClick={this.onClickAddCartInProduct.bind(this, 'buy')}>立即购买</button>
          }
          {product.stock > 0 && product.status != 0 && hadStorage &&
            <button className="cart-btn" onClick={this.onClickAddCartInProduct.bind(this, 'cart')}>加入购物车</button>
          }
          <div data-flex="dir:left main:center cross:center box:mean" className="action-inner">
            <div className="item" onClick={this.returnHomePage.bind(this)}>
              <div className="icon index"></div>
              <p className="text">首页</p>
            </div>
            <div className="item" onClick={this.showAttentionModal.bind(this)}>
              <div className="icon service"></div>
              <p className="text">客服</p>
            </div>
          </div>
        </div>
        {isShowAttention &&
          <AttentionModal isFixed={showFixed} onClose={this.closeAttentionModal.bind(this)}></AttentionModal>
        }
        {isShowSkuModal &&
          <SkuModal
            onClose={this.closeSkuModal.bind(this)}
            {...this.props}
            productId={this.state.likeProductId}
            productFrom="list"></SkuModal>
        }
        {isShowPromo &&
          <PromoModal isFixed={showFixed} list={product.promotions || []} onClose={this.closePromoModal.bind(this)}></PromoModal>
        }
        { !this.state.isShowCart ? "" :
          <div className={classNames('cart-box', { 'be-fixed': showFixed })}>
            <div className="background" onClick={this.closeProductCart.bind(this)}></div>
            <div className="cart-inner">
              <div className="pic">
                <img src={this.state.initSku.picture} />
              </div>
              {this.renderCartTitle()}
              {this.skuInner()}
              <div className="count-inner">
                <p className="title">购买数量</p>
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
            {cartMode === 'normal' &&
              <div data-flex="dir:left box:mean" className="btn-inner">
                <button className={ this.cartBtnClassName() } onClick={this.onAddSkuCart.bind(this)}>加入购物车</button>
                <button className={ this.buyBtnClassName() } onClick={this.onSubmitOrderImmediately.bind(this)}>立即购买</button>
              </div>
            }
            {cartMode === 'cart' &&
              <div data-flex="dir:left box:mean" className="btn-inner">
                <button className={ this.cartBtnClassName() } onClick={this.onAddSkuCart.bind(this)}>加入购物车</button>
              </div>
            }
            {cartMode === 'buy' &&
              <div data-flex="dir:left box:mean" className="btn-inner">
                <button className={ this.buyBtnClassName() } onClick={this.onSubmitOrderImmediately.bind(this)}>立即购买</button>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}

export default template({
  id: 'product',
  component: Product,
  url: ''
})
