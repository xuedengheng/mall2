import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'

export default class FooterTab extends Component {
  constructor(props) {
    super(props)
  }

  switchTab(tab) {
    switch (tab) {
      case '0':
        hashHistory.push('/')
        break
      case '1':
        hashHistory.push('/articles')
        break
      case '2':
        hashHistory.push('/cart')
        break
      case '3':
        hashHistory.push('/mine')
        break
      default:
        break
    }
  }

  render() {
    const { isFixed } = this.props
    return (
      <div
        data-flex="dir:left main:center box:mean"
        className="footerTab-wrap"
        style={{ position: isFixed ? 'fixed' : 'absolute' }}
        >
        <div className={classNames('item', { active: this.props.index === '0' })} onClick={this.switchTab.bind(this, '0')}>
          <div className="icon homepage"></div>
          <p className="name">首页</p>
        </div>
        <div className={classNames('item', { active: this.props.index === '1' })} onClick={this.switchTab.bind(this, '1')}>
          <div className="icon life"></div>
          <p className="name">生活</p>
        </div>
        <div className={classNames('item', { active: this.props.index === '2' })} onClick={this.switchTab.bind(this, '2')}>
          <div className="icon cart"></div>
          <p className="name">购物车</p>
        </div>
        <div className={classNames('item', { active: this.props.index === '3' })} onClick={this.switchTab.bind(this, '3')}>
          <div className="icon mine"></div>
          <p className="name">我</p>
        </div>
      </div>
    )
  }
}

FooterTab.propTypes = {
  index: React.PropTypes.string,
  router: React.PropTypes.object
}

FooterTab.defaultProps = {
  index: '0'
}
