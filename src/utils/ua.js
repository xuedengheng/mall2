const ua = window.navigator.userAgent

export const isWx = () => {
  return /micromessenger/i.test(ua)
}

export const isIOS = () => {
  return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

export const isAndroid = () => {
  return ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1
}
