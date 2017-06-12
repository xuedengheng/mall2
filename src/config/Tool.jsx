
import * as config from './Config';

const {target} = config;
export const Tool = {};

Tool.paramType = data => {
    let paramArr = [];
    let paramStr = '';
    for (let attr in data) {
        paramArr.push(attr + '=' + data[attr]);
    }
    paramStr = paramArr.join('&');
    paramStr = '?' + paramStr;
    return paramStr
}

Tool.queryString2Obj = queryString => {
  const params = queryString.split('&')
  let query = {}
  if (queryString === '') return query
  for (var i = 0, len = params.length; i < len; i++) {
    var param = params[i].split('=')
    query[param[0]] = decodeURIComponent(param[1])
  }
  return query
}


Tool.ajax = url => {
  return new Promise((resolve, reject) => {
    let xml = new XMLHttpRequest();
    xml.open('get',url,true);
    xml.onload = resolve;
    xml.onerror = reject;
    xml.send();
  } )
}


let alertText = document.createElement('div');
alertText.setAttribute('id','alertText');


let alertDom = document.createElement('div');
alertDom.setAttribute('id','alertTip');
alertDom.appendChild(alertText);

document.body.appendChild(alertDom);
let timer = null;
Tool.alert =  (msg,msg2) => {
    clearTimeout(timer);
    if (msg2) {
        alertText.innerHTML = msg+'<div class="alert_bottom">'+msg2+'</div>';
    }else{
        alertText.innerHTML = msg;
    }
    alertDom.style.display = 'block';
    alertDom.onclick = () => {
        clearTimeout(timer);
        alertDom.style.display = 'none';
    }
    timer = setTimeout( () => {
       alertDom.style.display = 'none';
       clearTimeout(timer);
    }, 1000)
}

Tool.phoneCheck = (phone) => {
  if (phone!=null && (/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(phone))) {
    return true
  }else{
    return false
  }
}
