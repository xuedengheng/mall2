  //拿出第一个有库存的sku, 在其他代码里可以把这个作为初始化被选中的sku
import _ from "lodash"

const spliter = "|:|"

export const getFirstValidSku = (product) =>  {
  let sku = null
  let skus = product.sku || []
  for(let item of skus){
    if(item["stock"] > 0){
      sku = item
      break
    }
  }
  return sku
}

export const productInvalidSkuFilter = (product) => {
  let new_product = _.cloneDeep(product)
  if(!_.isEmpty( new_product.attribute)){
    const attr_length = new_product.attribute.length
    let skus = _.filter(new_product.sku, (sku)=>{ return sku.attribute.length == attr_length})
    new_product.sku = skus
  }
  return new_product
}

export const getSkuTypes = (product) => {
  let skuTypes = []
  const skus = product.sku
  let has_no_attribute_sku = _.find( product.sku, (sku)=>{return _.isEmpty(sku.attribute)} )
  if(!_.isEmpty( product.attribute ) && !(has_no_attribute_sku)){ //加入sku里如果有attribute为空的判断
    //skuTyes数据结构参考代码最下方..这个是原生返回product.attrbute里的对象，加了一个values数组作为显示, 加了一个selectedValue标明选择了哪个属性
    //1.排序, 2.加入values 3,筛选selectedSku
    _.each(product.attribute, (attr)=>{
      let values = _.map(skus, (sku)=>{
        return _.find(sku["attribute"], (attribute)=> attribute["attrId"] == attr["attrId"])["attrValue"]
      })
      values = _.uniq(values)
      attr["values"] = values
      skuTypes.push(attr)
    })
  }
  return skuTypes
}

//sku.attribute代表相同的东西。。。但是id居然会是不一样，要用attrValue来做key...
//生成sku路径的数据结构,反过来
//Matrix: { //key是每个可选sku.attribute里的id组成的subId
//  "48/ml:蓝色:山东仓库": {price: xxx, stock: 1, skuId: xxx},
//  "52/xxl:黑白:广州": {price: xxx, stock: 1, skuId: xxx}
//}
//skuSquare: {
//  attrId: [{ id: sub_id1, selected: true, attrValue: "蓝色" }, {}, {} ],
//  attrId2: [xxx]....
//}, 方便与skuMatrix做交集, 和每次点击后render计算出的结果都保存在这里

export const getSkuMatrix = (product) => {
  let matrix = {}
  _.each(product.sku, (sku)=>{
    const key = getSkuAttributesKey(sku)
    matrix[key] = {skuId: sku["skuId"], stock: sku["stock"], price: sku["price"]}
  })
  return matrix
}

export const getSkuSquare = (product, selectedSku) => {
  let square = {}
  let temp_matrix = getSkuMatrix(product)
  _.each(product.attribute, (attr)=>{
    let result = _.map(product.sku, (sku)=>{
      return _.find(sku.attribute, (attribute)=> attribute["attrId"] == attr["attrId"])
    })
    result = _.uniqBy(result, "attrValue")
    square[attr.attrId] = []
    _.each(result, (attr_object) => {
      //顺道从初始化的selectedSku里去设定好属性
      //let selected = _.includes( getSkuAttributesKey(selectedSku).split(spliter), attr_object.attrValue )
      //还要判断一下，如果只有一种attribute sku类型，无库存是disabled = true
      let disabled = false
      if(product.attribute.length == 1 ){
        let sku = _.find(product.sku, (sku)=> {
          return _.find( sku.attribute, (temp_attribute)=> temp_attribute["attrValue"] == attr_object["attrValue"])
        })
        if(sku.stock < 1 ) disabled = true
      }
      //初始化的时候,再判断下当前属性如果任何路径库存都是没有，或没库存的时候，也disabled了它
      disabled = singleValueShouldBeDiabled(temp_matrix, attr_object["attrValue"])

      square[attr.attrId].push({id: attr_object.id, selected: false, attrValue: attr_object.attrValue, disabled: disabled})
    })
  })
  return square
}

//获取已选择的sku他的品类key, 返回格式id1:id2:id3:id4
const getSkuAttributesKey = (sku) => {
  return _.map(sku.attribute, (attr)=>{
    return attr.attrValue
  }).join(spliter)
}

