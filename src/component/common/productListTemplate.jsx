import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import LazyLoad from 'react-lazyload'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import SkuModal from './skuModal'

export default class ProductListTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowSkuModal: false,
      productId: '',
      products: []
    }
  }

  handleClick(item, e) {
    e.preventDefault()
    hashHistory.push(`/product/${item.productId}`)
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

  componentWillMount() {
    const { list } = this.props;
    const ids = list.map((item) => {
      return item.id
    })
    this.getProducts(ids)
  }

  componentWillReceiveProps(nextProps) {
    const { list } = this.props
    if (JSON.stringify(list) !== JSON.stringify(nextProps.list)) {
      const ids = nextProps.list.map((item) => {
        return item.id
      })
      this.getProducts(ids)
    }
  }

  getProducts(ids) {
    if (ids.length > 0) {
      this.props.getProductListByIdsForState(ids.join(','))
      .then(result => {
        this.setState({ products: result })
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }

  render() {
    const { products, productId, isShowSkuModal } = this.state

    return (
      <div className="product-list-template">
        {products.map((item, index) => {
          return (
            <div key={index} className="item" onClick={this.handleClick.bind(this, item)}>
              {item.activityType && item.activityType === 'NEW_USER_LIMITATION' &&
                <div className="new-user-icon">新人专享</div>
              }
              {item.activityType && item.activityType === 'TIME_LIMITATION' &&
                <div className="time-limit-icon"></div>
              }
              <div className="pic">
                <LazyLoad throttle={200} height={100}>
                  <ReactCSSTransitionGroup key="1"
                    transitionName="fade"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <img src={item.picture} />
                  </ReactCSSTransitionGroup>
                </LazyLoad>
              </div>
              <p className="item-title">{item.name}</p>
              <p className="price">¥ {item.price}</p>
              <div className="icon cart" onClick={this.onOpenSkuModal.bind(this, item.productId)}></div>
            </div>
          )
        })}
        {isShowSkuModal &&
          <SkuModal
            onClose={this.closeSkuModal.bind(this)}
            {...this.props}
            productId={this.state.productId}
            productFrom="list"></SkuModal>
        }
      </div>
    )
  }
}
