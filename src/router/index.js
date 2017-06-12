import React, {Component, PropTypes} from 'react';
import { Router, Route, Redirect, IndexRoute, browserHistory, hashHistory } from 'react-router';

import index from '../component/index';

class Roots extends Component {
  render() {
    return (
      <div>{this.props.children}</div>
    )
  }
}

// const history = process.env.NODE_ENV !== 'production' ? browserHistory : hashHistory;

const history = hashHistory


const login = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/login').default)
  }, 'login')
}

const forget = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/forget').default)
  }, 'forget')
}

const register = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/register').default)
  }, 'register')
}

const showcase = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/showcase').default)
  }, 'showcase')
}

const lnk = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/lnk').default)
  }, 'lnk')
}

const article = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/article').default)
  }, 'article')
}

const articles = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/articles').default)
  }, 'articles')
}

const category = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/category').default)
  }, 'category')
}

const subCategory = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/subCategory').default)
  }, 'subCategory')
}

const mine = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/mine').default)
  }, 'mine')
}

const more = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/more').default)
  }, 'more')
}

const about = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/about').default)
  }, 'about')
}

const product = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/product').default)
  }, 'product')
}

const profile = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/profile').default)
  }, 'profile')
}

const updateName = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/updateName').default)
  }, 'updateName')
}

const result = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/result').default)
  }, 'result')
}

const search = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/search').default)
  }, 'search')
}

const cart = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/cart').default)
  }, 'cart')
}

const pay = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/pay').default)
  }, 'pay')
}

const address = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/address').default)
  }, 'address')
}

const updateAddress = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/updateAddress').default)
  }, 'updateAddress')
}

const newAddress = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/newAddress').default)
  }, 'newAddress')
}

const selectAddress = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/selectAddress').default)
  }, 'selectAddress')
}

const submitOrder = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/submitOrder').default)
  }, 'submitOrder')
}

const orders = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/orders').default)
  }, 'orders')
}

const order = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/order').default)
  }, 'order')
}

const express = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/express').default)
  }, 'express')
}

const refunds = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/refunds').default)
  }, 'refunds')
}

const refund = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/refund').default)
  }, 'refund')
}

const refundTrace = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/refundTrace').default)
  }, 'refundTrace')
}

const salesReturn = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/salesReturn').default)
  }, 'salesReturn')
}

const createRefund = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/createRefund').default)
  }, 'createRefund')
}

const yiwuappTargetJump = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/yiwuappTargetJump').default)
  }, 'yiwuappTargetJump')
}

const coupons = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/coupons').default)
  }, 'coupons')
}

const timeLimit = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/timeLimit').default)
  }, 'timeLimit')
}

const feimaCallback = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../component/feimaCallback').default)
  }, 'feimaCallback')
}

const RouteConfig = (
  <Router history={history}>
    <Route path="/" component={Roots}>
      <IndexRoute component={index} />
      <Route path="login" getComponent={login} />
      <Route path="forget" getComponent={forget} />
      <Route path="register" getComponent={register} />
      <Route path="showcase/:id" getComponent={showcase} />
      <Route path="lnk" getComponent={lnk} />
      <Route path="article/:id" getComponent={article} />
      <Route path="articles" getComponent={articles} />
      <Route path="category" getComponent={category} />
      <Route path="category/:id" getComponent={subCategory} />
      <Route path="mine" getComponent={mine} />
      <Route path="more" getComponent={more} />
      <Route path="about" getComponent={about} />
      <Route path="updatename" getComponent={updateName} />
      <Route path="product/:id" getComponent={product} />
      <Route path="profile" getComponent={profile} />
      <Route path="result" getComponent={result} />
      <Route path="search" getComponent={search} />
      <Route path="cart" getComponent={cart} />
      <Route path="pay" getComponent={pay} />
      <Route path="address" getComponent={address} />
      <Route path="address/update/:id" getComponent={updateAddress} />
      <Route path="address/new" getComponent={newAddress} />
      <Route path="address/select" getComponent={selectAddress} />
      <Route path="submitorder" getComponent={submitOrder} />
      <Route path="orders" getComponent={orders} />
      <Route path="order/:id" getComponent={order} />
      <Route path="express/:id" getComponent={express} />
      <Route path="refunds" getComponent={refunds} />
      <Route path="refund/detail" getComponent={refund} />
      <Route path="refund/trace/:id" getComponent={refundTrace} />
      <Route path="refund/salesreturn/:id" getComponent={salesReturn} />
      <Route path="refund/create" getComponent={createRefund} />
      <Route path="refund/update/:id" getComponent={createRefund} />
      <Route path="yiwuapp_targetjump" getComponent={yiwuappTargetJump} />
      <Route path="coupons" getComponent={coupons} />
      <Route path="timelimit" getComponent={timeLimit} />
      <Route path="feima/:mode/:id" getComponent={feimaCallback} />
      <Redirect from='*' to='/' />
    </Route>
  </Router>
);

export default RouteConfig;
