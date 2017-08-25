/**
 * Created by lsabella on 17/8/25.
 */
import axios from 'axios'
import router from '../router'
var instance = axios.create()
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.log(error.response)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          if (router.currentRoute.fullPath !== '/login') {
            console.log(router.currentRoute.fullPath.indexOf('redirect'))
            if (router.currentRoute.fullPath.indexOf('redirect') === -1) {
              router.replace({
                path: '/login',
                query: {redirect: router.currentRoute.fullPath}
              })
            }
          } else {
            Promise.resolve(error.response)
          }
        //   break
        // case 500:
        //   alert(error.response.data.msg)
      }
    }
    return Promise.reject(error.response)   // 返回接口返回的错误信息
  })

export default instance
