<template>
  <div class="container">
    <van-tabs v-model="activeIndex" swipeable>
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
      <!-- 因为一个tab标签  对应一个 -->
      <!-- 要监听子组件事件 就要在子组件标签上 写监听 -->
        <article-list @showAction="openMoreAction" :channel_id="channel.id"></article-list>
      </van-tab>
    </van-tabs>
    <!-- 显示编辑频道的图标 -->
    <span class="bar_btn" @click="showChannelEdit=true">
      <van-icon name="wap-nav" />
    </span>
    <!-- 放置弹层 -->
    <van-popup  :style="{ width: '80%' }" v-model="showMoreAction">
    <!-- 包裹反馈组件 -->
    <!-- report 事件中的第一个参数$event 实际上就是 moreAction组件 传出的type -->
    <!-- $event 就是一个参数  为了传参用的 -->
    <more-action @dislike="diclikeOrReport($event,'dislike')" @report="diclikeOrReport($event,'report')"></more-action>
    </van-popup>
    <!-- 编辑频道 -->
    <van-action-sheet :round="false" v-model="showChannelEdit" title="编辑频道">
      <!-- 放置频道编辑组件 -->
      <!-- 父组件监听选择频道事件 -->
        <channel-edit @delChannel="delChannel" :activeIndex="activeIndex" @selectChannel="selectChannel" :channels="channels"></channel-edit>
    </van-action-sheet>
  </div>
</template>

<script>
import { getMyChannels, delChannel } from '@/api/channels'
import ArticleList from './components/article-list'
import MoreAction from './components/more-action'
import { disLikeArticle, reportArticle } from '@/api/article'
import eventBus from '@/utils/eventBus'
import ChannelEdit from './components/channel-edit'
export default {
  name: 'home', // devtools查看组件时  可以看到 对应的name名称
  data () {
    return {
      activeIndex: 0, // 默认启动第0 个标签
      channels: [], // 频道需要的数据
      showMoreAction: false, // 控制反馈组件显示隐藏
      articleId: null, // 接收文章的ID
      showChannelEdit: false // 设置频道编辑的显示或者隐藏

    }
  },
  components: {
    ArticleList, MoreAction, ChannelEdit
  },
  methods: {
    // 删除频道的方法
    async  delChannel (id) {
      try {
        await delChannel(id) // 表示删除数据成功
        // 移除自身 data中channels中的数据
        let index = this.channels.findIndex(item => item.id === id) // 找打删除的索引
        if (index <= this.activeIndex) {
          // 如果删除的频道在当前激活频道之前或者就是当前激活频道
          // 要把我们的激活索引往前挪一位
          this.activeIndex = this.activeIndex - 1
        }
        if (index > -1) {
          this.channels.splice(index, 1) // 移除当前频道
        }
      } catch (error) {
        this.$gnotify({ type: 'danger', message: '删除频道失败' })
      }
    },
    // 要选择切换到对应的频道 关闭弹层
    selectChannel (id) {
      let index = this.channels.findIndex(item => item.id === id) // 获取频道的索引
      this.activeIndex = index // 将tab激活标签切换到当前对应的标签xia
      this.showChannelEdit = false // 关闭弹层
    },
    async  getMyChannels () {
      let data = await getMyChannels()
      this.channels = data.channels // 更新原来的数据
    },
    // 监听子组件事件
    openMoreAction (artId) {
      // 监听子组件事件 打开弹层
      this.showMoreAction = true
      // console.log(artId)
      this.articleId = artId.toString()// 接收不喜欢id
    },
    // // 调用不喜欢的文章的接口
    // async dislike () {
    //   try {
    //     await disLikeArticle({ target: this.articleId })
    //     this.$gnotify({
    //       type: 'success',
    //       message: '操作成功'
    //     })
    //     // 触发一个事件  发出一个广播 听到广播的文章列表 去删除对应的数据
    //     // 文章id 频道id
    //     eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
    //     this.showMoreAction = false // 关闭弹层
    //   } catch (error) {
    //     this.$gnotify({
    //       type: 'danger',
    //       message: '操作失败'
    //     })
    //   }
    // },
    // // 调用举报文章的接口
    // async report (type) {
    //   try {
    //     await reportArticle({ target: this.articleId, type })
    //     this.$gnotify({
    //       type: 'success',
    //       message: '操作成功'
    //     })
    //     // 同理也要讲当前的数据删除掉
    //     // 这个也触发了一个事件 发出广播 听到广播的文章类表 去删除对应的数据
    //     // 文章id  频道id
    //     eventBus.$on('delArticle', this.articleId, this.channels[this.activeIndex].id)
    //     this.showMoreAction = false // 关闭弹层
    //   } catch (error) {
    //     this.$gnotify({
    //       type: 'success',
    //       message: '操作失败'
    //     })
    //   }
    // },

    // 不喜欢或者举报  把两个功能合并到了一起
    // operateType 操作类型 dislike /report
    // params 是传输举报类型参数  在传给上面的$event
    async diclikeOrReport (params, operateType) {
      // console.log(params)
      try {
        // 三元表达式   判断是dislike（不感兴趣） 还是 report（举报）
        operateType === 'dislike' ? await disLikeArticle({ target: this.articleId })
          : await reportArticle({ target: this.articleId, type: params })
        this.$gnotify({
          type: 'success',
          message: '操作成功'
        })
        // 触发一个事件  发出一个广播 听到广播的文章列表 去删除对应的数据
        // 文章id 频道id
        eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        this.showMoreAction = false // 关闭弹层
      } catch (error) {
        this.$gnotify({
          type: 'danger',
          message: '操作失败'
        })
      }
    }

  },
  created () {
    // 刷新
    this.getMyChannels()
  }

}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
//编辑频道面板样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.van-action-sheet .van-action-sheet__header[data-v-5954443c] {
    background: #f85959;
    color: #fff;
}
</style>
