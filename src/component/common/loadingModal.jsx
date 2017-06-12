import React, { Component } from 'react'
import classNames from 'classnames'

export default class LoadingModal extends Component {

  render() {
    const { isFixed } = this.props

    return (
      <div className={classNames('loading-modal-wrap', { 'be-fixed': isFixed })}>
        <div className="background"></div>
        <div className="loading-box"></div>
      </div>
    )
  }
}
