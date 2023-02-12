<template>
  <el-container>
    <el-main class="login-main">
      <div class="login-box">
        <div class="login-title-text">用户登录</div>
        <div class="login-form">
          <el-form :model="loginForm" :rules="loginRules" ref="resetForm">
            <el-form-item prop="username" class="password-form">
              <el-image :src="userIcon" class="login-icon icon-size"></el-image>
              <el-input v-model="loginForm.username" placeholder="账号" clearable autocomplete="new-password" class="info-input"></el-input>
            </el-form-item>
            <el-form-item prop="password" class="password-form">
              <el-image :src="keyIcon" class="login-icon icon-size"></el-image>
              <el-input v-model="loginForm.password" placeholder="密码" clearable show-password autocomplete="new-password" class="info-input"></el-input>
            </el-form-item>
          </el-form>
          <div class="login_op">
            <el-button type="primary" class="register_btn" @click="loginUser(loginForm)">登录</el-button>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import urls from "@/urls";

import userIcon from '@/../public/image/userIcon.png'
import keyIcon from '@/../public/image/pwdIcon.png'
import store from "@/store/store";
export default {
  name: "UserLogin",
  components: { },
  data(){
    return{
      isPwd:true,
      userIcon:userIcon,
      keyIcon:keyIcon,
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'change'}],
        password: [
          { required: true, message: '请输入密码',trigger: 'change' },
          { validator:this.validatePassword, trigger: 'blur' }
        ],
      },
    }
  },
  mounted(){
  },
  methods:{
    // 密码校验
    validatePassword (rule, value, callback) {
      if (value !== '') {
        if (value.length < 4) {
          callback(new Error('请输入至少4位的密码'))
          return false
        } else {
          callback()
        }
      }
    },
    loginUser(form){
        let formdata = new FormData();
        formdata.append("username",form.username)
        formdata.append("password",form.password)
      if (!form.username || !form.password){
        this.$message.error("请输入账号信息")
        return
      }
        this.$axios.post(urls.userLogin,formdata).then(res=>{
          if (res.data.code === 200){
            window.console.log('red.data:',res.data)
            localStorage.setItem('Authorization', res.data.data.token)
            localStorage.setItem('username', res.data.data.username)
            localStorage.setItem('isTeacher', res.data.data.is_teacher)
            store.commit("set_token", res.data.data.token)
            store.commit("set_username", res.data.data.username)
            store.commit("set_isTeacher", res.data.data.is_teacher)
            if (res.data.data.is_teacher){
              this.$router.push({name: 'manage'})
            }else{
              this.$router.push({name:'submit'})
            }
          }else {
            this.$message.error(res.data.msg ? res.data.msg:'用户名或密码错误')
          }
        })
    },
  }
}
</script>

<style scoped>
.login-main{
  position: relative;
  width: 100%;
  height: 100vh;
  background-size: 100% 100%;
  /*background-color: #409EFF;*/
}
.login-box{
  position: absolute;
  right: 40%;
  top: 20%;
  width: 480px;
  height: 380px;
  /*border: 1px solid black;*/
  background-color: white;
  /*box-shadow: 10px 10px 5px #aaaaaa;*/
}
.login-title-text{
  /*margin-left: 44px;*/
  margin-top: 40px;
  font-size: 24px;
  color: #409EFF;
}
.login-form{
  margin-top: 40px;
}
/deep/.login-form .el-input__inner{
  width: 393px;
  height: 50px;
  padding: 0 20px 0 60px;
  font-size: 16px;
}
/deep/.login-form .el-form-item__error {
  left: 50px;
}
/deep/.login-form .el-input__suffix{
  top: 2px;
  right: 50px;
}
.username-form{
  position: relative;
}
.password-form{
  margin-top: 20px;
  position: relative;
}
.login-icon{
  position: absolute;
  top: 12px;
  left: 63px;
  z-index: 999;
}
/deep/.login-form .el-form-item{
  margin-bottom: 25px;
}
.register_btn{
  width: 393px;
  height: 50px;
}
.forget-password-box{
  width: 390px;
  margin: 19px auto;
  text-align: start;
}
.forget-password{
  font-size: 16px;
  color: #888888!important;
}
/deep/.forget-password .el-link--inner:hover{
  color: #409EFF;
}

/deep/.login-form .el-checkbox__label {
  font-size: 16px;
}
/deep/ .login-form .el-checkbox__inner{
  width: 20px;
  height: 20px;
}
/deep/ .login-form .el-checkbox__inner::after{
  height: 12px;
  left: 7px;
}

.getCode{
  width: 393px;
  margin: 0 auto;
}
/deep/ .getCode .el-input__inner{
  width: 250px;
  height: 50px;
  padding: 0 20px 0 60px;
  font-size: 16px;
}

.getCode-icon{
  position: absolute;
  top: 10px;
  left: 17px;
  z-index: 999;
  width: 30px;
  height: 30px;
}
.icon-size{
  width: 28px;
  height: 28px;
}

/deep/.return-login .el-link--inner:hover{
  color: #409EFF;
}
.web-title {
  position: absolute;
  font-size: 30px;
  /*color: #fff!important;*/
  top: 68px;
  right: 14%;
  color: orange;
}
</style>