import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'

import template from './common/template'

class SubCategory extends Component {

  constructor(props) {
    super(props)
    const name = props.location.query.name ? decodeURIComponent(props.location.query.name) : ''
    this.state = {
      title: name
    }
  }

  componentWillMount() {
    this.props.getSubCategoryList(this.props.params.id)
  }

  goToResult(id, e) {
    hashHistory.push(`result?catalogids=${id}`)
  }

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  render() {
    const { showFixed } = this.props.global
    const { subCategories } = this.props.category
    const { title } = this.state

    return (
      <div className="subCategory-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">{title}</p>
        </div>
        {subCategories.map((category) => {
          return (
            <div key={category.categoryId} className="category-box">
              <div className="title">
                <i className="icon category"></i>
                {category.categoryName}
              </div>
              <div className="list">
                {category.categoryInfos.map((item) => {
                  return (
                    <div key={item.categoryId} className="item" onClick={this.goToResult.bind(this, item.categoryId)}>
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
        })}
      </div>
    )
  }
}

export default template({
  id: 'subCategory',
  component: SubCategory,
  url: ''
})
