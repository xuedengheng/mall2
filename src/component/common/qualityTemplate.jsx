import React, { Component } from 'react'
import LazyLoad from 'react-lazyload'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { pushPage } from '../../utils/redirect'

export default class QualityTemplate extends Component {
  constructor(props) {
    super(props)
  }

  handleClick(item, e) {
    e.preventDefault()
    pushPage(item)
  }

  render() {
    const { list } = this.props

    return (
      <div className="quality-template">
        <div className="above">
          {list[0] ? (
            <div className="above-item" onClick={this.handleClick.bind(this, list[0])}>
              <LazyLoad throttle={200} height={200}>
                <ReactCSSTransitionGroup key="1"
                  transitionName="fade"
                  transitionAppear={true}
                  transitionAppearTimeout={500}
                  transitionEnter={false}
                  transitionLeave={false}>
                  <img src={list[0].url} />
                </ReactCSSTransitionGroup>
              </LazyLoad>
            </div>
          ) : (
            <div className="above-item"></div>
          )}
          {list[1] ? (
            <div className="above-item" onClick={this.handleClick.bind(this, list[1])}>
              <LazyLoad throttle={200} height={200}>
                <ReactCSSTransitionGroup key="1"
                  transitionName="fade"
                  transitionAppear={true}
                  transitionAppearTimeout={500}
                  transitionEnter={false}
                  transitionLeave={false}>
                  <img src={list[1].url} />
                </ReactCSSTransitionGroup>
              </LazyLoad>
            </div>
          ) : (
            <div className="above-item"></div>
          )}
        </div>
        <div className="below">
          {list[2] ? (
            <div className="below-item" onClick={this.handleClick.bind(this, list[2])}>
              <LazyLoad throttle={200} height={100}>
                <ReactCSSTransitionGroup key="1"
                  transitionName="fade"
                  transitionAppear={true}
                  transitionAppearTimeout={500}
                  transitionEnter={false}
                  transitionLeave={false}>
                  <img src={list[2].url} />
                </ReactCSSTransitionGroup>
              </LazyLoad>
            </div>
          ) : (
            <div className="below-item"></div>
          )}
          {list[3] ? (
            <div className="below-item" onClick={this.handleClick.bind(this, list[3])}>
              <LazyLoad throttle={200} height={100}>
                <ReactCSSTransitionGroup key="1"
                  transitionName="fade"
                  transitionAppear={true}
                  transitionAppearTimeout={500}
                  transitionEnter={false}
                  transitionLeave={false}>
                  <img src={list[3].url} />
                </ReactCSSTransitionGroup>
              </LazyLoad>
            </div>
          ) : (
            <div className="below-item"></div>
          )}
          {list[4] ? (
            <div className="below-item" onClick={this.handleClick.bind(this, list[4])}>
              <LazyLoad throttle={200} height={100}>
                <ReactCSSTransitionGroup key="1"
                  transitionName="fade"
                  transitionAppear={true}
                  transitionAppearTimeout={500}
                  transitionEnter={false}
                  transitionLeave={false}>
                  <img src={list[4].url} />
                </ReactCSSTransitionGroup>
              </LazyLoad>
            </div>
          ) : (
            <div className="below-item"></div>
          )}
          {list[5] ? (
            <div className="below-item" onClick={this.handleClick.bind(this, list[5])}>
              <LazyLoad throttle={200} height={100}>
                <ReactCSSTransitionGroup key="1"
                  transitionName="fade"
                  transitionAppear={true}
                  transitionAppearTimeout={500}
                  transitionEnter={false}
                  transitionLeave={false}>
                  <img src={list[5].url} />
                </ReactCSSTransitionGroup>
              </LazyLoad>
            </div>
          ) : (
            <div className="below-item"></div>
          )}
        </div>
      </div>
    )
  }
}
