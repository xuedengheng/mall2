import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import _ from 'lodash'
import classNames from 'classnames'
import fetch from 'isomorphic-fetch'

import { BASE_URL } from '../redux/action/consts'

import { Tool } from '../config/Tool'
import { REFUND_TYPE, RECEIVE_FLAG } from '../config/constant'

import { isMobile } from '../utils/reg'
import { compressImg } from '../utils/image'

import template from './common/template'
import AddressSelector from './common/addressSelector'

const defaultAddrInfo = {
  address: '',
  city: 0,
  cityName: '',
  contactor: '',
  country: 0,
  countryName: '',
  mobile: '',
  province: 0,
  provinceName: '',
  telphone: '',
  village: 0,
  villageName: ''
}

class CreateRefund extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isShowAddr: false,
      step: 1,
      storeId: '',
      mode: 'create',
      detail: null,
      form: {
        pickupAddress: { ...defaultAddrInfo },
        orderId: '',
        receiveFlag: '',
        refundAmount: '',
        refundNumber: 1,
        refundType: '',
        remark: '',
        skuId: '',
        urls: []
      }
    }
  }

  componentWillMount() {
    const { id } = this.props.params
    const { query } = this.props.location
    const { form } = this.state
    if (id) {
      this.props.getRefundDetailForUpdate(id)
      .then(json => {
        const detail = json.details[0]
        this.setState({
          storeId: detail.platform,
          detail: {
            quantity: detail.quantity,
            unitPrice: detail.unitPrice
          },
          form: {
            ...form,
            pickupAddress: detail.pickupAddress || { ...defaultAddrInfo },
            orderId: detail.orderId,
            skuId: detail.skuId,
            requestId: detail.requestId,
            refundAmount: String(detail.refundAmount),
            refundNumber: detail.refundNumber,
            refundType: detail.requestRefundType,
            remark: detail.remark || '',
            receiveFlag: detail.receievedFlag || '',
            urls: detail.pictures || []
          }
        })
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
      this.setState({ mode: 'update' })
    } else if (query.orderid && query.skuid) {
      this.props.getOrderDetailForState(query.orderid)
      .then(json => {
        this.setState({ storeId: json.result.storeId })
        if (json.result.storeId === 'JD') {
          this.setState({
            form: {
              ...form,
              refundType: 'RETURN_AND_REFUND',
              orderId: query.orderid,
              skuId: query.skuid
            }
          })
        } else {
          this.setState({
            form: {
              ...form,
              orderId: query.orderid,
              skuId: query.skuid
            }
          })
        }
        this.props.getWillRefundProduct({ orderId: query.orderid, skuId: query.skuid })
        .then(json => {
          this.setState({ detail: json.detail })
        })
        .catch(error => {
          if (error.code) Tool.alert(error.message)
          console.log(error)
        })
      })
      .catch(error => {
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
      this.setState({ mode: 'create' })
    } else {
      alert('缺少参数')
    }
  }

  goBack(e) {
    e.preventDefault()
    const { step } = this.state
    if (step === 2) {
      this.setState({ step: 1 })
    } else {
      hashHistory.goBack()
    }
  }

  handleUpload(e) {
    const file = e.target.files[0]
    this.props.changeLoadingState(true)
    compressImg(file,
      (arrayBuffer) => {
        this.uploadImg('compress', arrayBuffer)
      },
      () => {
        const data = new FormData()
        data.append('file', file)
        this.uploadImg('normal', data)
      }
    )
  }

  uploadImg(type, body) {
    const { form } = this.state
    const headers = type === 'compress' ? {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data; boundary=yanxuanFileboundary'
    } : {
      'X-Requested-With': 'XMLHttpRequest'
    }
    fetch(`${BASE_URL}/image/upload/test?value=CMS`, {
      method: 'POST',
      headers,
      mode: 'cors',
      credentials: 'same-origin',
      body
    })
    .then(response => response.json())
    .then(json => {
      this.props.changeLoadingState(false)
      if (json && json.success) {
        this.setState({
          form: {
            ...form,
            urls: form.urls.concat([json.url])
          }
        })
      } else {
        let error = new Error(json.msg)
        error.json = json
        error.code = json.code
        throw error
      }
      if (this.refs.uploadFile) {
        this.refs.uploadFile.value = null
      }
    })
    .catch(error => {
      this.props.changeLoadingState(false)
      if (error.code) Tool.alert(error.message)
      console.log(error)
      if (this.refs.uploadFile) {
        this.refs.uploadFile.value = null
      }
    })
  }

  delUploadFile(delUrl, e) {
    e.preventDefault()
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        urls: form.urls.filter(url => {
          return url !== delUrl
        })
      }
    })
  }

  handleQuantity(type, e) {
    e.preventDefault()
    const { form, detail } = this.state
    let num = form.refundNumber
    if (type === 'subtract') {
      num = num > 1 ? num - 1 : num
    } else {
      num = detail && num >= detail.quantity ? num : num + 1
    }
    this.setState({
      form: { ...form, refundNumber: num }
    })
  }

  handleInput(type, e) {
    let value = e.target.value
    this.setForm(type, value)
  }

  setForm(key, value) {
    const { form } = this.state
    this.setState({
      form: { ...form, [`${key}`]: value }
    })
  }

  handleAddrInput(type, e) {
    let value = e.target.value
    this.setAddrForm(type, value)
  }

  setAddrForm(key, value) {
    const { form } = this.state
    if (key === 'mobile') {
      this.setState({
        form: {
          ...form,
          pickupAddress: {
            ...form.pickupAddress,
            [`${key}`]: value,
            telphone: value
          }
        }
      })
    } else {
      this.setState({
        form: {
          ...form,
          pickupAddress: {
            ...form.pickupAddress,
            [`${key}`]: value
          }
        }
      })
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const { id } = this.props.params
    const { step, form } = this.state
    if (this.checkBaseInfo()) {
      if (id) {
        this.updateRefund(form)
      } else {
        if (step === 2) {
          if (this.checkAddrInfo()) this.createRefund(form)
        } else {
          this.createRefund(form)
        }
      }
    }
  }

  updateRefund() {
    const { form, storeId } = this.state
    let newForm = { ...form }
    if (newForm.refundType === 'REFUND_ONLY') {
      delete newForm.receiveFlag
      delete newForm.pickupAddress
    } else if (storeId != 'JD') {
      delete newForm.pickupAddress
    }
    this.props.updateRefund(newForm)
  }

  createRefund() {
    const { form, storeId } = this.state
    let newForm = { ...form }
    if (newForm.refundType === 'REFUND_ONLY') {
      delete newForm.receiveFlag
      delete newForm.pickupAddress
    } else if (storeId != 'JD') {
      delete newForm.pickupAddress
    }
    this.props.createRefund(newForm)
  }

  goToStep2(e) {
    e.preventDefault()
    if (this.checkBaseInfo()) {
      this.setState({ step: 2 })
    }
  }

  checkBaseInfo() {
    const { form, detail } = this.state
    const refundAmount = form.refundAmount.trim()
    const remark = form.remark.trim()
    let flag = false
    if (!form.refundType) {
      Tool.alert('请选择退款类型')
    } else if (form.refundType === 'RETURN_AND_REFUND' && !form.receiveFlag) {
      Tool.alert('请选择收货状态')
    } else if (!remark) {
      Tool.alert('请填写退款原因')
    } else if (!refundAmount) {
      Tool.alert('请填写退款金额')
    } else if (_.isNaN(Number(refundAmount)) || Number(refundAmount) < 0) {
      Tool.alert('请填写正确退款金额')
    } else if (detail && Number(refundAmount) > detail.unitPrice * form.refundNumber) {
      Tool.alert('退款金额不可大于购买商品时的金额')
    } else {
      flag = true
    }
    return flag
  }

  checkAddrInfo() {
    const { pickupAddress } = this.state.form
    const mobile = pickupAddress.mobile.trim()
    const contactor = pickupAddress.contactor.trim()
    const address = pickupAddress.address.trim()
    let flag = false
    if (!contactor) {
      Tool.alert('请填写取件联系人')
    } else if (!mobile) {
      Tool.alert('请填写手机号码')
    } else if (!isMobile(mobile)) {
      Tool.alert('请填写正确的手机号码')
    } else if (!pickupAddress.provinceName || !pickupAddress.cityName || !pickupAddress.countryName) {
      Tool.alert('请选择取件地址')
    } else if (!address) {
      Tool.alert('请填写详细地址')
    } else {
      flag = true
    }
    return flag
  }

  showAddrModal(e) {
    e.preventDefault()
    this.setState({ isShowAddr: true })
  }

  handleAddrClose() {
    this.setState({ isShowAddr: false })
  }

  handleAddrChoose(addr) {
    const { form } = this.state
    const { province, city, county, town } = addr
    this.setState({
      isShowAddr: false,
      form: {
        ...form,
        pickupAddress: {
          ...form.pickupAddress,
          city: city ? city.code : 0,
          cityName: city ? city.name : '',
          country: county ? county.code : 0,
          countryName: county ? county.name : '',
          province: province ? province.code : 0,
          provinceName: province ? province.name : '',
          village: town ? town.code : 0,
          villageName: town ? town.name : ''
        },
      }
    })
  }

  renderSubmitBtn() {
    const { showFixed } = this.props.global
    const { mode, step, storeId, form } = this.state

    if (mode === 'create' && step === 1 && storeId === 'JD' && form.refundType === 'RETURN_AND_REFUND') {
      return <button
        type="button"
        className={classNames('submit-btn', { 'be-fixed': showFixed })}
        onClick={this.goToStep2.bind(this)}>下一步，填写取件信息</button>
    } else {
      return <button
        type="button"
        className={classNames('submit-btn', { 'be-fixed': showFixed })}
        onClick={this.handleSubmit.bind(this)}>{ mode === 'update' ? '保存修改' : '提交申请' }</button>
    }
  }

  render() {
    const { detail, form, canUpload, mode, step, storeId, isShowAddr } = this.state
    const { showFixed } = this.props.global
    const { provinceName, cityName, countryName, villageName } = form.pickupAddress

    const area = !provinceName && !cityName && !countryName && !villageName ? '省、市、区、街道' : `${provinceName}${cityName}${countryName}${villageName}`

    return (
      <div className="sales-return-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">{ mode === 'update'? '修改退款申请' : step === 1 ? '申请退款' : '填写取件信息' }</p>
        </div>
        { step === 1 &&
          <div className="input-wrap">
            <p className="input-label">退款类型<span className="required">*</span></p>
            <div className="input-select-box">
              {!form.refundType &&
                <div className="placeholder">请输入退款类型</div>
              }
              <select
                className="input-select"
                value={form.refundType}
                disabled={storeId === 'JD'}
                onChange={this.handleInput.bind(this, 'refundType')}>
                <option value=""></option>
                { _.map(REFUND_TYPE, (value, key) => {
                  return <option key={key} value={key}>{value}</option>
                }) }
              </select>
              <div className="icon go"></div>
            </div>
          </div>
        }
        { step === 1 && form.refundType === 'RETURN_AND_REFUND' &&
          <div className="input-wrap">
            <p className="input-label">收货状态<span className="required">*</span></p>
            <div className="input-select-box">
              {!form.receiveFlag &&
                <div className="placeholder">请输入收货状态</div>
              }
              <select className="input-select" value={form.receiveFlag} onChange={this.handleInput.bind(this, 'receiveFlag')}>
                <option value=""></option>
                { _.map(RECEIVE_FLAG, (value, key) => {
                  return <option key={key} value={key}>{value}</option>
                }) }
              </select>
              <div className="icon go"></div>
            </div>
          </div>
        }
        { step === 1 &&
          <div className="input-wrap">
            <p className="input-label">退款原因<span className="required">*</span></p>
            <div className="input-text-box">
              <input type="text" className="input-text" maxLength="200" placeholder="请填写退款原因" value={form.remark} onChange={this.handleInput.bind(this, 'remark')} />
            </div>
          </div>
        }
        { step === 1 &&
          <div className="input-wrap">
            <p className="input-label">退款数量<span className="required">*</span></p>
            <div className="input-num-box">
              <p className="placeholder">请选择退款数量</p>
              <div className="counter">
                <div className={classNames('subtract', { disabled: form.refundNumber <= 1 })} onClick={this.handleQuantity.bind(this, 'subtract')}>-</div>
                <div className="num">{form.refundNumber}</div>
                <div className={classNames('plus', { disabled: detail && form.refundNumber >= detail.quantity })} onClick={this.handleQuantity.bind(this, 'plus')}>+</div>
              </div>
            </div>
          </div>
        }
        { step === 1 &&
          <div className="input-wrap">
            <p className="input-label">退款金额<span className="required">*</span>{detail ? `（最多可退¥${(detail.unitPrice * form.refundNumber).toFixed(2)}）` : ''}</p>
            <div className="input-text-box">
              <input type="text" className="input-text" placeholder="请输入退款金额" value={form.refundAmount} onChange={this.handleInput.bind(this, 'refundAmount')} />
              <div className="unit">元</div>
            </div>
          </div>
        }
        { step === 1 &&
          <div className="input-wrap">
            <p className="input-label">上传凭证（最多3张）</p>
            <div className="pic-box">
              {form.urls.map((url, index) => {
                return (
                  <div key={index} className="pic">
                    <div className="del" onClick={this.delUploadFile.bind(this, url)}></div>
                    <img src={url} />
                  </div>
                )
              })}
              {form.urls.length < 3 &&
                <div className="pic add-pic">
                  <label className="file-label" htmlFor="refundFile"></label>
                  <input
                    ref="uploadFile"
                    className="file-input"
                    type="file"
                    accept="image/*"
                    id="refundFile"
                    style={{ position: 'absolute', display: canUpload ? 'block' : 'none', width: '100%', height: '100%', clip: 'rect(0 0 0 0)' }}
                    onChange={this.handleUpload.bind(this)} />
                </div>
              }
            </div>
          </div>
        }
        { step === 2 &&
          <div className="input-wrap">
            <p className="input-label">取件联系人<span className="required">*</span></p>
            <div className="input-text-box">
              <input type="text" className="input-text" maxLength="20" placeholder="请输入取件联系人姓名" value={form.pickupAddress.contactor} onChange={this.handleAddrInput.bind(this, 'contactor')} />
            </div>
          </div>
        }
        { step === 2 &&
          <div className="input-wrap">
            <p className="input-label">手机号码<span className="required">*</span></p>
            <div className="input-text-box">
              <input type="tel" className="input-text" maxLength="20" placeholder="请输入取件人联系手机号" value={form.pickupAddress.mobile} onChange={this.handleAddrInput.bind(this, 'mobile')} />
            </div>
          </div>
        }
        { step === 2 &&
          <div className="input-wrap">
            <p className="input-label">取件地址<span className="required">*</span></p>
            <div
              data-flex="dir:left cross:center box:last"
              className="input-addr-box"
              onClick={this.showAddrModal.bind(this)}>
              <div className="input-addr">{area}</div>
              <div className="icon go"></div>
            </div>
          </div>
        }
        { step === 2 &&
          <div className="input-wrap">
            <p className="input-label">详细地址<span className="required">*</span></p>
            <div className="input-text-box">
              <input type="text" className="input-text" maxLength="100" placeholder="请输入详细取件地址信息" value={form.pickupAddress.address} onChange={this.handleAddrInput.bind(this, 'address')} />
            </div>
          </div>
        }
        { this.renderSubmitBtn() }
        {this.state.isShowAddr &&
          <AddressSelector {...this.props} onChoose={this.handleAddrChoose.bind(this)} onClose={this.handleAddrClose.bind(this)}></AddressSelector>
        }
      </div>
    )
  }
}

export default template({
  id: 'createRefund',
  component: CreateRefund,
  url: ''
})
