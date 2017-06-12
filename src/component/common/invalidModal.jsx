import React, { Component } from 'react'
import classNames from 'classnames'

export default class InvalidModal extends Component {

  handleCancel(e) {
    e.preventDefault()
    this.props.onCancel()
  }

  handleConfirm(e) {
    e.preventDefault()
    this.props.onConfirm()
  }

  render() {

    const { list, isFixed } = this.props

    return (
      <div className={classNames('invalid-modal-wrap', { 'be-fixed': isFixed })}>
        <div className="background"></div>
        <div className="modal-inner">
          <p className="invalid-title">抱歉，以下商品已失效</p>
          <div className="invalid-list">
            {list.map((sku, index) => {
              return (
                <div key={index} data-flex="dir:left cross:center box:first" className="item">
                  <div className="pic">
                    <img src={sku.picture} />
                  </div>
                  <div className="info">
                    <p className="name">{sku.productName}</p>
                    <p className="attr">{sku.productAttr && `规格：${sku.productAttr}`}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div data-flex="dir:left cross:center box:mean" className="invalid-btn-wrap">
            <button className="btn cancel" onClick={this.handleCancel.bind(this)}>取消</button>
            <button className="btn" onClick={this.handleConfirm.bind(this)}>移除失效商品</button>
          </div>
        </div>
      </div>
    )
  }
}
