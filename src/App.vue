<template>
  <div id="app">
    <!-- 一级路由容器   将所有的一级路由文件 都进行了缓存-->
    <keep-alive>
     <router-view v-if="$route.meta.isAlive"></router-view>
    </keep-alive>
 <router-view v-if="!$route.meta.isAlive"></router-view>
  </div>
</template>

<style lang="less">

</style>
