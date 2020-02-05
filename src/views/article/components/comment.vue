<template>
<!-- 评论类标组件 -->
  <div class="comment">
      <!--列表  上拉加载   loading  是否开启加载状态finshed 是否已经全部加载完成-->
      <!-- van-list 组件 可以完成上拉加载工作 -->
      <!-- 首页中  我们给van-list组件绑定了一个@load事件 -->
    <van-list v-model="loading" :finished="finished"  @load="onLoad" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{comment.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ comment.like_count }}</span>
            </span>
          </p>
          <p>{{ comment.content }}</p>
          <p>
            <span class="time">{{ comment.pubdate | relTime }}</span>&nbsp;
            <van-tag plain @click=" openReply()">{{ comment.reply_count }}回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 回复列表组件 -->
    <van-action-sheet :round="false" v-model="showReply" class="reply_dailog"  title="回复评论">
      <!-- 回复列表组件  加载状态  finshed  finshed-text=“-->
      <van-list v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="index in 8" :key="index">
          <van-image round width="1rem" height="1rem" fit="fill" src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="info">
            <p><span class="name">一阵清风</span></p>
            <p>评论的内容，。。。。</p>
            <p><span class="time">两天内</span></p>
          </div>
        </div>

      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments } from '@/api/article' // 引入封装的获取评论方法
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '', // 评论位置
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 用来存放列表数据
      offset: null, // 分页依据  如果为空表示从第一页开始   获取文章评论文章的分页依据  a
      showReply: false, // 默认不显示   控制回复列表组件的显示隐藏
      reply: {
        // 专门用   这个对象存放回复相关数据
        loading: false, // 是回复列表自检的状态
        finished: false, // 是回复列表自检的状态结束状态
        offset: null, // 偏移量   获取评论的评论的分页依据 c
        list: [] // 用于存放   当前弹出的关于某个评论的回复列表的数据
      }

    }
  },
  methods: {
    // 打开回复
    openReply () {
      this.showReply = true
    },
    // 获取评论数据
    // 一级评论
    async  onLoad (params) {
      // 加载我们评论数据
      let data = await getComments({
        type: 'a', // 获取的类型
        affset: this.affset, // 偏移量   默认是null 第一页
        source: this.$route.query.articleId // 获取文章id
      })
      this.comments.push(...data.results) // 将数据添加到当前评论列表的尾部
      this.loading = false // 关闭 正在上拉加载状态
      this.finished = data.last_id === data.end_id // 如果当前页ID等于整个最后一个评论Id表示 我们已经请求完了数据
      if (!this.finished) {
        // 表示last_id 和  end_id 不等  表示还有下一页数据
        this.offset = data.last_id // 将last_id 设置成下一页的请求数据
      }
    }
  }

}
</script>

<style lang='less' scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
//回复列表的样式
.reply_dailog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
