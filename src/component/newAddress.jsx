import React, { Component } from 'react'
import { Tool } from '../config/Tool'
import classNames from 'classnames'
import template from './common/template'
import AddressSelector from './common/addressSelector'
import { hashHistory } from 'react-router'
import { isMobile, isPostcode } from '../utils/reg'

class NewAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      addressId: undefined,
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
    this.setState({ [`${key}`]: value });
  }

  handleInputMethod(type, e) {
    let value = e.target.value
    this.setAttr(type, value);
  }

  saveNewAddressMethod(obj) {
    if (this.state.name === '') {
      Tool.alert("收货人不能为空!")
    } else if (this.state.mobile === '') {
      Tool.alert("手机号不能为空")
    } else if (!isMobile(this.state.mobile)) {
      Tool.alert("请输入正确的手机号")
    } else if (this.state.postCode === '') {
      Tool.alert("邮政编码不能为空")
    } else if (!isPostcode(this.state.postCode)) {
      Tool.alert("请输入正确的邮政编码")
    } else if (this.state.province === '' || this.state.city === '' || this.state.block === '') {
      Tool.alert("省市区不能为空")
    } else if (this.state.street === '') {
      Tool.alert("街道不能为空")
    } else if (this.state.address === '') {
      Tool.alert("详细地址不能为空")
    } else {
      this.props.addNewAddressRequest(this.state)
    }
  }

  handleGoBackMethod(type, e) {
    hashHistory.goBack()
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
    const { province, city, town, block } = this.state
    const address = !province && !city && !block && !town ? '请选择' : `${province}${city}${block}${town}`

    return (
      <div className="new-address-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.handleGoBackMethod.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">新增收货地址</p>
        </div>
        <div className="form-list">
          <div className="item">
            <div className="key">收货人</div>
            <div className="value">
              <input value={this.state.name} maxLength="20" className="input-inner" placeholder="请输入收货人姓名" type="text" onChange={this.handleInputMethod.bind(this, 'name')} />
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
            <div className="key">省市区</div>
            <div className={classNames('value', { empty: address === '请选择' })}>{address}</div>
            <div className="icon go"></div>
          </div>
          <div className="item">
            <div className="key">街道</div>
            <div className="value">
              <input value={this.state.street} maxLength="20" placeholder="请填写街道地址" type="text" onChange={this.handleInputMethod.bind(this, 'street')} />
            </div>
          </div>
          <div className="item">
            <div className="key">详细地址</div>
            <div className="value">
              <input value={this.state.address} maxLength="150" placeholder="请填写详细地址" type="text" onChange={this.handleInputMethod.bind(this, 'address')} />
            </div>
          </div>
        </div>
        <div className={classNames('add-btn', { 'be-fixed': showFixed })} onClick={this.saveNewAddressMethod.bind(this)}>立即保存</div>
        {this.state.showAddr &&
          <AddressSelector {...this.props} onChoose={this.handleAddrChoose.bind(this)} onClose={this.handleAddrClose.bind(this)}></AddressSelector>
        }
      </div>
    )
  }
}

export default template({
  id: 'newAddress',
  component: NewAddress,
  url: ''
})

// const mapStateToDispatch = (dispatch) => ({
//   addNewAddressRequest: (obj) => dispatch(addressAction.addNewAddressRequest(obj))
//   // dispatch: dispatch
// })

// const mapStateToProps = (state) => {
//   return {
//     // fetching: state.ui.login.fetching,
//     // error: state.ui.login.error,
//   }
// }

// export default connect(mapStateToProps, mapStateToDispatch)(NewAddress)
