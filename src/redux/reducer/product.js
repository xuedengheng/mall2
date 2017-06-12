import * as actionTypes from '../consts/product'

const initialState = {
	id: "",
	supplier: {},
	attribute: [],
	pictureUrls: [],
	promotions: []
}

const product = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCT:
      return action.payload
		case actionTypes.INIT_PRODUCT:
			return initialState
    default:
      return state
  }
}

export default product

//promotions": [ 结构
        //{
          //"id": "402880a75aa712da015aa7391ddc0023",
          //"name": "网易严选易物自营满减",
          //"description": "网易严选易物自营商品，满100减10元，满200打8折，满300打7折",
          //"label": "网易自营",
          //"startTime": "2017-03-07 13:25:00",
          //"endTime": "2017-04-13 13:23:00",
          //"type": "DEDUCTION",
          //"isEnable": "Y",
          //"createTime": "2017-03-07 16:09:47",
          //"version": "38",
          //"platforms": [
            //"YIWU",
            //"WY"
          //],
          //"rules": [
            //{
              //"orderAmount": "100.00",
              //"deductAmount": "10.00",
              //"discount": "1.00"
            //},
            //{
              //"orderAmount": "200.00",
              //"deductAmount": "0.00",
              //"discount": "0.80"
            //},
            //{
              //"orderAmount": "300.00",
              //"deductAmount": "0.00",
              //"discount": "0.70"
            //}
          //]
        //}
      //]
