import React, { Component } from 'react'
import classNames from 'classnames'

export default class ConfirmModal extends Component {

  handleCancel(e) {
    e.preventDefault()
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  handleConfirm(e) {
    e.preventDefault()
    const { onConfirm } = this.props
    onConfirm && onConfirm()
  }

  render() {
    const { isFixed, tips, subTips, onCancel, onConfirm, cencelBtnText, confirmBtnText } = this.props
    return (
      <div className={classNames('confirm-modal-wrap', { 'be-fixed': isFixed })}>
        <div className="background"></div>
        <div className="modal-inner">
          <div className="confirm-tips-wrap">
            <div className={classNames('confirm-tips', { only: !subTips })}>{tips}</div>
            { subTips &&
              <div className="confirm-sub-tips">{subTips}</div>
            }
          </div>
          { onCancel &&
            <div data-flex="dir:left cross:center box:mean" className="confirm-btn-wrap">
              <button className="btn cancel" onClick={this.handleCancel.bind(this)}>{ cencelBtnText || '取消' }</button>
              <button className="btn" onClick={this.handleConfirm.bind(this)}>{ confirmBtnText || '确认' }</button>
            </div>
          }
          { !onCancel &&
            <button className="confirm-btn" onClick={this.handleConfirm.bind(this)}>{ confirmBtnText || '确认' }</button>
          }
        </div>
      </div>
    )
  }
}
