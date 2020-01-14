<template>
  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
    <!-- 下拉刷新           是否处于加载中状态      事件    -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <!-- 上拉加载 -->
      <van-list v-model="upLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- v-for渲染 -->
        <van-cell v-for="article in articles" :key="article">
          <div class="article_item">
            <h3 class="van-ellipsis">PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新</h3>
            <!-- 三图模式 -->
            <div class="img_box">
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <!-- 单图模式 -->
            <div class="img_box">
              <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <div class="info_box">
              <span>你像一阵风</span>
              <span>8评论</span>
              <span>10分钟前</span>
              <span class="close">
                <van-icon name="cross"></van-icon>
              </span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      upLoading: false, // 是否开启开启上拉加载
      finished: false, // 是否已经完成全部数据加载
      articles: [], // 定义一个数据来接收上拉加载数据
      downLoading: false, // 是否开启下拉菜单
      refreshSuccessText: '更新成功' // 文本
    }
  },
  methods: {
    onLoad () {
      setTimeout(() => {
        if (this.articles.length < 50) {
          let arr = Array.from(
            Array(10),
            (value, index) => this.articles.length + index + 1
          )
          this.articles.push(...arr)
          // 关掉状态
          this.upLoading = false
        } else {
          this.finished = true
        }
      }, 1000)
    },
    // 下拉刷新
    onRefresh () {
      // 触发下拉刷新

      setTimeout(() => {
        let arr = Array.from(Array(10), (value, index) => '追加' + (index + 1))
        this.articles.unshift(...arr) // 将数据添加到队首  unshift ：数组头部插入
        this.downLoading = false // 关掉下拉状态
        this.refreshSuccessText = `更新了${arr.length}条数据`
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
