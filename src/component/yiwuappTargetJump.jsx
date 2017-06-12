import React, { Component } from 'react'
import { hashHistory } from 'react-router'

import template from './common/template'

class YiwuappTargetJump extends Component {

  componentWillMount() {
    const { query } = this.props.location
    if (query.target) {
      if (query.target === 'product_detail' && query.identity) {
        hashHistory.replace(`/product/${query.identity}`)
      } else if (query.target === 'brand_search' && query.identity) {
        hashHistory.replace(`/result?brandcodes=${query.identity}`)
      } else if (query.target === 'category_search' && query.identity) {
        hashHistory.replace(`/result?catalogids=${query.identity}`)
      } else if (query.target === 'template' && query.identity) {
        hashHistory.replace(`/showcase/${query.identity}`)
      } else if (query.target === 'url' && query.identity) {
        window.location.replace(query.identity)
      }
    }
  }

  render() {

    return (
      <div></div>
    )
  }
}

export default template({
  id: 'yiwuappTargetJump',
  component: YiwuappTargetJump,
  url: ''
})
