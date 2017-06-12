const sa = window.sa

export const CART_FROM = {
  'search': '搜索结果页',
  'list': '商品列表',
  'detail': '商品详情页'
}

export const login = (id) => {
  if (sa) {
    sa.login(id)
  }
}

export const track = (event_name, properties = {}, callback = () => {}) => {
  if (sa) {
    sa.track(event_name, properties, callback)
  }
}
