import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'

import storage from '../utils/storage'

import template from './common/template'
import ConfirmModal from './common/confirmModal'

const searchKey = 'ywyx_search'

const SEARCH_KEY_LIMIT = 10

class Search extends Component {

  constructor(props) {
    super(props)
    this.state = {
      search: '',
      history: [],
      isShowTrash: false
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
    e.preventDefault()
    const { search, history } = this.state
    if (search.trim() !== '') {
      if (history.indexOf(search) < 0) {
        const newHistory = [search].concat(history.slice(0, SEARCH_KEY_LIMIT - 1))
        storage.set(searchKey, newHistory)
      }
      this.props.changeLoadingState(true)
      hashHistory.push(`result?from=search&names=${encodeURIComponent(search)}`)
    }
  }

  searchHistory(history, e) {
    e.preventDefault()
    this.props.changeLoadingState(true)
    hashHistory.push(`result?from=search&names=${encodeURIComponent(history)}`)
  }

  showTrashModal() {
    const { history } = this.state
    if (history.length !== 0) {
      this.setState({ isShowTrash: true })
    }
  }

  closeTrashModal() {
    this.setState({ isShowTrash: false })
  }

  delHistory() {
    const { history } = this.state
    if (history.length === 0) {
      isShowTrash: false
    } else {
      storage.remove(searchKey)
      this.setState({
        history: [],
        isShowTrash: false
      })
    }
  }

  render() {
    const { showFixed } = this.props.global
    const { history, isShowTrash } = this.state

    return (
      <div className="search-wrap">
        <form
          data-flex="dir:left cross:center box:last"
          className="input-box"
          action=""
          onSubmit={this.handleSearch.bind(this)}>
          <div className="input-inner">
            <div className="search icon"></div>
            <input
              type="search"
              className="search-input"
              placeholder="商品名 品牌 分类"
              value={this.state.search}
              onChange={this.bindSearch.bind(this)}
              onInput={this.bindSearch.bind(this)} />
          </div>
          <div className="cancel-btn" onClick={this.goBack.bind(this)}>取消</div>
        </form>
        <div className="history-box">
          <div data-flex="dir:left cross:center box:justify" className="title">
            <div className="search icon"></div>
            <p className="text">搜索历史</p>
            <div className="trash icon" onClick={this.showTrashModal.bind(this)}></div>
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
        {isShowTrash &&
          <ConfirmModal
            isFixed={showFixed}
            tips="温馨提示"
            subTips="确认删除搜索记录吗？"
            confirmBtnText="确定"
            onCancel={this.closeTrashModal.bind(this)}
            onConfirm={this.delHistory.bind(this)}
            ></ConfirmModal>
        }
      </div>
    )
  }
}

export default template({
  id: 'search',
  component: Search,
  url: ''
})
