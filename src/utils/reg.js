const mobileReg = new RegExp(/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/)
const postcodeReg = new RegExp(/^[1-9][0-9]{5}$/)
const passwordReg = new RegExp(/^[a-zA-Z0-9_]{1,}$/)

export const isMobile = (text) => {
  return mobileReg.test(text)
}

export const isPostcode = (text) => {
  return postcodeReg.test(text)
}

export const isPassword = (text) => {
  return text.match(passwordReg)
}
