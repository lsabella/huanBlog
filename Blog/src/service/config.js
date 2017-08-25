/**
 * Created by lsabella on 17/8/25.
 */
import axios from './axiosInterceptors'
import config from '../config'
axios.defaults.baseURL = 'http://lab.nbuxinxiren.cn';
export default {
  getRelease: () => axios.get(`${config.config.get}release`)
}
