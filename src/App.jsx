import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import { Provider } from 'react-redux'
import route from './router'
import store from './redux/store'
import './config/config.js'

import { Tool } from './config/Tool'

import { isWx } from './utils/ua'
import session from './utils/session'

import 'normalize.css'
import 'flex.css/dist/data-flex.css'

import './style/global.scss'
import './style/footTab.scss'

import './style/bannerTemplate.scss'
import './style/freshTemplate.scss'
import './style/brandTemplate.scss'
import './style/qualityTemplate.scss'
import './style/categoryTemplate.scss'
import './style/productListTemplate.scss'
import './style/recommendTemplate.scss'
import './style/onsaleTemplate.scss'

import './style/auth.scss'
import './style/index.scss'
import './style/showcase.scss'
import './style/lnk.scss'
import './style/articles.scss'
import './style/article.scss'
import './style/category.scss'
import './style/subCategory.scss'
import './style/mine.scss'
import './style/more.scss'
import './style/product.scss'
import './style/profile.scss'
import './style/result.scss'
import './style/search.scss'
import './style/cart.scss'
import './style/pay.scss'
import './style/address.scss'
import './style/updateAddress.scss'
import './style/newAddress.scss'
import './style/selectAddress.scss'
import './style/updateName.scss'
import './style/submitOrder.scss'
import './style/orders.scss'
import './style/order.scss'
import './style/express.scss'
import './style/addressSelector.scss'
import './style/skuModal.scss'
import './style/attentionModal.scss'
import './style/promoModal.scss'
import './style/confirmModal.scss'
import './style/loadingModal.scss'
import './style/invalidModal.scss'
import './style/refunds.scss'
import './style/refund.scss'
import './style/refundTrace.scss'
import './style/salesReturn.scss'
import './style/coupon.scss'
import './style/timeLimit.scss'

const wechatAuthUrl = 'http://wechat.9yiwu.com/account-service/wechat/redirectToTarget'

const { search, origin, pathname, hash, href } = window.location
const newQuery = Tool.queryString2Obj(search.slice(1))
const openHrefArr = href.split('openId=')
const openHashArr = hash.split(/[&|?]openId=/)

if (isWx()) {
  const openId = session.get('openId')
  if (!openId) {
    if (openHrefArr.length == 2) {
      session.set('openId', openHrefArr[1])
      if (!newQuery.wx) {
        window.location.replace(`${origin}${pathname}?wx=fsdhfu&openId=${openHrefArr[1]}${openHashArr[0]}`)
      }
    } else {
      window.location.replace(`${wechatAuthUrl}?target=${window.location.href}`)
    }
  }
}

render(
  <Provider store={store}>
    {route}
  </Provider>,
  document.body.appendChild(document.createElement('div'))
)
