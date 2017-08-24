import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Form from '@/views/nav1/Form'
import timeLine from '@/views/articles/timeLine'
import articlesManage from '@/views/articles/articlesManage'
import selectExcel from '@/views/excel/selectExcel'
import articlesAdd from '@/views/articles/articlesAdd'
import text from '@/views/articles/text'
import text1 from '@/views/articles/text1'
import timeLineadd from '@/views/articles/timeLineadd'
import Dashboard from '@/views/dashboard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login,
      name: '',
      hidden: true
    },
    {
      path: '/',
      name: 'Hello',
      component: Hello,
      hidden: true
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      hidden: true
    },
    {
       path: '/',
       component: Home,
       name: '',
       iconCls: 'fa fa-address-card',
       leaf: true,//只有一个节点
       children: [
           { path: '/dashboard', component: Dashboard, name: '主页' }
       ]
    },
    {
      path: '/',
      component: Home,
      name: '内容管理',
      iconCls: 'el-icon-message',
      children: [
          { path: '/articlesManage', component: articlesManage, name: '文章管理' },
          { path: '/timeLine', component: timeLine, name: '时光轴管理' },
          { path: '/timeLineadd', component: timeLineadd, name: '时光轴发布',hidden: true },
          { path: '/articlesAdd', component: articlesAdd, name: '文章发布',hidden: true },
      ]
    },
    {
      path: '/',
      component: Home,
      name: '评论管理',
      iconCls: 'fa fa-id-card-o',
      children: [
          { path: '/name', component: Form, name: 'Form' }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '导航三',
      iconCls: 'fa fa-id-card-o',
      children: [
          { path: '/name', component: Form, name: 'Form' }
      ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/dashboard' }
    }
  ]
})
