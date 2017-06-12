import React, { Component } from 'react'
import Carousel from 'nuka-carousel'
import LazyLoad from 'react-lazyload'
import classNames from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { pushPage } from '../../utils/redirect'

export default class BannerTemplate extends Component {

  mixins: [Carousel.ControllerMixin]

  constructor(props) {
    super(props)
  }

  handleClick(item, e) {
    e.preventDefault()
    pushPage(item)
  }

  render() {
    const { list } = this.props

    const params = {
      pagination: '.swiper-pagination',
      autoplay: 4000,
      autoplayDisableOnInteraction: false,
      loop: true
    }

    const decorators = [{
      component: React.createClass({
        render() {
          const dotArr = new Array(this.props.slideCount).fill('')
          return (
            <div className="banner-carousel-dots">
              {dotArr.map((item, index) => {
                return (
                  <div key={index} className={classNames('dot', { 'dot-active': this.props.currentSlide === index })}>
                    <span></span>
                  </div>
                )
              })}
            </div>
          )
        }
      }),
      position: 'BottomCenter'
    }]

    return list.length === 1 ? (
      <LazyLoad throttle={200} height={200}>
        <ReactCSSTransitionGroup key="1"
          transitionName="fade"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnter={false}
          transitionLeave={false}>
          <img
            src={list[0].url}
            style={{ display: 'block', width: '100%' }}
            onClick={this.handleClick.bind(this, list[0])} />
        </ReactCSSTransitionGroup>
      </LazyLoad>
    ) : (
      <Carousel autoplay={true} autoplayInterval={3000} decorators={decorators} wrapAround={true}>
        { list.map((item, index) => {
          return (
            <div key={index} onClick={this.handleClick.bind(this, item)}>
              <LazyLoad throttle={200} height={200}>
                <ReactCSSTransitionGroup key="1"
                  transitionName="fade"
                  transitionAppear={true}
                  transitionAppearTimeout={500}
                  transitionEnter={false}
                  transitionLeave={false}>
                  <img src={item.url} onLoad={() => { window.dispatchEvent(new Event('resize')) }} />
                </ReactCSSTransitionGroup>
              </LazyLoad>
            </div>
          )
        }) }
      </Carousel>
    )
  }
}
