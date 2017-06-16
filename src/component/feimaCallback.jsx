import React, { Component } from 'react'
import { hashHistory } from 'react-router'

import template from './common/template'

class FeimaCallback extends Component {

  componentWillMount() {
    const { mode, id } = this.props.params
    const { query } = this.props.location
    const amount = (() => {
      if (query.amount) {
        return query.amount
      } else {
        let amountString = query.outTradeNo.split('?')[1]
        return amountString.split('=')[1]
      }
    })()
    hashHistory.replace(`pay?callback=1&id=${id}&mode=${mode}&amount=${amount}&orderjnid=${query.outOrderNo}`)
  }

  render() {
    return <div></div>
  }
}

export default template({
  id: 'feimaCallback',
  component: FeimaCallback,
  url: ''
})