export const updateSkuSquare = (skuSquare, skuMatrix, selectValue, attrId)=> {
  //0. 如果原来是diabled的话，将同级改成全部selected: false, 是一开始就不能点
  let selectedSquareObject = _.find(skuSquare[attrId], (object)=> object.attrValue == selectValue)
  let skuSqkuareLength = _.keys(skuSquare).length
  if( selectedSquareObject.disabled ) {
    _.each(skuSquare[attrId], (object)=>{
      object["selected"] = false
    })
    return skuSquare
  }

  let changeToNotSelectFlag = false //原来是已选,变成未选的话，这里的flag会变成true, 取消选择
  //1.更改自身状态, 同级的其他属性selected 变false, 自己的selected状态要反转
  _.each(skuSquare[attrId], (object)=>{
    //自己
    if ( object.attrValue == selectValue ){
      if( object.disabled ) return false //原来就是不可选的，就什么都不用干了
      if(object["selected"]) changeToNotSelectFlag = true //打个flag，说明按钮从已选变成不选的情况，取消选择，下一步用
      object["selected"] = !object["selected"]

      console.log("on click squareObject", object)
    }else{ //同级其他
      object["selected"] = false
      if(skuSqkuareLength == 1 && object["disabled"] == true) {
         //如果只有一级，并且原来就是disabled, 什么都不用管，不给选
      }else {
        object["disabled"] = singleValueShouldBeDiabled(skuMatrix, object["attrValue"])
      }
    }
  })

  //2.查找所有路径，找未选择的属性, 不能选的value, 改disabled, 判断prev selected其他的属性是否需要更改, 不能选择
  //修改square里面的每一个状态, 是否disabled
  _.each(_.keys(skuSquare), (key)=>{
    if( key == attrId ) return //同级的这里不用再改
    let attr_objects = skuSquare[key]
    _.each( attr_objects, (object)=>{
      let object_value = object.attrValue
      if(valueShouldBeDisabled(skuMatrix, selectValue, object_value) && !changeToNotSelectFlag ){ //如果object_value要被disabled 并且 当前按钮不是一个取消选择的行为
        object.disabled = true
        object.selected = false
      }else{
        object.disabled = singleValueShouldBeDiabled(skuMatrix, object_value)
      }
    })
  })
  return skuSquare
}

export const skuSquareSelectedKeys = (skuSquare) => {
  let result = _.map(_.flattenDeep( _.values( skuSquare ) ), (object)=> {
    if(object.selected){
      return object.attrValue
    }
  })
  return _.compact(result)
}

export const getSkuByKeys = (skuMatrix, product, keys) => {
  try{
    const key = _.find( _.keys(skuMatrix), (matrix_key)=>{
      return _.isEmpty( _.difference(matrix_key.split(spliter), keys) )
    })

    console.log("key in getSkuByKeys", key)
    const skuId = skuMatrix[key]["skuId"]
    return _.find(product.sku, (sku)=> sku.skuId == skuId)
  }catch(e) {
    console.log("find sku error: ", "no filted sku")
    return null
  }
}

//allSkuAttributeKeys = ()=> {
  //let values_arr = _.map(this.state.skuTypes, (type)=> type.values)
  //return _.uniq(_.flatten(values_arr))
//}

const valueShouldBeDisabled = (skuMatrix, selectValue, targetValue) => {
  let disabled = true
  console.log(selectValue, targetValue)
  _.each(_.keys( skuMatrix ), (key)=>{
    //console.log("select index, target index, stock", key.indexOf(selectValue), key.indexOf(targetValue), skuMatrix[key]["stock"])
    let key_arr =  key.split(spliter)
    if(key_arr.indexOf(selectValue) >= 0 && key_arr.indexOf(targetValue) >= 0 && skuMatrix[key]["stock"] > 0 ){ //如果组合存在并且库存大于0, 则可选
      disabled = false
      return false //break
    }
  })
  return disabled
}

//用于判断单个属性名，绝对无货不能选
const singleValueShouldBeDiabled = (skuMatrix, value) => {
  let disabled = true
  _.each(_.keys( skuMatrix ), (key)=>{
    let key_arr =  key.split(spliter)
    if(key_arr.indexOf(value) >= 0 && skuMatrix[key]["stock"] > 0 ){ //如果组合存在并且库存大于0, 则可选
      disabled = false
      return false //break
    }
  })
  return disabled
}
