import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'
import ReactPullLoad, { STATS } from 'react-pullload'
import Cookies from 'js-cookie'

import { track } from '../utils/sa'

import FootTab from './common/footTab'
import template from './common/template'
import SkuModal from './common/skuModal'

function disableScroll(e) {
  e.preventDefault()
}

class Result extends React.Component {

  constructor(props) {
    super(props)
    const { query } = props.location
    const names = query.names ? decodeURIComponent(query.names) : undefined
    const catalogIds = query.catalogids || undefined
    const brandCodes = query.brandcodes || undefined
    const platformIds = query.platformids || undefined
    this.history_flag = query.history_flag && query.history_flag == 1 ? true : false
    this.state = {
      inited: false,
      query: {
        names,
        catalogIds,
        brandCodes,
        platformIds,
        status: 1,
        sortOrder: 'DESC',
        sortCol: query.catalogids ? 'id' : ''
      },
      isShowSkuModal: false,
      productId: '',
      hasMore: true,
      action: STATS.init
    }
  }

  componentWillMount() {
    const { query } = this.state
    const account = Cookies.get('account') || ''
    this.props.changeLoadingState(true)
    this.props.getSearchListSuccess([])
    setTimeout(() => {
      this.props.getSearchList(this.history_flag, { ...query, pageNo: 0 })
      .then(json => {
        this.props.changeLoadingState(false)
        this.setState({ inited: true })
        if (json && json.success && query.names) {
          track('search', {
            keyword: query.names,
            has_result: json.result.length > 0 ? true : false,
            history_flag: this.history_flag
          })
        }
      })
      if (account !== '') {
        this.props.getCartList()
      }
    }, 1000)
  }

  componentWillReceiveProps(nextProps) {
    const { showSkuModal } = nextProps.global
    const { wrap } = this.refs
    if (wrap) {
      if (showSkuModal) {
        wrap.addEventListener('touchmove', disableScroll, false)
      } else {
        wrap.removeEventListener('touchmove', disableScroll, false)
      }
    }
  }

  selectFilter(type, e) {
    e && e.preventDefault()
    const { query } = this.state
    const sortOrder = (() => {
      if (type === 'price' && type === query.sortCol) {
        return query.sortOrder === 'DESC' ? 'ASC' : 'DESC'
      } else {
        return 'DESC'
      }
    })()
    const params = {
      ...query,
      sortCol: type,
      sortOrder: sortOrder,
      pageNo: 0
    }
    this.props.getSearchList(this.history_flag, params)
    this.setState({ query: params })
  }

  selectDefault(e) {
    e.preventDefault()
    const { query } = this.props.location
    if (query.catalogids) {
      this.selectFilter('id')
    } else {
      this.selectFilter('')
    }
  }

  selectProduct(item, e) {
    e.preventDefault()
    const { query } = this.state
    hashHistory.push(`product/${item.productId}`)
    track('search_result', {
      keyword: query.names || '',
      store_name: item.storeName || '',
      store_id: item.platformId ? String(item.platformId) : '',
      price_range: '',
      category: query.catalogIds || '',
      brand: query.brandCodes || '',
      sorting: this.getSortingTitle(),
      product_id: item.productId || '',
      product_name: item.name || ''
    })
  }

