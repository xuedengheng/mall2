import React, { Component } from 'react'
import { pushPage } from '../../utils/redirect'
import LazyLoad from 'react-lazyload'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class CategoryTemplate extends Component {
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
      <div className="category-template">
        { list.map((item, index) => {
          return (
            <div key={index} className="item" onClick={this.handleClick.bind(this, item)}>
              <div className="pic">
                <LazyLoad throttle={200} height={100}>
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
              <p className="name">{item.title}</p>
            </div>
          )
        }) }
      </div>
    )
  }
}
