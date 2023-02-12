<template>
  <el-header class="header" :style="`left:-${scrollLeft}px`">
    <el-menu
        :default-active="activeIndex"
        class="nav el-menu-demo menu"
        mode="horizontal"
        @select="handleSelect"
        background-color="#409EFF"
        text-color="#fff"
        active-text-color="#ffd04b">
      <el-menu-item v-if="!isTeacher" index="submit"><template slot="title">提交作业</template></el-menu-item>
      <el-menu-item v-if="isTeacher" index="manage"><template slot="title">查看作业</template></el-menu-item>
      <div class="login-link">
        <div class="link-format" v-if="showUser">
<!--        <div class="link-format">-->
          <el-link :underline="false" @click="logoutUser()">
            <span>{{username}} | 退出登录</span>
          </el-link>
        </div>
      </div>
    </el-menu>
  </el-header>
</template>

<script>
import urls from "@/urls";
import store from "@/store/store";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Navigate",
  data() {
    return {
      activeIndex: 'submit',
      scrollLeft:'',
      showUser:false,
      username:"",
      isTeacher: false,
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log('key:',key, 'keyPath:',keyPath);
      this.activeIndex = key;
      this.$router.push('/'+key)
    },
    handleScroll() {
      this.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
    },
    logoutUser(){
      this.username=''
      this.showUser=false
      this.$axios.post(urls.userLogout).then(()=>{
        store.commit("del_token")
        this.$router.push({name:"LoginUser"})
        location.reload();
      })
    },
    refreshUsername(){
      let localUsername = localStorage.getItem("username")
      if (localUsername!=null){
        this.username = localUsername
        this.showUser=true
      }else {
        this.showUser=false
      }
      this.isTeacher = localStorage.getItem("isTeacher") === "true"
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll) //  离开页面清除（移除）滚轮滚动事件
  },
  mounted(){
    this.refreshUsername()
  },
  watch:{
    $route(){
      if (store.state.token === null && this.$route.name !== "LoginUser"){
        console.log('&& this.$route.name：',this.$route.name)
        this.$router.push("/404")
      }
      this.activeIndex = this.$route.name
      console.log(this.activeIndex)
      this.refreshUsername()
    },
  }
}
</script>

<style scoped>
.header{
  padding: 0;
  /*position:fixed;!*固定作用*!*/
  margin: 0;
  width: 100%;
  min-width: 1400px;
  /*top:0;*/
  /*left:0;*/
  /*z-index:2; !* 让导航栏浮在网页的高层位置，遇到flash和图片时候也能始终保持最外层 *!*/

}
.menu{
  text-align: center;
  padding-left: 30%;
  width: 70%;
}
.menu-item{
  margin-left: 100px;
}
.nickname{
  display: block;
  text-align: center;
  margin-right:20px ;
  color: white;
}
.login-link{
  margin-top: 22px;
  height: 100%;
  line-height: 100%;
  outline:none;
  width: 300px;
  float: right;
}
.link-format{
  /*display: flex;*/
}
.link-format a{
  color: #EBEEF5;
}
.link-format a:hover{
  color: #FFFFFF;
  /*border-bottom:1px solid #F6F6F6*/
}
</style>