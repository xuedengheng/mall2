import { combineReducers } from 'redux';

import global from './global'
import account from './account'
import showcase from './showcase'
import category from './category'
import productList from './productList'
import product from './product'
import richProduct from './richProduct'
import recommendList from './recommendList'
import searchList from './searchList'
import mine from './mine'
import profile from './profile'
import article from './article'
import address from './address'
import area from './area'
import cart from './cart'
import modalProduct from "./skuProduct"
import promotion from './promotion'
import order from './order'
import payment from './payment'
import refund from './refund'
import loading from './loading'
import express from './express'
import coupon from './coupon'
import activity from './activity'
import invitation from './invitation'

const rootReducer = combineReducers({
  global,
  account,
  showcase,
  category,
  productList,
  recommendList,
  searchList,
  mine,
  profile,
  address,
  article,
  product,
  modalProduct,
  richProduct,
  area,
  cart,
  promotion,
  order,
  payment,
  refund,
  loading,
  express,
  coupon,
  activity,
  invitation
})

export default rootReducer
