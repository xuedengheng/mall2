import React, { Component } from 'react'
import { pushPage } from '../../utils/redirect'

export default class BrandTemplate extends Component {
  constructor(props) {
    super(props)
  }

  handleClick(item, e) {
    e.preventDefault()
    pushPage(item)
  }

  renderBrand() {
    const { list } = this.props
    const len  = list.length

    return this.renderBrand4()
  }

  renderBrand1() {
    const { list } = this.props
    return (
      <div className="brand-template brand1">
        <div className="left" onClick={this.handleClick.bind(this, list[0])}>
          <img src={list[0].url}/>
        </div>
        <div className="right" onClick={this.handleClick.bind(this, list[1])}>
          <img src={list[1].url}/>
        </div>
      </div>
    )
  }

  renderBrand2() {
    const { list } = this.props
    return (
      <div className="brand-template brand2">
        <div className="left" onClick={this.handleClick.bind(this, list[0])}>
          <img src={list[0].url}/>
        </div>
        <div className="right">
          <div className="item" onClick={this.handleClick.bind(this, list[1])}>
            <img src={list[1].url}/>
          </div>
          <div className="item" onClick={this.handleClick.bind(this, list[2])}>
            <img src={list[2].url}/>
          </div>
        </div>
      </div>
    )
  }

  renderBrand3() {
    const { list } = this.props
    return (
      <div className="brand-template brand3">
        <div className="left" onClick={this.handleClick.bind(this, list[0])}>
          <img src={list[0].url}/>
        </div>
        <div className="right">
          <div className="item1" onClick={this.handleClick.bind(this, list[1])}>
            <img src={list[1].url}/>
          </div>
          <div className="item-inner">
            <div className="item2" onClick={this.handleClick.bind(this, list[2])}>
              <img src={list[2].url}/>
            </div>
            <div className="item3" onClick={this.handleClick.bind(this, list[3])}>
              <img src={list[3].url}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderBrand4() {
    const { list } = this.props
    return (
      <div className="brand-template brand4">
        {list.map((item, index) => {
          return (
            <div key={index} className="item" onClick={this.handleClick.bind(this, item)}>
              <img src={item.url} />
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    const { list } = this.props

    return this.renderBrand()
  }
}
