import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'
import fetch from 'isomorphic-fetch'

import { BASE_URL } from '../redux/action/consts'

import { compressImg } from '../utils/image'

import { Tool } from '../config/Tool'
import template from './common/template'
import AddressSelector from './common/addressSelector'

class Profile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showAddr: false,
      showSex: false,
      selectedSex: ''
    }
  }

  componentWillMount() {
    this.props.getUserProfile();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedSex: nextProps.profile.info.sex
    })
  }

  handleAvatar(e) {
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
        this.props.updateProfile({ avatar: json.url })
      } else {
        let error = new Error(json.msg)
        error.json = json
        error.code = json.code
        throw error
      }
      this.refs.uploadAvatar.value = null
    })
    .catch(error => {
      this.props.changeLoadingState(false)
      if (error.code) Tool.alert(error.message)
      console.log(error)
      this.refs.uploadAvatar.value = null
    })
  }

  modifyUserName() {
    hashHistory.push('updateName')
  }

  openSex(e) {
    this.setState({ showSex: true })
  }

  handleSex(sex, e) {
    e.preventDefault()
    this.setState({ selectedSex: sex })
  }

  closeSex(e) {
    e.preventDefault()
    this.setState({
      selectedSex: this.props.profile.info.sex,
      showSex: false,
    })
  }

  submitSex(e) {
    e.preventDefault()
    const { info } = this.props.profile
    const { selectedSex } = this.state
    if (info.sex !== selectedSex) {
      this.props.updateProfile({ sex: selectedSex })
    }
    this.setState({ showSex: false })
  }

  modifyLocation(e) {
    e.preventDefault()
    this.setState({ showAddr: true })
  }

  handleAddrClose() {
    this.setState({ showAddr: false })
  }

  handleAddrChoose(addr) {
    const { province, city } = addr
    this.props.updateProfile({ province: province.name, city: city.name })
    this.setState({ showAddr: false })
  }

  exit(e) {
    e.preventDefault()
    this.props.logout()
  }

  renderMobile(mobile) {
    return `${mobile.slice(0, 3)}****${mobile.slice(7)}`
  }

  render() {
    const { showFixed } = this.props.global
    const { info } = this.props.profile
    const { showAddr, selectedSex, showSex } = this.state
    const address = (() => {
      if (info.province && info.city) {
        return `${info.province} - ${info.city}`
      } else if (info.province) {
        return info.province
      } else if (info.city) {
        return info.city
      } else {
        return '未设置'
      }
    })()

    const sex = {'MALE': '男', 'FEMALE': '女'};

    return (
      <div className="profile-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={() => hashHistory.goBack()}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">个人资料</p>
        </div>
        <div className="user-avatar-box">
          <div data-flex="dir:left cross:center box:justify" className="user-avatar">
            <div className="avatar">
              {info.avatar &&
                <img src={info.avatar} />
              }
            </div>
            <p className="text">修改头像</p>
            <div className="icon go"></div>
          </div>
          <div className="file-inner">
            <label className="file-label" htmlFor="avatarFile"></label>
            <input
              ref="uploadAvatar"
              className="file-input"
              type="file"
              accept="image/*"
              id="avatarFile"
              style={{ position: 'absolute', width: '100%', height: '100%', clip: 'rect(0 0 0 0)' }}
              onChange={this.handleAvatar.bind(this)}/>
          </div>
        </div>
        <div className="input-list">
          <div data-flex="dir:left cross:center box:justify" className="item"  onClick={this.modifyUserName.bind(this)}>
            <p className="key">用户名</p>
            <p className="value">{info.nickName || ''}</p>
            <div className="icon go"></div>
          </div>
          <div data-flex="dir:left cross:center box:justify" className="item"  onClick={this.openSex.bind(this)}>
            <p className="key">性别</p>
            <p className="value">{info.sex ? sex[info.sex] : '未设置'}</p>
            <div className="icon go"></div>
          </div>
          <div data-flex="dir:left cross:center box:justify" className="item"  onClick={this.modifyLocation.bind(this)}>
            <p className="key">所在地</p>
            <p className="value">{address}</p>
            <div className="icon go"></div>
          </div>
        </div>
        <div className="input-list">
          <div data-flex="dir:left cross:center box:first" className="item">
            <p className="key">当前绑定手机</p>
            <p className="value">{info.mobile ? this.renderMobile(info.mobile) : '未设置'}</p>
          </div>
          {/* <div data-flex="dir:left cross:center box:first" className="item"  onClick={this.modifyEmail.bind(this)}>
            <p className="key">邮箱绑定</p>
            <p className="value">{info.email ? info.email : '未设置'}</p>
          </div> */}
        </div>
        <button type="button" className="logout-btn" onClick={this.exit.bind(this)}>退出登录</button>
        {showAddr &&
          <AddressSelector {...this.props} onChoose={this.handleAddrChoose.bind(this)} onClose={this.handleAddrClose.bind(this)}></AddressSelector>
        }
        {showSex &&
          <div className="sex-box">
            <div className="background" onClick={this.closeSex.bind(this)}></div>
            <div className="sex-inner">
              <div className="header">
                <div className="left btn" onClick={this.closeSex.bind(this)}>取消</div>
                <div className="right btn" onClick={this.submitSex.bind(this)}>确定</div>
              </div>
              <div className="body">
                <div className={classNames('item', { selected: selectedSex === 'MALE' })} onClick={this.handleSex.bind(this, 'MALE')}>男</div>
                <div className={classNames('item', { selected: selectedSex === 'FEMALE' })} onClick={this.handleSex.bind(this, 'FEMALE')}>女</div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default template({
  id: 'profile',
  component: Profile,
  url: ''
})
