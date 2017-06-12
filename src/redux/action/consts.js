import fetch from 'isomorphic-fetch'
import { hashHistory } from 'react-router'
import Cookies from 'js-cookie'

import { login } from '../../utils/sa'

import { Tool } from '../../config/Tool'

const BASE_URL = '/api/v1'
const APP_ID = 'YX_APP'

let resetTimes = 0

const requestData = ({ url, method = 'GET', data = undefined, header = {} }) => {
  const account = Cookies.get('account') || ''
  return new Promise((resolve, reject) => {
    if (typeof navigator.onLine === 'undefined' || (typeof navigator.onLine !== 'undefined' && navigator.onLine === true)) {
      fetch(url, {
        method,
        headers: {
          ...header,
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          'mChannal': APP_ID,
          'mobile': account
        },
        mode: 'cors',
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(json => {
        if (json.success) {
          resolve(json)
        } else if (json.code === 10000) {
          reGetToken(
            () => {
              fetch(url, {
                method,
                headers: {
                  ...header,
                  'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: data ? JSON.stringify(data) : undefined,
                credentials: 'same-origin'
              })
              .then(response => response.json())
              .then(json => {
                if (json.success) {
                  resolve(json)
                } else {
                  let error = new Error(json.msg)
                  error.json = json
                  error.code = json.code
                  throw error
                }
              })
              .catch(err => {
                reject(err)
              })
            },
            () => {
              hashHistory.push('login')
              let error = new Error('授权失效')
              error.code = json.code
              reject(error)
            }
          )
        } else {
          let error = new Error(json.msg)
          error.json = json
          error.code = json.code
          throw error
        }
      })
      .catch(err => {
        reject(err)
      })
    } else {
      let error = new Error()
      error.code = 99999991
      error.message = '网络异常，请检查您的网络'
      reject(error)
    }
  })
}

const reGetToken = (success, fail) => {
  const account = Cookies.get('account') || ''
  const password = Cookies.get('password') || ''
  if (!account || !fail) {
    fail && fail()
  } else {
    resetTimes += 1
    fetch(`${BASE_URL}/auth/getToken${Tool.paramType({ account, password })}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(json => {
      if (json.success) {
        resetTimes = 0
        success && success()
      } else {
        if (resetTimes >= 5) {
          resetTimes = 0
          fail && fail()
        } else {
          reGetToken(success, fail)
        }
      }
    })
    .catch(() => {
      if (resetTimes >= 5) {
        resetTimes = 0
        fail && fail()
      } else {
        reGetToken(success, fail)
      }
    })
  }
}

export {
  BASE_URL,
  requestData
}
