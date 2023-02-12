import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    username: null, // 用户名
    // logined: localStorage.getItem('token') != null || false, // 是否登录状态
    token: null,
    isTeacher: false,
}

export default new Vuex.Store({
    state,
    getters:{
        token: state => state.token,
        username: state => state.username,
        isTeacher: state => state.isTeacher
    },
    mutations: {
        // 设置token，并将token存入localStorage
        set_token (state, token) {
            state.token = token
        },
        //清除token，并将token存入localStorage
        del_token (state) {
            state.token = ''
            state.username = ''
            state.isTeacher = false
            localStorage.removeItem('Authorization')
            localStorage.removeItem('username')
            localStorage.removeItem('isTeacher')
        },
        set_username(state, username){
            state.username = username
        },
        set_isTeacher(state, isTeacher){
            state.isTeacher = isTeacher
        }
    },
    actions: {},
    modules: {}
})