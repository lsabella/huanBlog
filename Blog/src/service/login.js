/**
 * Created by lsabella on 17/8/25.
 */
import axios from './axiosInterceptors'
import config from '../config'
export default {
  login: (data) => axios.post(config.login.login, data)
}
