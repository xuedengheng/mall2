import pinyin from 'pinyin'
import _ from 'lodash'

import * as actionTypes from '../consts/area'

const initialState = {
  isEnd: false,
  status: 'province',
  provinceList: [],
  cityList: [],
  countyList: [],
  townList: []
}

const area = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.INIT_AREA_STATUS:
      return {
        ...state,
        status: 'province',
        isEnd: false
      }
    case actionTypes.SET_AREA_STATUS:
      return {
        ...state,
        status: action.payload
      }
    case actionTypes.SET_AREA_ENDING:
      return {
        ...state,
        isEnd: true
      }
    case actionTypes.GET_PROVINCE_LIST:
      return {
        ...state,
        status: 'province',
        provinceList: genProvinceList(action.payload)
      }
    case actionTypes.GET_CITY_LIST:
      return {
        ...state,
        status: 'city',
        cityList: genCityList(action.payload)
      }
    case actionTypes.GET_COUNTY_LIST:
      return {
        ...state,
        status: 'county',
        countyList: genCountyList(action.payload)
      }
    case actionTypes.GET_TOWN_LIST:
      return {
        ...state,
        status: 'town',
        townList: genTownList(action.payload)
      }
    default:
      return state
  }
}

const genProvinceList = (payload) => {
  const charArr = 'abcdefghijklmnopqrstuvwxyz'.split('')
  let addrArr = [];
  for (let i in payload) {
    addrArr.push({ id: payload[i], name: i, pinyin: pinyin(i, { style: pinyin.STYLE_NORMAL })[0][0] })
  }
  addrArr = addrArr.sort((a, b) => {
    return a.pinyin.localeCompare(b.pinyin)
  })
  let reArr = charArr.map((char) => {
    return { flag: char, items: [] }
  })
  addrArr.forEach((arr) => {
    if (arr.name.match(/重庆/)) {
      reArr[2].items.push(arr)
    } else {
      const index = _.findIndex(charArr, (char) => {
        return char === arr.pinyin.charAt(0)
      })
      if (index > -1) {
        reArr[index].items.push(arr)
      }
    }
  })
  return reArr
}

const genCityList = (payload) => {
  const charArr = 'abcdefghijklmnopqrstuvwxyz'.split('')
  let addrArr = [];
  for (let i in payload) {
    addrArr.push({ id: payload[i], name: i, pinyin: pinyin(i, { style: pinyin.STYLE_NORMAL })[0][0] })
  }
  addrArr = addrArr.sort((a, b) => {
    return a.pinyin.localeCompare(b.pinyin)
  })
  let reArr = charArr.map((char) => {
    return { flag: char, items: [] }
  })
  addrArr.forEach((arr) => {
    if (arr.name.match(/长沙/)) {
      reArr[2].items.push(arr)
    } else {
      const index = _.findIndex(charArr, (char) => {
        return char === arr.pinyin.charAt(0)
      })
      if (index > -1) {
        reArr[index].items.push(arr)
      }
    }
  })
  return reArr
}

const genCountyList = (payload) => {
  const charArr = 'abcdefghijklmnopqrstuvwxyz'.split('')
  let addrArr = [];
  for (let i in payload) {
    addrArr.push({ id: payload[i], name: i, pinyin: pinyin(i, { style: pinyin.STYLE_NORMAL })[0][0] })
  }
  addrArr = addrArr.sort((a, b) => {
    return a.pinyin.localeCompare(b.pinyin)
  })
  let reArr = charArr.map((char) => {
    return { flag: char, items: [] }
  })
  addrArr.forEach((arr) => {
    const index = _.findIndex(charArr, (char) => {
      return char === arr.pinyin.charAt(0)
    })
    if (index > -1) {
      reArr[index].items.push(arr)
    }
  })
  return reArr
}

const genTownList = (payload) => {
  const charArr = 'abcdefghijklmnopqrstuvwxyz'.split('')
  let addrArr = [];
  for (let i in payload) {
    addrArr.push({ id: payload[i], name: i, pinyin: pinyin(i, { style: pinyin.STYLE_NORMAL })[0][0] })
  }
  addrArr = addrArr.sort((a, b) => {
    return a.pinyin.localeCompare(b.pinyin)
  })
  let reArr = charArr.map((char) => {
    return { flag: char, items: [] }
  })
  addrArr.forEach((arr) => {
    const index = _.findIndex(charArr, (char) => {
      return char === arr.pinyin.charAt(0)
    })
    if (index > -1) {
      reArr[index].items.push(arr)
    }
  })
  return reArr
}

export default area
