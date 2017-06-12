import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { is, fromJS } from 'immutable'

import LoadingModal from './loadingModal'

import * as action from '../../redux/action'

const Main = mySetting => {
  let setting = {
    id: '',
    url: '',
    data: {},
    component: <div></div>
  };

  for (let key in mySetting) {
    setting[key] = mySetting[key]
  }

  class Index extends Component {
    static defaultProps = { setting }

    constructor(props, context) {
      super(props, context)
    }

    componentWillMount() {}

    componentDidMount() {
      window.scrollTo(0, 0)
      setTimeout(() => {
        this.props.showPageFixed()
      }, 1500)
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    render() {
      const { showFixed } = this.props.global
      const { loading } = this.props
      return (
        <div>
          <this.props.setting.component {...this.props} state={this.props.state} />
          { loading.enabled &&
            <LoadingModal isFixed={showFixed} />
          }
        </div>
      )
    }
  }

  return connect(state => state, action)(Index)
}

export default Main;
