<template>
  <!-- 评论类标组件 -->
  <div class="comment">
    <!--列表  上拉加载   loading  是否开启加载状态finshed 是否已经全部加载完成-->
    <!-- van-list 组件 可以完成上拉加载工作 -->
    <!-- 首页中  我们给van-list组件绑定了一个@load事件 -->
    <van-list v-model="loading" :finished="finished" @load="onLoad" finished-text="没有更多了">
      <div
        class="item van-hairline--bottom van-hairline--top"
        v-for="comment in comments"
        :key="comment.com_id.toString()"
      >
        <van-image round width="1rem" height="1rem" fit="fill" :src="comment.aut_photo" />
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
            <!--  -->
            <van-tag plain @click="openReply(comment.com_id)">{{ comment.reply_count }}回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 提交模块 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="写评论...">
        <!--van-loading  通过   submiting 状态来控制显示-->
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" @click="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 回复列表组件 -->
    <van-action-sheet  @closed="reply.commentId=null"  :round="false" v-model="showReply" class="reply_dailog" title="回复评论">
      <!-- 回复列表组件  加载状态  finshed  finshed-text=“-->
      <!-- :immediate-check="false"  控制当前 van-list组件是否主动检查滚动 -->
      <van-list
        @load="getReply"
        :immediate-check="false"
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
      >
        <div
          class="item van-hairline--bottom van-hairline--top"
          v-for="reply in reply.list"
          :key="reply.com_id.toString()"
        >
          <van-image round width="1rem" height="1rem" fit="fill" :src="reply.aut_photo"/>
          <div class="info">
            <p>
              <!-- 用户昵称 -->
              <span class="name">{{reply.aut_name}}</span>
            </p>
            <!-- 评论内容 -->
            <p>{{reply.content}}</p>
            <p>
              <!-- 时间 -->
              <span class="time">{{reply.pubdate|relTime}}</span>
            </p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments, commentOrReply } from '@/api/article' // 引入封装的获取评论方法  回复评论的方法
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
        list: [], // 用于存放   当前弹出的关于某个评论的回复列表的数据
        commentId: null // 用来存放当前点击的评论
      }
    }
  },
  methods: {
    // 提交评论的方法
    async submit () {
      if (!this.value) return false // 表示如果单签评论内容为空 就立刻返回
      this.submiting = true // 将提交的状态设置成true   控制用户单位时间内评论的数据次数
      await this.$sleep()// 强制等待500毫秒
      try {
        // 评论
      // 对文章评论
      // 评论评论评论
        // 如果不为空  继续
        // 怎样区分是对文章进行评论还是对评论进行评论
        // 一种方式 通过 reqly.commentID
        let data = await commentOrReply({
        // this.reply.commentId.toString()  存在 就要对  评论进行评论  否者传文章id
          target: this.reply.commentId ? this.reply.commentId.toString() : this.$route.query.articleId, // 要么是当前评论的id要不就文章id
          content: this.value, // 评论内容
          art_id: this.reply.commentId ? this.$route.query.articleId : null // 如果此时对文章进行评论art_id不等传  如果是对的 评论进行评论 文章id必须传
        })
        // 评论成功怎么处理 刷新页面  =》 将评论的数据呈现到 视图上
        // 首先知道加到那个数组最前面
        if (this.reply.commentId) {
          // 对评论进行评论
          this.reply.list.unshift(data.new_obj) // 将数据 加到对首
          // 如果对评论的评论进行评论之后，应该找到该评论  并且  该评论的回复次数+1
          // 如果知道了 comment 就是找到的对象  如果找不到  comment就是 undefind
          const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId.toString())
          comment.reply_count++
        } else {
          // 对文章进行评论
          this.comments.unshift(data.new_obj)
        }
        this.value = '' // 清空输入框
      } catch (error) {
        this.$gnotify({ type: 'danger', message: '评论失败' })
      }
      this.submiting = false // 关闭进度条
    },
    // 打开回复面板
    openReply (commentId) {
      this.showReply = true // 弹出面板
      // 进行若干操作
      this.reply.commentId = commentId // 存储当前点击的commentId
      this.reply.list = [] // 清空原有的数据
      this.reply.offset = null // 重置回复的偏移量 因为每个评论的评论都是从第一页开始
      this.reply.finished = false // 设置成原始状态
      this.reply.loading = true // 主动打开加载状态 因为这个时候没有了自动的检查
      // 开始加载第一页的数据了
      this.getReply() // 开始调用第一页的数据
    },
    // 获取评论的评论  也就是获取评论的数据
    async getReply () {
      let data = await getComments({
        type: 'c', // 获取评论的评论
        offset: this.reply.offset, // 偏移量
        source: this.reply.commentId.toString() // 获取文章id   代表  获取的评论（id）的评论
      })
      // 拿到的data只是请求的第一页数据
      this.reply.list.push(...data.results) // 添加数据到评论的尾部
      this.reply.loading = false // 关闭加载状态
      this.reply.finished = data.end_id === data.last_id // 加载状态
      if (!this.reply.finished) {
        // 如果没结束
        this.reply.offset = data.last_id // 将last_id设置成偏移量 给下一页请求使用
      }
    },
    // 获取评论数据
    // 一级评论
    async onLoad () {
      // 加载我们评论数据
      //  加载评论数据
      let data = await getComments({
        type: 'a', // 获取类型
        offset: this.offset, // 偏移量
        source: this.$route.query.articleId // 获取文章的id
      })
      this.comments.push(...data.results) // 将数据添加到当前评论列表的尾部
      this.loading = false // 关闭正在上拉加载的状态
      this.finished = data.last_id === data.end_id // 如果当前页ID等于整个评论最后一个id 表示 我们已经请求万了所有的数据
      if (!this.finished) {
        // 表示 last_id 和 end_id不等 不等的话表示 还有下一页数据
        this.offset = data.last_id // 将last_Id设置成下一页的请求依据
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
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
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
  .van-action-sheet__content {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
