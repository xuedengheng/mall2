import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import _ from 'lodash'
import classNames from 'classnames'

import { EXPRESS_TYPE } from '../config/constant'
import { Tool } from '../config/Tool'

import template from './common/template'

class SalesReturn extends Component {

  constructor(props) {
    super(props)
    this.state = {
      form: {
        requestId: '',
        exp: '',
        expFormId: '',
        decision: 'USER_RETURNED',
        nodeKey: 'WaitingAccountUserTask'
      }
    }
  }

  componentWillMount() {
    const { id } = this.props.params
    const { form } = this.state
    if (!id) {
      Tool.alert('缺少参数')
    } else {
      this.setState({
        form: { ...form, requestId: id }
      })
    }
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
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

  handleSubmit(e) {
    const { form } = this.state
    const { expFormId } = form
    if (!form.exp) {
      Tool.alert('请选择快递公司')
    } else if (!expFormId) {
      Tool.alert('请填写快递物流单号')
    } else {
      this.props.changeLoadingState(true)
      this.props.submitRefundDetail(form)
      .then(json => {
        this.props.changeLoadingState(false)
        Tool.alert('提交成功')
        hashHistory.goBack()
      })
      .catch(error => {
        this.props.changeLoadingState(false)
        if (error.code) Tool.alert(error.message)
        console.log(error)
      })
    }
  }

  render() {
    const { showFixed } = this.props
    const { form } = this.state

    return (
      <div className="sales-return-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">填写退货信息</p>
        </div>
        <div className="input-wrap">
          <p className="input-label">快递公司<span className="required">*</span></p>
          <div className="input-select-box">
            <select
              className="input-select"
              value={form.exp}
              onChange={this.handleInput.bind(this, 'exp')}>
              <option>请选择</option>
              { _.map(EXPRESS_TYPE, (value, key) => {
                return <option key={key} value={key}>{value.name}</option>
              }) }
            </select>
            <div className="icon go"></div>
          </div>
        </div>
        <div className="input-wrap">
          <p className="input-label">快递单号<span className="required">*</span></p>
          <div className="input-text-box">
            <input
              type="text"
              className="input-text"
              placeholder="请填写快递单号"
              value={form.expFormId}
              onChange={this.handleInput.bind(this, 'expFormId')} />
          </div>
        </div>
        <button type="button" className="submit-btn" onClick={this.handleSubmit.bind(this)}>确认退货</button>
      </div>
    )
  }
}

export default template({
  id: 'salesReturn',
  component: SalesReturn,
  url: ''
})
