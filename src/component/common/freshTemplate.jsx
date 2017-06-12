import React, { Component } from 'react'
import LazyLoad from 'react-lazyload'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { pushPage } from '../../utils/redirect'

export default class FreshTemplate extends Component {
  constructor(props) {
    super(props)
  }

  handleClick(item, e) {
    e.preventDefault()
    pushPage(item)
  }

  render() {
    const { list } = this.props

    return list.length > 0 ? (
      <div className="brand-template brand3">
        <div className="left" onClick={this.handleClick.bind(this, list[0])}>
          <LazyLoad throttle={200} height={200}>
            <ReactCSSTransitionGroup key="1"
              transitionName="fade"
              transitionAppear={true}
              transitionAppearTimeout={500}
              transitionEnter={false}
              transitionLeave={false}>
              <img src={list[0].url}/>
            </ReactCSSTransitionGroup>
          </LazyLoad>
        </div>
        {list.length > 1 &&
          <div className="right">
            <div className="item1" onClick={this.handleClick.bind(this, list[1])}>
              <LazyLoad throttle={200} height={200}>
                <ReactCSSTransitionGroup key="1"
                  transitionName="fade"
                  transitionAppear={true}
                  transitionAppearTimeout={500}
                  transitionEnter={false}
                  transitionLeave={false}>
                  <img src={list[1].url}/>
                </ReactCSSTransitionGroup>
              </LazyLoad>
            </div>
            {list.length > 2 &&
              <div className="item-inner">
                <div className="item2" onClick={this.handleClick.bind(this, list[2])}>
                  <LazyLoad throttle={200} height={100}>
                    <ReactCSSTransitionGroup key="1"
                      transitionName="fade"
                      transitionAppear={true}
                      transitionAppearTimeout={500}
                      transitionEnter={false}
                      transitionLeave={false}>
                      <img src={list[2].url}/>
                    </ReactCSSTransitionGroup>
                  </LazyLoad>
                </div>
                {list.length > 3 &&
                  <div className="item3" onClick={this.handleClick.bind(this, list[3])}>
                    <LazyLoad throttle={200} height={100}>
                      <ReactCSSTransitionGroup key="1"
                        transitionName="fade"
                        transitionAppear={true}
                        transitionAppearTimeout={500}
                        transitionEnter={false}
                        transitionLeave={false}>
                        <img src={list[3].url}/>
                      </ReactCSSTransitionGroup>
                    </LazyLoad>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    ) : (
      <div></div>
    )
  }
}
