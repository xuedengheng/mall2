import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'
import LazyLoad from 'react-lazyload'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import template from './common/template'


class Article extends Component {

  componentWillMount() {
    this.props.getArticleDetail(this.props.params.id)
  }

  goBack() {
    hashHistory.goBack()
  }

  render() {
    const { detail } = this.props.article
    const { showFixed } = this.props.global

    return (
      <div className="article-wrap">
        <div id="EWHiddenElement" className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">{ detail ? detail.title : '' }</p>
        </div>
        <div className="banner-box">
          <LazyLoad throttle={200} height={200}>
            <ReactCSSTransitionGroup key="1"
              transitionName="fade"
              transitionAppear={true}
              transitionAppearTimeout={500}
              transitionEnter={false}
              transitionLeave={false}>
              <img src={ detail ? detail.picture : '' } />
            </ReactCSSTransitionGroup>
          </LazyLoad>
        </div>
        <p className="info-box">
          <span className="tag">{ detail ? detail.catalog.name : '' }</span>
          <span className="time">{ detail ? detail.publishDate : '' }</span>
        </p>
        <p className="title">{ detail ? detail.title : '' }</p>
        {detail &&
          <div className="content-box" dangerouslySetInnerHTML={{ __html: detail.content }}></div>
        }
      </div>
    )
  }
}

export default template({
  id: 'acticle',
  component: Article,
  url: ''
})
