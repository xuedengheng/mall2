import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'

import template from './common/template'

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

class Showcase extends Component {

  componentWillMount() {
    this.props.getShowcaseTemplate(this.props.params.id)
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

  goBack(e) {
    e.preventDefault()
    hashHistory.goBack()
  }

  renderTemplates() {
    const { showcase } = this.props

    if (showcase.template) {
      return (
        <div className="recommened-box">
          {showcase.template.components.map((component, index) => {
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
    const { showFixed } = this.props.global
    const { template } = this.props.showcase

    return (
      <div className="showcase-wrap" ref="wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.goBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">{template ? template.title : ''}</p>
        </div>
        {this.renderTemplates()}
      </div>
    )
  }
}

export default template({
  id: 'showcase',
  component: Showcase,
  url: ''
})
