import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'

import storage from '../utils/storage'

import template from './common/template'

const searchKey = 'ywyx_search'

class Search extends Component {

  constructor(props) {
    super(props)
    this.state = {
      search: '',
      history: []
    }
  }

  componentWillMount() {
    const history = storage.get(searchKey)
    if (history) {
      this.setState({ history })
    }
  }

  goBack() {
    hashHistory.goBack()
  }

  bindSearch(e) {
    this.setState({ search: e.target.value })
  }

  handleSearch(e) {
    const { search, history } = this.state
    if (search.trim() !== '') {
      if (history.indexOf(search) < 0) {
        const newHistory = history.concat(search)
        storage.set(searchKey, newHistory)
      }
      hashHistory.push(`result?from=search&names=${encodeURIComponent(search)}`)
    }
  }

  searchHistory(history, e) {
    e.preventDefault()
    hashHistory.push(`result?from=search&names=${encodeURIComponent(history)}`)
  }

  delHistory(e) {
    e.preventDefault()
    if (this.state.history.length === 0) return false
    const confirm = window.confirm('确认删除搜索记录？')
    if (confirm) {
      storage.remove(searchKey)
      this.setState({ history: [] })
    }
  }

  render() {
    const { showFixed } = this.props.global
    const { history } = this.state

    return (
      <div className="search-wrap">
        <div
          data-flex="dir:left cross:center box:last"
          className="input-box">
          <div className="input-inner">
            <div className="search icon"></div>
            <input
              type="search"
              className="search-input"
              placeholder="商品名 品牌 分类"
              value={this.state.search}
              onChange={this.bindSearch.bind(this)}
              onInput={this.bindSearch.bind(this)}
              onBlur={this.handleSearch.bind(this)} />
          </div>
          <div className="cancel-btn" onClick={this.goBack.bind(this)}>取消</div>
        </div>
        <div className="history-box">
          <div data-flex="dir:left cross:center box:justify" className="title">
            <div className="search icon"></div>
            <p className="text">搜索历史</p>
            <div className="trash icon" onClick={this.delHistory.bind(this)}></div>
          </div>
          <div className="history-inner">
            {history.map((item, index) => {
              return (
                <div
                  key={index}
                  data-flex="dir:left cross:center box:justify"
                  className="item"
                  onClick={this.searchHistory.bind(this, item)}
                  >
                  <div className="history icon"></div>
                  <p className="text">{item}</p>
                  <div className="go icon"></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default template({
  id: 'search',
  component: Search,
  url: ''
})
