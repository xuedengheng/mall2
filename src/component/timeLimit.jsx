import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'
import moment from 'moment'

import template from './common/template'

class TimeLimit extends React.Component {

  constructor(props) {
    super(props)
    this.timer = null
    this.state = {
      recentIndex: -1,
      selectedIndex: -1,
      now: moment()
    }
  }

  componentWillMount() {
    const { now } = this.state
    const promise = this.props.getTimeLimitList()
    if (promise) {
      promise.then(json => {
        if (json && json.success && json.activities.length > 0) {
          const list = json.activities
          let duration = 0
          let recentIndex = -1
          for (let i = 0, len = list.length; i < len; i++) {
            const start = moment(list[i].start)
            const end = moment(list[i].end)
            let newDuration = 0
            if (i === 0) {
              duration = now.unix() - start.unix()
              recentIndex = i
            } else {
              newDuration = now.unix() - start.unix()
              if (duration >= newDuration && newDuration >= 0) {
                duration = newDuration
                recentIndex = i
              }
            }
          }
          this.getTimeLimitDetail(json.activities[recentIndex].id)
          this.setState({
            recentIndex,
            selectedIndex: recentIndex
          })
        }
      })
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ now: moment() })
    }, 1000)
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  getTimeLimitDetail(id) {
    this.props.changeLoadingState(true)
    const promise = this.props.getTimeLimitDetail(id)
    if (promise) {
      promise.then(json => {
        this.props.changeLoadingState(false)
        if (json && json.success) {}
      })
    } else {
      this.props.changeLoadingState(false)
    }
  }

  selectActivity(index, item, e) {
    e.preventDefault()
    const { selectedIndex } = this.state
    if (index === selectedIndex) return false
    this.getTimeLimitDetail(item.id)
    this.setState({ selectedIndex: index })
  }

  formatTime(num) {
    return num >= 10 ? num : `0${num}`
  }

  goToProduct(product, e) {
    e.preventDefault()
    hashHistory.push(`/product/${product.code}`)
  }

  renderItemStatus(item) {
    const { now, recentIndex } = this.state
    const { timeLimitList } = this.props.activity
    const start = moment(item.start)
    const end = moment(item.end)
    if (recentIndex >= 0 && timeLimitList[recentIndex].id === item.id) {
      return '进行中'
    } else if (now.unix() < start.unix()) {
      return '准时开启'
    } else if (now.unix() >= start.unix() && now.unix() < end.unix()) {
      return '已开始'
    } else if (now.unix() >= end.unix()) {
      return '已结束'
    }
  }

  renderClock() {
    const { timeLimitDetail } = this.props.activity
    const { now } = this.state

    if (timeLimitDetail) {
      const start = moment(timeLimitDetail.start)
      const end = moment(timeLimitDetail.end)
      const text = now.unix() < start.unix() ? '开始' : '结束'
      const duration = now.unix() < start.unix() ? moment.duration(now.diff(start)) : moment.duration(end.diff(now))

      if (now.unix() >= end.unix()) {
        window.location.reload()
      }

      return (
        <div className="clock-box">
          <p className="clock-text">
            距{text}还有
            <span className="bold">{ this.formatTime(Math.abs(duration.days())) }</span>天
            <span className="bold">{ this.formatTime(Math.abs(duration.hours())) }</span>:
            <span className="bold">{ this.formatTime(Math.abs(duration.minutes())) }</span>:
            <span className="bold">{ this.formatTime(Math.abs(duration.seconds())) }</span>
          </p>
        </div>
      )
    } else {
      return <div></div>
    }
  }

  renderProduct() {
    const { timeLimitDetail } = this.props.activity

    if (timeLimitDetail) {
      const status = this.renderItemStatus(timeLimitDetail)

      return (
        <div className="product-list">
          {timeLimitDetail.products.map((product, index) => {
            const maxPrice = _.maxBy(product.skus, sku => sku.salePrice).salePrice
            const minPrice = _.minBy(product.skus, sku => sku.activityPrice).activityPrice

            return (
              <div
                key={index}
                data-flex="dir:left box:first"
                className="product"
                onClick={this.goToProduct.bind(this, product)}
                >
                <div className="pic">
                  <img src={product.picture} />
                </div>
                <div className="info">
                  <p className="name">{product.name}</p>
                  <p className="desc">{product.description}</p>
                  <p className="price">¥{minPrice.toFixed(2)}<span className="origin">¥{maxPrice.toFixed(2)}</span></p>
                  <p className="num">限购{product.buyUpNum}件</p>
                  <div className="status">{status}</div>
                </div>
              </div>
            )
          })}
        </div>
      )
    } else {
      return <div></div>
    }
  }

  render() {
    const itemWidth = 1.5
    const { showFixed } = this.props.global
    const { timeLimitList, timeLimitDetail } = this.props.activity
    const { selectedIndex } = this.state
    const fontSize = parseFloat(document.querySelector('html').style.fontSize)
    const len = timeLimitList.length
    const timeWidth = window.innerWidth >= itemWidth * fontSize * len ? '100%' : `${itemWidth * len}rem`
    const timeItemWidth = window.innerWidth >= itemWidth * fontSize * len ? `${100 / len}%` : `${itemWidth}rem`

    return (
      <div className="time-limit-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">限时购</p>
        </div>
        {len > 0 &&
          <div className="time-tab">
            <div className="tab-inner" style={{ width: timeWidth }}>
              {timeLimitList.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={classNames('tab-item', { selected: index === selectedIndex })}
                    style={{ width: timeItemWidth }}
                    onClick={this.selectActivity.bind(this, index, item)}
                    >
                    <p className="time">{moment(item.start).format('HH:mm')}</p>
                    <p className="status">{this.renderItemStatus(item)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        }
        <div className="banner">
          <img src={require('../images/timelimited_banner.png')} />
        </div>
        {this.renderClock()}
        {this.renderProduct()}
      </div>
    )
  }
}

export default template({
  id: 'timeLimit',
  component: TimeLimit,
  url: ''
})