  getSortingTitle() {
    const { query } = this.state
    if (query.sortCol === 'sell_count') {
      return '畅销'
    } else if (query.sortCol === 'price' && query.sortOrder === 'DESC') {
      return '价格降序'
    } else if (query.sortCol === 'price' && query.sortOrder === 'ASC') {
      return '价格升序'
    } else {
      return '默认'
    }
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  goToSearch(e) {
    e.preventDefault()
    const { query } = this.props.location
    if (query.from && query.from === 'search') {
      hashHistory.goBack()
    } else {
      hashHistory.push('search')
    }
  }

  goToCart(e) {
    e.preventDefault()
    hashHistory.push('cart')
  }

  onOpenSkuModal(productId, e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.changeShowSkuModal(true)
    this.setState({
      productId,
      isShowSkuModal: true
    })
  }

  closeSkuModal() {
    this.props.changeShowSkuModal(false)
    this.setState({ isShowSkuModal: false })
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
    const { query, action } = this.state
    if (STATS.refreshing === action) return false
    this.props.getSearchList(this.history_flag, { ...query, pageNo: 0 })
    .then(json => {
      const hasMore = json.total > this.props.searchList.list.length
      this.setState({
        hasMore,
        action: STATS.refreshed
      })
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
    const { query, action } = this.state
    const { pageNo } = this.props.searchList
    if (STATS.loading === action) return false
    this.props.getSearchList(this.history_flag, { ...query, pageNo: pageNo + 1 })
    .then(json => {
      const hasMore = json.total > this.props.searchList.list.length
      this.setState({
        hasMore,
        action: STATS.reset
      })
    })
    .catch(() => {
      this.setState({
        hasMore: true,
        action: STATS.reset
      })
    })
    this.setState({ action: STATS.loading })
  }

  renderResult() {
    const { list } = this.props.searchList
    const { inited, action, hasMore } = this.state

    if (list.length > 0) {
      return (
        <ReactPullLoad
          downEnough={100}
          action={action}
          handleAction={this.handleAction.bind(this)}
          hasMore={hasMore}
          distanceBottom={100}
          >
          <div className="product-box">
            {list.map((item, index) => {
              return (
                <div key={index} className="product" onClick={this.selectProduct.bind(this, item)}>
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
                  <div className="icon cart" onClick={this.onOpenSkuModal.bind(this, item.productId)}></div>
                </div>
              )
            })}
          </div>
        </ReactPullLoad>
      )
    } else if (inited) {
      return (
        <div className="empty-box">
          <div className="pic"></div>
          <p className="text">还没有相关商品</p>
        </div>
      )
    } else {
      return <div></div>
    }
  }

  render() {
    const { showFixed } = this.props.global
    const { query, isShowSkuModal } = this.state
    const search = query.names === undefined ? '商品名 品牌 分类' : query.names.trim()
    const cartLength = this.props.cart.list.length

    return (
      <div className="result-wrap" ref="wrap">
        <div
          data-flex="dir:left cross:center box:justify"
          className={classNames('result-input-box', { 'be-fixed': showFixed })}>
          <div className="icon back" onClick={this.goBack.bind(this)}></div>
          <div className="input-inner" onClick={this.goToSearch.bind(this)}>
            <div className="search icon"></div>
            <div className="search-input">{search}</div>
          </div>
          <div className="icon dotted-cart" onClick={this.goToCart.bind(this)}>
            {cartLength > 0 &&
              <div className="dotted"></div>
            }
          </div>
        </div>
        <div
          data-flex="dir:left main;center cross:center box:mean"
          className={classNames('filter-box', { 'be-fixed': showFixed })}>
          <div className={classNames('item', { selected: query.sortCol === '' || query.sortCol === 'id' })} onClick={this.selectDefault.bind(this)}>默认</div>
          <div className={classNames('item', { selected: query.sortCol === 'price' })} onClick={this.selectFilter.bind(this, 'price')}>
            价格
            <div className="order">
              <i className={classNames('up', { selected: query.sortCol === 'price' && query.sortOrder === 'ASC' })}></i>
              <i className={classNames('down', { selected: query.sortCol === 'price' && query.sortOrder === 'DESC' })}></i>
            </div>
          </div>
          <div className={classNames('item', { selected: query.sortCol === 'sell_count' })} onClick={this.selectFilter.bind(this, 'sell_count')}>畅销</div>
        </div>
        {this.renderResult()}
        {isShowSkuModal &&
          <SkuModal
            onClose={this.closeSkuModal.bind(this)}
            {...this.props}
            productId={this.state.productId}
            productFrom="search"></SkuModal>
        }
        <FootTab isFixed={showFixed} index="0"></FootTab>
      </div>
    )
  }
}

export default template({
  id: 'result',
  component: Result,
  url: ''
})
