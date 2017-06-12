import { hashHistory } from 'react-router'
import Cookies from 'js-cookie'

export const pushPage = (item) => {
  switch (item.target) {
    case 'PRODUCT_DETAIL':
      hashHistory.push(`product/${item.id}`)
      break
    case 'CATEGORY_SEARCH':
      hashHistory.push(`result?catalogids=${item.id}`)
      break
    case 'BRAND_SEARCH':
      hashHistory.push(`result?brandcodes=${item.id}`)
      break
    case 'TEMPLATE':
      hashHistory.push(`showcase/${item.id}`)
      break
    case 'URL':
      const account = Cookies.get('account') || ''
      const token = Cookies.get('token') || ''
      let url = item.id.indexOf('?') >= 0 ? `${item.id}&from=H5&mChannal=YX_APP` : `${item.id}?from=H5&mChannal=YX_APP`
      url = account ? `${url}&account=${account}` : url
      url = token ? `${url}&token=${token}` : url
      window.location.href = url
      break
    default:
      break
  }
}
