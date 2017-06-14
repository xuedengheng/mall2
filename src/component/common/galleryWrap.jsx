import React, { Component } from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import Carousel from 'nuka-carousel'
import LazyLoad from 'react-lazyload'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class GalleryWrap extends Component {

  handleClose(e) {
    e.preventDefault()
    this.props.onClose()
  }

  renderPictures() {
    const { pictures } = this.props

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

    return pictures.length > 1 ? (
      <Carousel cellAlign="center" decorators={decorators} wrapAround={true}>
        { pictures.map((url, index) => {
          return (
            <div key={index}>
              <LazyLoad throttle={200} height={200}>
                <ReactCSSTransitionGroup key="1"
                  transitionName="fade"
                  transitionAppear={true}
                  transitionAppearTimeout={500}
                  transitionEnter={false}
                  transitionLeave={false}>
                  <img
                    src={url}
                    onLoad={() => { window.dispatchEvent(new Event('resize')) }} />
                </ReactCSSTransitionGroup>
              </LazyLoad>
            </div>
          )
        }) }
      </Carousel>
    ) : (
      <div className="only-item">
        <LazyLoad throttle={200} height={200}>
          <ReactCSSTransitionGroup key="1"
            transitionName="fade"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnter={false}
            transitionLeave={false}>
            <img src={pictures[0]} />
          </ReactCSSTransitionGroup>
        </LazyLoad>
      </div>
    )
  }

  render() {
    const { pictures } = this.props

    return (
      <div className="carousel-wrap" onClick={this.handleClose.bind(this)}>
        {pictures && pictures.length > 0 ? this.renderPictures() : <div></div>}
      </div>
    )
  }
}
