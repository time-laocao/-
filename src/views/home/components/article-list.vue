<template>
  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
    <!-- 下拉刷新           是否处于加载中状态      事件    -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <!-- 上拉加载 -->
      <van-list v-model="upLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- v-for渲染数据 -->
        <!-- 点击van-cell 跳转到文章详情 -->
        <van-cell :to="`/article?articleId=${article.art_id.toString()}`" v-for="article in articles" :key="article.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{article.title}}</h3>
            <!-- 三图模式 -->
            <div class="img_box" v-if="article.cover.type === 3">
              <van-image lazy-load class="w33" fit="cover"  :src="article.cover.images[0]"  />
              <van-image lazy-load class="w33" fit="cover"  :src="article.cover.images[1]"  />
              <van-image  lazy-load class="w33" fit="cover"  :src="article.cover.images[2]"  />
            </div>
            <!-- 单图模式 -->
            <div class="img_box"  v-if="article.cover.type === 1">
              <van-image lazy-load class="w100" fit="cover" :src="article.cover.images[0]"/>
            </div>
            <div class="info_box">
              <span>{{article.aut_name}}</span>
              <span>{{article.comm_count}}</span>
              <!-- <span>{{article.pubdate}}</span> -->
               <!-- 使用过滤器  表达式 | 过滤器名称 -->
              <span>{{ article.pubdate | relTime}}</span>
              <!-- 判断是否显示  叉号图标 -->
              <!-- 点击叉号图标 告诉父组件我要反馈了   stop组织事件冒泡 -->
              <span class="close" v-if="user.token" @click.stop="$emit('showAction',article.art_id.toString())">
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
import { getArticles } from '@/api/article'
import { mapState } from 'vuex'
import eventBus from '@/utils/eventBus'
export default {
  name: 'article-list',
  data () {
    return {
      upLoading: false, // 是否开启开启上拉加载
      finished: false, // 是否已经完成全部数据加载
      articles: [], // 定义一个数据来接收上拉加载数据
      downLoading: false, // 是否开启下拉菜单
      refreshSuccessText: '', // 文本
      timestamp: null // 定义一个时间戳 这个时间戳用来告诉服务器 现在我们要求什么样的的事件数据
    }
  },
  props: {
    channel_id: {
      type: Number, // 指定要传的props的类型
      required: true, // 要求props必须传
      default: null // 给props一个默认值
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    // 开启监听
    eventBus.$on('delArticle', (articleId, channelId) => {
      if (this.channel_id === channelId) {
        // 这个条件表示 该列表就是当前激活的列表
        let index = this.articles.findIndex(item => item.art_id.toString() === articleId) // 查找对应的文章
        // 如果index大于 -1 表示找到了 就要删除
        if (index > -1) {
          this.articles.splice(index, 1) // 删除不喜欢的文章
        }
      }
    })
  },
  methods: {
    async  onLoad () {
      await this.$sleep() // 等待 sleep  resovle
      // setTimeout(() => {
      //   if (this.articles.length < 50) {
      //     let arr = Array.from(
      //       Array(10),
      //       (value, index) => this.articles.length + index + 1
      //     )
      //     this.articles.push(...arr)
      //     // 关掉状态
      //     this.upLoading = false
      //   } else {
      //     this.finished = true
      //   }
      // }, 1000)
      //   请求数据                                              判断一下时间戳是否为空 是空传当前时间
      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })
      this.articles.push(...data.results)
      // 关闭下加载状态
      this.upLoading = false
      // 判断历史时间戳 如果有有历史表示我还可以继续往下看  否则就不看了
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        // 否者没有历史了  木有必要继续加载了
        // this.refreshSuccessText = '没有更多了'
        this.finished = true // 告诉list组件  我已经加载完了 不要再去触发onLoad事件了
      }
    },
    // 下拉刷新
    async onRefresh () {
      await this.$sleep() // 等待 sleep  resovle
      // 触发下拉刷新
      // setTimeout(() => {
      //   let arr = Array.from(Array(10), (value, index) => '追加' + (index + 1))
      //   this.articles.unshift(...arr) // 将数据添加到队首  unshift ：数组头部插入
      //   this.downLoading = false // 关掉下拉状态
      //   this.refreshSuccessText = `更新了${arr.length}条数据`
      // }, 1000)
      // 下拉刷新永远都是拉去最新的数据
      const data = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() })
      this.downLoading = false
      // 有可能最心的没有数据
      if (data.results.length) {
        // 如果长度大于0 表示有数据
        this.articles = data.results // 历史数据全部覆盖掉
        // 假如你之前 已经将上拉 加载设置成了  finished 设置成了true了
        // 表示我们还要继续往下拉  就系要吧原来的转态再次打开
        this.finished = false
        // 获取此次的历史时间戳
        this.timestamp = data.pre_timestamp
        this.refreshSuccessText = `更新了${data.results.length}条数据`
      } else {
        // 如果没有数据  不需要变化
        this.refreshSuccessText = '已是最新数据了'
      }
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
