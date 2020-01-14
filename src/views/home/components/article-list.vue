<template>
  <div class='scroll-wrapper'>>
      <van-list v-model="upLoading" :finished="finished"  finished-text="没有更多了"  @load="onLoad"></van-list>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      upLoading: false, // 是否开启开启上拉加载
      finished: false // 是否已经完成全部数据加载
    }
  },
  methods: {
    onLoad () {

    }
  }
}

</script>

<style lang="less" scoped>
</style>
