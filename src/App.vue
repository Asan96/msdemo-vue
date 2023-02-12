<template>
  <div id="app">
    <Navigate v-show="this.pageName!=='LoginUser'" />
    <router-view v-if="isRouterAlive" :style="'min-height:'+minHeight+'px'"></router-view>
  </div>
</template>

<script>

import Navigate from "@/components/Navigate";

export default {
  name: 'App',
  data(){
    return{
      isRouterAlive:true,
      minHeight:document.documentElement.clientHeight,
      show:true,
      pageName:null
    }
  },
  components: {
    Navigate
  },
  mounted() {
    this.pageName = this.$route.name
    console.log("this.$route.name:",this.$route.name)
    // if (this.pageName !='UserLogin'){
    //   let sessionid = this.$cookies.get('sessionid')
    //   if (!sessionid){
    //     this.$router.push('/login/user')
    //     location.reload()
    //   }
    // }

  },
  watch:{
    $route(){
      this.pageName  = this.$route.name
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #E4E7ED;
  top:0;
}
</style>
