import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from "@/components/Login"
import SubmitPage from "@/components/SubmitPage";
import Manage from "@/components/Manage";
// import store from './store/store'
// 界面跳转的路由
Vue.use(VueRouter)
// if (localStorage.getItem('Authorization')) {
//     store.commit('set_token', localStorage.getItem('Authorization'))
// }


//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
    mode:"history",
    routes: [
        {
            path: '/',
            redirect:'/login/user',
        },
        {
            path: '/login/user',
            name: 'LoginUser',
            component: Login
        },
        {
            path: '/manage',
            name: 'manage',
            component: Manage
        },
        {
            path: '/submit',
            name: 'submit',
            component: SubmitPage
        },
        // {
        //     path: "*", // 此处需特别注意置于最底部
        //     redirect: "/404"
        // }
    ],
    //跳转页面后页面不在最顶端的问题
    scrollBehavior () {
        return { x: 0, y: 0}
    }
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
// 如果是登录页则放行
    if (to.path === '/login/user') return next()
    else{
        // 查看token是否存在
        const token = localStorage.getItem('Authorization')
        if (!token) return next('/login/user')
        next()
    }
})
export default router;