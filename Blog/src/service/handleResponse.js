/**
 * Created by lsabella on 17/8/25.
 */
let defaultHandle = function (data, callbackSuccess, callbackError) {
    console.log(data)
  if (data.data.code === '000') {
    if (typeof (callbackSuccess) === 'function') {
      callbackSuccess(data)
    }
  } else {
    if (typeof (callbackError) === 'function') {
      callbackError()
    } else {
      console.log('http error')
    }
  }
}

let defaultDeal = function (data, callbackSuccess, callbackError) {
  console.log(data)
  console.log(data.data.data)
  if (data.status === 200) {
    if (typeof (callbackSuccess) === 'function') {
      callbackSuccess(data)
    }
  } else {
    if (typeof (callbackError) === 'function') {
      callbackError()
    } else {
      console.log('http error')
    }
  }
}

export default {
  defaultHandle,
  defaultDeal
}
