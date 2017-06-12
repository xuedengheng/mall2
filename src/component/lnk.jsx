import React, { Component } from 'react'

import template from './common/template'

class Lnk extends Component {

  constructor(props) {
    super(props)
    const { query } = props.location
    const url = query.u ? decodeURIComponent(query.u) : ''
    this.state = { url }
  }

  render() {
    const { url } = this.state
    return (
      <div className="lnk-wrap">
        <iframe
          src={url}
          className="frame"
          width={window.innerWidth}
          height={window.innerHeight}
          ></iframe>
      </div>
    )
  }
}

export default template({
    id: 'lnk',
    component: Lnk,
    url: ''
})
