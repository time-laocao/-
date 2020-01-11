import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('@/views/home')// 主页组件
const Layout = () => import('@/views/layout') // 布局组件
const Question = () => import('@/views/question')// 问答组件
const Video = () => import('@/views/video')// 视频组件
const User = () => import('@/views/user')// 用户组件 个人中心
const Search = () => import('@/views/search')// 搜索组件
const Article = () => import('@/views/article') // 文章模块
const Login = () => import('@/views/login') // 登录模块
const Profile = () => import('@/views/user/profile') // 编辑资料
const Chat = () => import('@/views/user/chat') // 小智同学
const SearchResult = () => import('@/views/search/result') // 搜索结果
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Layout, // 一级路由
    children: [
      { path: '/', component: Home }, // 二级路由
      { path: '/question', component: Question }, // 二级路由
      { path: '/video', component: Video }, // 二级路由
      { path: '/user', component: User } // 二级路由
    ]
  },
  { path: '/user/profile', component: Profile }, // 编辑资料
  { path: '/user/chat', component: Chat },
  { path: '/login', component: Login }, // 登录组件
  { path: '/article', component: Article }, // 文章详情
  { path: '/search', component: Search }, // 搜索中心
  { path: '/search/result', component: SearchResult } // 搜索结果
]

const router = new VueRouter({
  routes
})

export default router
