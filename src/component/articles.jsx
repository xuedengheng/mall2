import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'
import LazyLoad from 'react-lazyload'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ReactPullLoad, { STATS } from 'react-pullload'

import FootTab from './common/footTab'
import template from './common/template'

class Articles extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hasMore: true,
      action: STATS.init
    }
  }

  componentWillMount() {
    this.props.getArticles()
  }

  handleAction(action) {
    if (action === this.state.action) return false

    if (action === STATS.refreshing) {
      this.handRefreshing()
    } else if (action === STATS.loading) {
      this.handLoadMore()
    } else{
      this.setState({ action: action })
    }
  }

  handRefreshing() {
    const { action } = this.state
    if (STATS.refreshing === action) return false
    this.props.getArticles()
    .then(json => {
      if (json && json.success) {
        setTimeout(() => {
          const hasMore = json.total > this.props.article.list.length
          this.setState({
            hasMore,
            action: STATS.refreshed
          })
        })
      }
    })
    .catch(() => {
      this.setState({
        hasMore: true,
        action: STATS.refreshed
      })
    })
    this.setState({ action: STATS.refreshing })
  }

  handLoadMore() {
    const { action } = this.state
    const { page } = this.props.article
    if (STATS.loading === action) return false
    this.props.getArticles(page + 1)
    .then(json => {
      if (json && json.success) {
        const hasMore = json.total > this.props.article.list.length
        this.setState({
          hasMore,
          action: STATS.refreshed
        })
      }
    })
    .catch(() => {
      this.setState({
        hasMore: true,
        action: STATS.reset
      })
    })
    this.setState({ action: STATS.loading })
  }

  handleClick(id) {
    hashHistory.push(`article/${id}`)
  }

  render() {
    const { article } = this.props
    const { showFixed } = this.props.global
    const { action, hasMore } = this.state

    return (
      <div className="articles-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <p className="page-title">生活</p>
        </div>
        <ReactPullLoad
          downEnough={100}
          action={action}
          handleAction={this.handleAction.bind(this)}
          hasMore={hasMore}
          distanceBottom={100}
          >
            {article.list.map((item, index) => {
              return (
                <div key={index} className="article-box" onClick={this.handleClick.bind(this, item.id)}>
                  <div className="pic">
                    <LazyLoad throttle={200} height={200}>
                      <ReactCSSTransitionGroup key="1"
                        transitionName="fade"
                        transitionAppear={true}
                        transitionAppearTimeout={500}
                        transitionEnter={false}
                        transitionLeave={false}>
                        <img src={item.picture} />
                      </ReactCSSTransitionGroup>
                    </LazyLoad>
                  </div>
                  <div className="info">
                    <p className="title">
                      <span className="quote">“</span>
                      {item.title}”
                    </p>
                    <p className="digest">{item.digest}</p>
                    <p className="tag">
                      <span className="name">{item.catalog.name}</span>
                      <span className="time">{item.publishDate}</span>
                    </p>
                  </div>
                </div>
              )
            })}
        </ReactPullLoad>
        <FootTab index="1" isFixed={showFixed}></FootTab>
      </div>
    )
  }
}

export default template({
  id: 'acticles',
  component: Articles,
  url: ''
})
