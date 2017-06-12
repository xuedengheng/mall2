import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'

import template from './common/template'

class Category extends Component {

  componentWillMount() {
    this.props.getCategoryList()
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  goToSubCategory(id, name, e) {
    e.preventDefault()
    hashHistory.push(`category/${id}?name=${encodeURIComponent(name)}`)
  }

  goToSearch(e) {
    e.preventDefault()
    hashHistory.push('search')
  }

  render() {
    const { categories } = this.props.category
    const { showFixed } = this.props.global

    return (
      <div className="category-wrap">
        <div
          data-flex="dir:left cross:center box:first"
          className="search-box">
          <div className="icon back" onClick={this.goBack.bind(this)}></div>
          <div className="input-inner" onClick={this.goToSearch.bind(this)}>
            <div className="search icon"></div>
            <div className="search-input">商品名 品牌 分类</div>
          </div>
        </div>
        <div className="category-title">
          <i className="icon category"></i>
          <p className="text">商品类目</p>
        </div>
        <div className="category-list">
          {categories.map((item, index) => {
            return (
              <div key={index} className="item" onClick={this.goToSubCategory.bind(this, item.categoryId, item.categoryName)}>
                <div className="pic">
                  <img src={item.picture} />
                </div>
                <p className="name">{item.categoryName}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default template({
  id: 'category',
  component: Category,
  url: ''
})
