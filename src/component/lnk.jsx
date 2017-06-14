import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import template from './common/template'

class Lnk extends Component {

  constructor(props) {
    super(props)
    const { query } = props.location
    const url = query.u ? decodeURIComponent(query.u) : ''
    this.state = { url }
  }

  render() {
    const { query } = this.props.location
    const { url } = this.state
    return (
      <div className="lnk-wrap">
        {query.title &&
          <Helmet>
            <title>{query.title}</title>
          </Helmet>
        }
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
