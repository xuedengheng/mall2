import React, { Component } from 'react'
import LazyLoad from 'react-lazyload'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { pushPage } from '../../utils/redirect'
import moment from 'moment'

moment.locale('zh-cn')

export default class OnsaleTemplate extends Component {
  constructor(props) {
    super(props)
    this.timer = null
    this.state = {
      now: moment()
    }
  }

  componentDidMount() {
    const { detail } = this.props.order
    this.timer = setInterval(() => {
      this.setState({ now: moment() })
    }, 1000)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  handleClick(item, startDiff, endDiff, e) {
    e.preventDefault()
    if (startDiff <= 0 && endDiff >= 0) {
      pushPage(item)
    } else {
      return false
    }
  }

  formateDuration(duration) {
    return `${duration.days()}日${duration.hours()}时${duration.minutes()}分${duration.seconds()}秒`
  }

  render() {
    const { list } = this.props
    const { now } = this.state

    return (
      <div className="onsale-template">
        { list.map((item, index) => {
          const startDuration = moment.duration(moment(item.start).diff(now))
          const endDuration = moment.duration(moment(item.end).diff(now))
          const startDiff = startDuration.asMilliseconds()
          const endDiff = endDuration.asMilliseconds()
          const text = (() => {
            if (startDiff > 0) {
              return '距活动开始还剩 '
            } else if (startDiff <= 0 && endDiff >= 0) {
              return '距活动结束还剩 '
            } else if (endDiff < 0) {
              return '活动已结束'
            } else {
              return ''
            }
          })()
          const timeText = (() => {
            if (startDiff > 0) {
              return this.formateDuration(startDuration)
            } else if (startDiff <= 0 && endDiff >= 0) {
              return this.formateDuration(endDuration)
            } else {
              return ''
            }
          })()
          return (
            <div key={index} className="item">
              <div className="pic" onClick={this.handleClick.bind(this, item, startDiff, endDiff)}>
                <LazyLoad throttle={200} height={200}>
                  <ReactCSSTransitionGroup key="1"
                    transitionName="fade"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <img src={item.url} />
                  </ReactCSSTransitionGroup>
                </LazyLoad>
              </div>
              <p className="title">{item.title}</p>
              <p className="time">{text + timeText}</p>
            </div>
          )
        }) }
      </div>
    )
  }
}
