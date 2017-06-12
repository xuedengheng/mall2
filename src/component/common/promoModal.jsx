import React, { Component } from 'react'
import classNames from 'classnames'

export default class PromoModal extends Component {

  handleClose(e) {
    e.preventDefault()
    this.props.onClose()
  }

  render() {
    const { list, isFixed } = this.props

    return (
      <div className={classNames('promo-modal-wrap', { 'be-fixed': isFixed })}>
        <div className="background" onClick={this.handleClose.bind(this)}></div>
        <div className="promo-modal">
          <button type="button" className="close-btn" onClick={this.handleClose.bind(this)}></button>
          <p className="promo-title">优惠</p>
          <div className="promo-list">
            { list.map((item, index) => {
              return (
                <div key={index} data-flex="dir:left box:first" className="item">
                  <div className="label-box"><div className="label">{item.label}</div></div>
                  <div className="info">
                    <p className="name">{item.name}</p>
                    <p className="desc">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}
