<template>
  <div id="app">
    <router-view v-wechat-title='$route.meta.title'/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
  }

  body {
    font-size: 12px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }

  #app {
    height: 100%;
    overflow: hidden;
    width: 1200px;
    margin: 0 auto;
  }

  .el-header {
    /*background-color: #B3C0D1;*/
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  /*.el-aside {*/
  /*background-color: #D3DCE6;*/
  /*color: #333;*/
  /*text-align: center;*/
  /*line-height: 200px;*/
  /*}*/

  .el-main {
    color: #333;
    height: 100%;
    /*padding: 0;*/
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container > .el-container {
    height: 100%;
  }

  div {
    display: block;
  }
</style>
