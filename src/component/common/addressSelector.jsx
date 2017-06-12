import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import _ from 'lodash'
import classNames from 'classnames'

export default class AddressSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      province: null,
      city: null,
      county: null,
      town: null
    }
  }

  componentWillMount() {
    this.props.initAreaStatus()
    this.props.getProvinceList()
  }

  genTitle() {
    const { status } = this.props.area
    switch (status) {
      case 'province':
        return '省份'
      case 'city':
        return '城市'
      case 'county':
        return '区县'
      case 'town':
        return '城镇，街道'
      default:
        return ''
    }
  }

  genlistData() {
    const { status, provinceList, cityList, countyList, townList } = this.props.area
    switch (status) {
      case 'province':
        return provinceList
      case 'city':
        return cityList
      case 'county':
        return countyList
      case 'town':
        return townList
      default:
        return ''
    }
  }

  handleClick(item, e) {
    e.preventDefault()
    const { getCityList, getCountyList, getTownList, initAreaStatus, onChoose } = this.props
    const { status } = this.props.area
    switch (status) {
      case 'province':
        this.setState({ province: { code: item.id, name: item.name } })
        getCityList(item.id)
        break
      case 'city':
        this.setState({ city: { code: item.id, name: item.name } })
        getCountyList(item.id)
        break
      case 'county':
        this.setState({ county: { code: item.id, name: item.name } })
        getTownList(item.id)
        break
      case 'town':
        this.setState({ town: { code: item.id, name: item.name } })
        initAreaStatus()
        onChoose({ ...this.state, town: { code: item.id, name: item.name } })
        break
      default:
        break
    }
  }

  handleBack(e) {
    e.preventDefault()
    const { initAreaStatus, setAreaStatus, onClose } = this.props
    const { status } = this.props.area
    switch (status) {
      case 'province':
        initAreaStatus()
        onClose()
        break
      case 'city':
        setAreaStatus('province')
        break
      case 'county':
        setAreaStatus('city')
        break
      case 'town':
        setAreaStatus('county')
        break
      default:
        break
    }
  }

  componentWillReceiveProps(nextProps) {
    const { onChoose } = this.props
    if (nextProps.area.isEnd) {
      onChoose({ ...this.state })
    }
  }

  render() {
    const { showFixed } =this.props
    const title = this.genTitle()
    const list = this.genlistData()

    return (
      <div className="address-selector-wrap">
        <div className={classNames('page-header', { 'be-fixed': showFixed })}>
          <div className="page-back" onClick={this.handleBack.bind(this)}>
            <div className="icon back"></div>
          </div>
          <p className="page-title">请选择{title}</p>
        </div>
        {list.map((addr, index) => {
          return addr.items.length > 0 ?
            (
              <div key={index} className="addr-list">
                <p className="title">{addr.flag.toLocaleUpperCase()}</p>
                {addr.items.map((item, index) => {
                  return <div key={index} className="addr-item" onClick={this.handleClick.bind(this, item)}>{item.name}</div>
                })}
              </div>
            ) :
            undefined
        })}
      </div>
    )
  }
}
