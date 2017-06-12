import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'

import template from './common/template'


class SelectAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addressList: [],
      defaultFlagAddress: {},
    }
  }

  componentDidMount() {
    this.props.addressListRequest()
  }

  componentWillReceiveProps(newProps) {
    // this.updateList(newProps)
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  setSelectedAddress(addressId, e) {
    e.preventDefault()
    this.props.getCartAddressId(addressId)
    hashHistory.goBack()
  }

  render() {
    const { showFixed } = this.props.global
    const { selectedAddressId } = this.props.cart

    let defaultFlagAddress = this.props.address.addressList.filter(function (obj) {
      if (obj.defaultFlag === 'N') {
        return false;
      }
      return true;
    })

    let addressList = this.props.address.addressList.filter(function (obj) {
      if (obj.defaultFlag === 'Y') {
        return false;
      }
      return true;
    })

    let defaultFlag = defaultFlagAddress.length <= 0 ? undefined : defaultFlagAddress[0]

    return (
      <div className="select-address-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">选择收货地址</p>
          <div className="page-btn" onClick={(e) => {
            hashHistory.push('address')
          }}>管理</div>
        </div>
        {defaultFlag &&
          <div data-flex="dir:left box:last" className="default-box" onClick={this.setSelectedAddress.bind(this, defaultFlag.addressId)}>
            <div className="info">
              <div className="name-inner">
                <p className="name"><span className="bold">[默认]</span>收获人：{defaultFlag.name}</p>
                <p className="mobile">{defaultFlag.mobile}</p>
              </div>
              <p className="text">收货地址：{defaultFlag.province + defaultFlag.city + defaultFlag.town + defaultFlag.street + defaultFlag.address}</p>
            </div>
            <div className={classNames('check', { checked: defaultFlag.addressId === selectedAddressId })}></div>
          </div>
        }
        {defaultFlag || addressList.length > 0 ?
          (
            <div className="addr-list">
              {addressList.length > 0 && addressList.map((object) => {
                return (
                  <div key={object.addressId} data-flex="dir:left box:last" className="item" onClick={this.setSelectedAddress.bind(this, object.addressId)}>
                    <div className="info">
                      <p className="name">收货人：{object.name}</p>
                      <p className="mobile">{object.mobile}</p>
                      <p className="text">收货地址：{object.province + object.city + object.town + object.block + object.street + object.address}</p>
                    </div>
                    <div className={classNames('check', { checked: object.addressId === selectedAddressId })}></div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="empty-box">
              <div className="pic"></div>
              <p className="text">没有收货地址</p>
            </div>
          )
        }
      </div>
    )
  }
}

export default template({
  id: 'selectAddress',
  component: SelectAddress,
  url: ''
})
