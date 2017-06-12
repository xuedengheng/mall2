import React, { Component } from 'react'
import classNames from 'classnames'

export default class AttentionModal extends Component {

  handleClose(e) {
    e.preventDefault()
    this.props.onClose()
  }

  render() {
    const { isFixed } = this.props
    return (
      <div className={classNames('attention-modal-wrap', { 'be-fixed': isFixed })}>
        <div className="background" onClick={this.handleClose.bind(this)}></div>
        <div className="attention-modal">
          <div className="info-box">
            <div className="qr-code">
              <img src={require('../../images/mine_icode.png')} />
            </div>
            <p className="tips">微信号：<span className="bold">易物研选</span></p>
          </div>
          <div className="cancel-btn" onClick={this.handleClose.bind(this)}>取消</div>
        </div>
      </div>
    )
  }
}
