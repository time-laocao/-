<template>
  <div class="more-action">
    <!-- 第一个单元格组 -->
    <!--                是否显示 -->
    <van-cell-group v-if="!isReport">
      <!-- 点击按钮 要触发父组件去调用不感兴趣的接口 -->
      <van-cell  @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <!-- 第二个单元格组 -->
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <!-- 点击 举报按钮  触发父组件    去调用接口 举报文章的接口 -->
      <van-cell @click="$emit('report',item.value)" icon="info-o" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants'
import eventBus from '@/utils/eventBus'
export default {
  data () {
    return {
      isReport: false, // 控制第一个单元格and个第二个单元格显示
      reports
    }
  },
  created () {
    // 这行代码的意思就是 在给那个 反馈内容关闭并且返回初始页面
    eventBus.$on('delArticle', () => (this.isReport = false))
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
