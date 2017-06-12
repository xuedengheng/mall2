import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import addressAction from '../redux/reducer/address'
import { hashHistory } from 'react-router'
import classNames from 'classnames'
import template from './common/template'


class Address extends Component {

  constructor(props) {
    super(props)
    this.state = {
      addressList: [],
    }
  }

  componentDidMount() {
    this.props.addressListRequest()
  }

  handlePushNewAddress() {
    hashHistory.push('address/new')
  }
  handleUpdateAddress(id) {
    hashHistory.push(`address/update/${id}`)
  }
  handleGoBackMethod(type, e) {
    hashHistory.goBack()
  }
  render() {

    const { address } = this.props
    const { showFixed } = this.props.global

    return (
      <div className="address-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.handleGoBackMethod.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">收货地址管理</p>
        </div>
        {address.addressList.length > 0 ?
          (
            <div className="addr-list">
              {address.addressList.map((obj, index) => {
                  return (
                    <div data-flex="dir:left cross:center box:last" className="item" key={index}>
                      <div className="info" onClick={this.handleUpdateAddress.bind(this, obj.addressId)}>
                        <div className="name-inner">
                          <p className="name">
                            {obj.defaultFlag === 'Y' &&
                              <span className="bold">[默认]</span>
                            }
                            收货人：{obj.name}
                          </p>
                          <p className="mobile">{obj.mobile}</p>
                        </div>
                        <p className="text">收货地址：{obj.province + obj.city + obj.town + obj.address}</p>
                      </div>
                      <div className="icon go" ></div>
                    </div>
                  )
                })
              }
            </div>
          ) : (
            <div className="empty-box">
              <div className="pic"></div>
              <p className="text">没有收货地址</p>
            </div>
          )
        }
        <div className={classNames('add-btn', { 'be-fixed': showFixed })} onClick={this.handlePushNewAddress.bind(this)}>新增地址</div>
      </div>
    )
  }
}

export default template({
  id: 'address',
  component: Address,
  url: ''
})
