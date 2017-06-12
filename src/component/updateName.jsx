import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'

import { Tool } from '../config/Tool'

import template from './common/template'

class UpdateName extends Component {

  constructor(props) {
    super(props)
    this.state = { nickName: '' }
  }

  componentWillMount() {
    this.props.getUserProfile()
  }

  componentWillReceiveProps(nextProps) {
    const newNickName = nextProps.profile.info.nickName
    const { nickName } = this.state

    if (nickName === newNickName) {
      hashHistory.goBack()
    } else {
      this.setState({ nickName: newNickName })
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const { nickName } = this.state

    if (nickName.trim() === '') {
      Tool.alert('用户名不能为空')
    } else {
      this.props.updateProfile({ nickName })
    }
  }

  handleChange(e) {
    this.setState({ nickName: e.target.value })
  }

  render() {
    const { showFixed } = this.props.global
    const { nickName } = this.state
    return (
      <div className="update-name-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={() => hashHistory.goBack()}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">修改用户名</p>
        </div>
        <input value={nickName || ''} className="name-input" onChange={this.handleChange.bind(this)} />
        <p className="tips">每位用户只可以修改一次用户名哦</p>
        <div className={classNames('save-btn', { 'be-fixed': showFixed })} onClick={this.handleSubmit.bind(this)}>保存</div>
      </div>
    )
  }
}

export default template({
  id: 'updateName',
  component: UpdateName,
  url: ''
})
