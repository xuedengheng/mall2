import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'
import AddressSelector from './common/addressSelector'
import template from './common/template'
import { Tool } from '../config/Tool'
import { isMobile, isPostcode } from '../utils/reg'

let index

class UpdateAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      addressId: null,
      areaCode: '',
      block: '',
      city: '',
      defaultFlag: 'N',
      mobile: '',
      name: '',
      postCode: '',
      province: '',
      street: '',
      town: '',
      showAddr: false
    }
  }

  setAttr(key, value) {
    if (key === 'defaultFlag') {
      if (value === 'Y') {
        this.setState({ isChange: false })
      } else {
        this.setState({ isChange: true })
      }
      this.setState({ defaultFlag: value })
    } else {
      this.setState({ [`${key}`]: value });
    }
  }

  componentDidMount() {
    const { address, params } = this.props;
    const { addressList } = address
    addressList.map((obj, i) => {
      if (params.id === obj.addressId) {
        index = i;
      }
    })
    let obj = addressList[index]
    for (var key in obj) {
      this.setAttr(key, obj[key])
    }
  }

  handleGoBackMethod(type, e) {
    hashHistory.goBack()
  }

  handleInputMethod(type, e) {
    let value = e.target.value
    this.setAttr(type, value);
  }

  handleSaveMethod(e) {
    const newObj = new Object(this.state)
    if (newObj.name === '') {
      Tool.alert("收货人不能为空")
    } else if (newObj.mobile === '') {
      Tool.alert("手机号不能为空")
    } else if (!isMobile(newObj.mobile)) {
      Tool.alert("请输入正确的手机号")
    } else if (newObj.postCode === '') {
      Tool.alert("邮政编码不能为空")
    } else if (!isPostcode(newObj.postCode)) {
      Tool.alert("请输入正确的邮政编码")
    } else if (newObj.province === '' || this.state.city === '' || this.state.block === '') {
      Tool.alert("省市区不能为空")
    } else if (newObj.street === '') {
      Tool.alert("街道不能为空")
    } else if (newObj.address === '') {
      Tool.alert("详细地址不能为空")
    } else {
      delete newObj.isChange
      delete newObj.showAddr
      this.props.updateAddressRequest(newObj)
    }
  }

  handleDeleteMethod(e) {
    e.preventDefault()
    const { addressList } = this.props.address
    if (addressList.length <= 1) {
      Tool.alert("不能删除该收货地址")
    } else {
      const newObj = new Object(this.state)
      delete newObj.isChange
      delete newObj.showAddr
      this.props.deleteAddressRequest(newObj)
    }
  }

  handleDefaultFlagMethod(type, e) {
    const { addressList } = this.props.address
    const newDefaultFlag = e.target.checked ? 'N' : 'Y'
    const newObj = new Object(this.state)
    if (newObj.defaultFlag === 'Y') {
      Tool.alert("必须有一个默认地址！")
      this.setState({ isChange: newObj.defaultFlag === 'Y' ? false : true })
    } else {
      delete newObj.isChange
      delete newObj.showAddr
      this.props.updateAddressRequest({ ...newObj, defaultFlag: newDefaultFlag })
    }
  }

  modifyLocation(e) {
    e.preventDefault()
    this.setState({ showAddr: true })
  }

  renderAreaCode(addr) {
    let area = ''
    area += addr.province ? addr.province.code : '0'
    area += addr.city ? `_${addr.city.code}` : '_0'
    area += addr.county ? `_${addr.county.code}` : '_0'
    area += addr.town ? `_${addr.town.code}` : '_0'
    return area
  }

  handleAddrClose() {
    this.setState({ showAddr: false })
  }

  handleAddrChoose(addr) {
    const { province, city, county, town } = addr
    this.setState({
      areaCode: this.renderAreaCode(addr),
      province: province ? province.name : '',
      city: city ? city.name : '',
      block: county ? county.name : '',
      town: town ? town.name : '',
      showAddr: false
    })
  }

  render() {
    const { showFixed } = this.props.global
    const { province, street, town, city, block } = this.state
    const address = !province && !city && !block && !town ? '请选择' : `${province}${city}${block}${town}`

    return (
      <div className="update-address-wrap" >
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.handleGoBackMethod.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">编辑收货地址</p>
          <div className="page-btn" onClick={this.handleSaveMethod.bind(this)}>保存</div>
        </div>
        <div className="form-list">
          <div className="item">
            <div className="key">收货人</div>
            <div className="value">
              <input value={this.state.name} maxLength="20" placeholder="请输入收货人姓名" onChange={this.handleInputMethod.bind(this, 'name')} />
            </div>
          </div>
          <div className="item">
            <div className="key">手机号码</div>
            <div className="value">
              <input value={this.state.mobile} placeholder="请输入收货人手机号" type="tel" maxLength="20" onChange={this.handleInputMethod.bind(this, 'mobile')} />
            </div>
          </div>
          <div className="item">
            <div className="key">邮政编码</div>
            <div className="value">
              <input value={this.state.postCode} placeholder="请输入邮政编码" type="tel" maxLength="6" onChange={this.handleInputMethod.bind(this, 'postCode')} />
            </div>
          </div>
          <div className="item" onClick={this.modifyLocation.bind(this)}>
            <div className="key" >省市区</div>
            <div className="value">{address}</div>
            <div className="icon go"></div>
          </div>
          <div className="item">
            <div className="key">街道</div>
            <div className="value">
              <input value={this.state.street} maxLength="20" placeholder="请填写街道地址" onChange={this.handleInputMethod.bind(this, 'street')} />
            </div>
          </div>
          <div className="item">
            <div className="key">详细地址</div>
            <div className="value">
              <input value={this.state.address} maxLength="150" placeholder="请填写详细地址" onChange={this.handleInputMethod.bind(this, 'address')} />
            </div>
          </div>
        </div>
        <div className="default-box">
          <div className="key">设为默认</div>
          <div className="slide">
            <input type="checkbox" id="foo3" className="cir" checked={this.state.isChange} onChange={this.handleDefaultFlagMethod.bind(this, 'defaultFlag')} />
            <label htmlFor="foo3" className="btn"></label>
            <label htmlFor="foo3" className="ct"></label>
          </div>
        </div>
        <button className="del-btn" onClick={this.handleDeleteMethod.bind(this)}>删除地址</button>
        {this.state.showAddr &&
          <AddressSelector {...this.props} onChoose={this.handleAddrChoose.bind(this)} onClose={this.handleAddrClose.bind(this)}></AddressSelector>
        }
      </div>
    )
  }
}

export default template({
  id: 'updateAddress',
  component: UpdateAddress,
  url: ''
})
