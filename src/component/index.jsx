import React, { Component, PropTypes } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'
import _ from 'lodash'

import template from './common/template'
import FootTab from './common/footTab'

import BannerTemplate from './common/bannerTemplate'
import CategoryTemplate from './common/categoryTemplate'
import RecommendTemplate from './common/recommendTemplate'
import ProductListTemplate from './common/productListTemplate'
import BrandTemplate from './common/brandTemplate'
import FreshTemplate from './common/freshTemplate'
import QualityTemplate from './common/qualityTemplate'
import ChoiceTemplate from './common/choiceTemplate'
import OnsaleTemplate from './common/onsaleTemplate'
import CustomOneTemplate from './common/customOneTemplate'
import CustomTwoTemplate from './common/customTwoTemplate'

function disableScroll(e) {
  e.preventDefault()
}

class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showFixed: false
    }
  }

  componentWillMount() {
    const { showcase } = this.props
    if (showcase.list.length <= 0) {
      this.props.getShowcaseList(true)
    } else {
      this.props.getShowcaseTemplate(showcase.index, true)
    }
  }

  componentDidMount() {
    const { showcase } = this.props
    if (showcase.list.length > 0) {
      let $cateTab = document.querySelector('.category-box')
      let itemLeft = $cateTab.scrollWidth / showcase.list.length
      const index = _.findIndex(showcase.list, item => {
        return item.showcaseId === showcase.index
      })
      if (index >= 0 && index * itemLeft >= window.innerWidth * 0.8) {
        $cateTab.scrollLeft = index * itemLeft
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { showSkuModal } = nextProps.global
    const { wrap } = this.refs
    if (wrap) {
      if (showSkuModal) {
        wrap.addEventListener('touchmove', disableScroll, false)
      } else {
        wrap.removeEventListener('touchmove', disableScroll, false)
      }
    }
  }

  disableScroll(e) {
    e.preventDefault()
  }

  handleTabClick(id) {
    this.props.getShowcaseTemplate(id, true)
    window.scrollTo(0, 0)
  }

  goToSearch(e) {
    e.preventDefault()
    hashHistory.push('search')
  }

  goToCategory(e) {
    e.preventDefault()
    hashHistory.push('category')
  }

  renderTemplates() {
    const { showcase } = this.props

    if (showcase.template) {
      return (
        <div className="recommened-box">
          {showcase.template.components.map((component, index) => {
            if (component.items.length === 0) return <div key={index}></div>
            switch (component.type) {
              case 'banner':
                return <BannerTemplate key={index} {...this.props} list={component.items} ></BannerTemplate>
              case 'category':
                return <CategoryTemplate key={index} {...this.props} list={component.items}></CategoryTemplate>
              case 'recommend':
                return (
                  <div key={index} className="recommened-frag">
                    {component.title &&
                      <div data-flex="main:center cross:center" className="frag-title">
                        <div className="icon decoration1"></div>
                        <p className="text">{component.title}</p>
                        <div className="icon decoration2"></div>
                      </div>
                    }
                    <ProductListTemplate {...this.props} list={component.items}></ProductListTemplate>
                  </div>
                )
              case 'product_list':
                return (
                  <div key={index} className="recommened-frag">
                    {component.title &&
                      <div data-flex="main:center cross:center" className="frag-title">
                        <div className="icon decoration1"></div>
                        <p className="text">{component.title}</p>
                        <div className="icon decoration2"></div>
                      </div>
                    }
                    <RecommendTemplate {...this.props} list={component.items}></RecommendTemplate>
                  </div>
                )
              case 'brand':
                return (
                  <div key={index} className="recommened-frag">
                    {component.title &&
                      <div data-flex="main:center cross:center" className="frag-title">
                        <div className="icon decoration1"></div>
                        <p className="text">{component.title}</p>
                        <div className="icon decoration2"></div>
                      </div>
                    }
                    <BrandTemplate {...this.props} list={component.items}></BrandTemplate>
                  </div>
                )
              case 'fresh':
                return (
                  <div key={index} className="recommened-frag">
                    {component.title &&
                      <div data-flex="main:center cross:center" className="frag-title">
                        <div className="icon decoration1"></div>
                        <p className="text">{component.title}</p>
                        <div className="icon decoration2"></div>
                      </div>
                    }
                    <FreshTemplate {...this.props} list={component.items}></FreshTemplate>
                  </div>
                )
              case 'quality':
                return (
                  <div key={index} className="recommened-frag">
                    {component.title &&
                      <div data-flex="main:center cross:center" className="frag-title">
                        <div className="icon decoration1"></div>
                        <p className="text">{component.title}</p>
                        <div className="icon decoration2"></div>
                      </div>
                    }
                    <QualityTemplate {...this.props} list={component.items}></QualityTemplate>
                  </div>
                )
              case 'choice':
                return (
                  <div key={index} className="recommened-frag">
                    {component.title &&
                      <div data-flex="main:center cross:center" className="frag-title">
                        <div className="icon decoration1"></div>
                        <p className="text">{component.title}</p>
                        <div className="icon decoration2"></div>
                      </div>
                    }
                    <ChoiceTemplate {...this.props} list={component.items}></ChoiceTemplate>
                  </div>
                )
              case 'on_sale':
                return (
                  <div key={index} className="recommened-frag">
                    {component.title &&
                      <div data-flex="main:center cross:center" className="frag-title">
                        <div className="icon decoration1"></div>
                        <p className="text">{component.title}</p>
                        <div className="icon decoration2"></div>
                      </div>
                    }
                    <OnsaleTemplate key={index} {...this.props} list={component.items}></OnsaleTemplate>
                  </div>
                )
              case 'custom_component_1':
                return (
                  <div key={index} className="recommened-frag">
                    {component.title &&
                      <div data-flex="main:center cross:center" className="frag-title">
                        <div className="icon decoration1"></div>
                        <p className="text">{component.title}</p>
                        <div className="icon decoration2"></div>
                      </div>
                    }
                    <CustomOneTemplate key={index} {...this.props} list={component.items}></CustomOneTemplate>
                  </div>
                )
              case 'custom_component_2':
                return (
                  <div key={index} className="recommened-frag">
                    {component.title &&
                      <div data-flex="main:center cross:center" className="frag-title">
                        <div className="icon decoration1"></div>
                        <p className="text">{component.title}</p>
                        <div className="icon decoration2"></div>
                      </div>
                    }
                    <CustomTwoTemplate key={index} {...this.props} list={component.items}></CustomTwoTemplate>
                  </div>
                )
              default:
                return undefined
            }
          })}
        </div>
      )
    } else {
      return undefined
    }
  }

  render() {
    const itemWidth = 1.7
    const { showcase } = this.props
    const { showFixed } = this.props.global
    const fontSize = parseFloat(document.querySelector('html').style.fontSize)
    const len = showcase.list.length
    const categoryWidth = window.innerWidth >= itemWidth * fontSize * len ? '100%' : `${itemWidth * len + 0.2}rem`
    const categoryItemWidth = window.innerWidth >= itemWidth * fontSize * len ? `${100 / len}%` : `${itemWidth}rem`

    return (
      <div className="dashboard-wrap" ref="wrap">
        <div
          data-flex="dir:left cross:center box:last"
          className="search-box"
          style={{ position: showFixed ? 'fixed' : 'absolute' }}>
          <div className="input-inner" onClick={this.goToSearch.bind(this)}>
            <div className="icon search"></div>
            <div className="search-input">寻觅好物</div>
          </div>
          <div className="icon category" onClick={this.goToCategory.bind(this)}></div>
        </div>
        <div
          className="category-box"
          style={{ position: showFixed ? 'fixed' : 'absolute' }}>
          <div className="category-inner" ref="showcaseList" style={{ width: categoryWidth }}>
            { showcase.list.map((item) =>
              <div
                key={item.showcaseId}
                className={classNames('item', { selected: item.showcaseId === showcase.index })}
                style={{ width: categoryItemWidth }}
                onClick={this.handleTabClick.bind(this, item.showcaseId)}
              >{item.showcaseName}</div>
            ) }
          </div>
        </div>
        {this.renderTemplates()}
        <FootTab index="0" isFixed={showFixed}></FootTab>
      </div>
    )
  }
}

export default template({
  id: 'index',
  component: Main,
  url: ''
})
