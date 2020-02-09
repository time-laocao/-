<template>
   <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="myList">
         <!-- list的数据分两种 一种是小智同学说的 一种是我自己说的 -->
      <!-- 这个div 要展示两种场景 小智的场景 左边  我的场景 右边 -->
      <!-- 根据当前 name的值 决定 样式 是left 还是right  -->
      <!--  v-bind绑定class的对象语法  当前的样式left还是right -->
      <div :class="{ left: item.name === 'xz', right: item.name!='xz' }"  class="chat-item" v-for="(item,index)  in list" :key="index">
        <!-- 小智同学的图片 -->
        <!-- 需要根据item中的name值 决定是否显示 左侧的图片 或者右侧的图片 -->
        <van-image v-if="item.name === 'xz'" fit="cover" round  :src="XZImg" />
        <div class="chat-pao">{{ item.msg }}</div>
        <!-- 右边再放置一个图片 -->
        <van-image  v-if="item.name !== 'xz'" fit="cover" round :src="photo" />
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
      </div> -->
    </div>
    <div class="reply-container van-hairline--top" @keyup.enter="send()">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <!-- 进度条 的目的是 控制用户的输入频率 -->
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <!-- 点击发送  给小智同学发消息-->
        <span v-else @click.enter="send()" slot="button" style="font-size:12px;color:#999">发送</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import XZImg from '@/assets/images/xz.png'
import io from 'socket.io-client'
export default {
  name: 'chat',
  data () {
    return {
      value: '', // 用来绑定用户谈话内容
      loading: false,
      XZImg, // 在data中定义一个变量
      list: [] // 存放聊天聊天记录  一条记录 代表一个内容
    }
  },
  methods: {
    // 注意: 发出消息之后,要把发出的消息 加入到当前消息的队列中,并且清空输入框
    async  send () {
      // 发送小时的时候，要做什么事情？
      // 获取要发送的你给他
      if (!this.value) return false // 如果为空字符串 就直接直接返回   不继续往下走了
      this.loading = true // 打开加载状态
      // 设置 时间间隔
      await this.$sleep() // 默认时间是 500毫秒
      // 如果不为空  继续往下走
      let obj = {
        name: 'self',
        msg: this.value, // 消息内容
        timestamp: Date.now() // 当前的时间
      }
      // 发送这条消息
      this.socket.emit('message', obj)
      // 把发送的消息  添加到 消息列表里面
      this.list.push(obj) // 在数据中加了一条记录  渲染视图
      this.value = '' // 清空消息
      this.scrollBottom() // 调用滚动的方法
      this.loading = false // 回复状态
    },
    // 接下来,我们定义一个滚动的方法
    scrollBottom () {
      // 在当前视图的更新之后执行
      // 需要通过获取滚动条高度  和设置滚动条距离老滚动
      // 保证更新。视图数据
      // nextTick 会在上一次  数据更新  并且视图完成渲染之后执行
      this.$nextTick(() => {
        // 可以保证我们在滚动的时候 视图已经更新完毕
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight // 滚到底部
      })
    }
  },
  computed: {
    ...mapState(['photo', 'user']) // 映射 vuex 中的公共变量
  },
  // 实例创建完毕之后执行的函数
  created () {
    // 建立和websocket和服务器的链接
    // 原生方法   mew websocket（）
    // 封装 socket.io
    // io （链接地址，{额外参数}）
    this.socket = io('http://ttapi.research.itcast.cn', {
      // qurey参数
      query: {
        token: this.user.token // 从vuex获取用户的token
      }
    }) // 建立链接  用this.socket  接收一个 socket.io的实例对象

    this.socket.on('connect', () => {
      console.log('和服务器链接成功！！！！')
      // 先让小智同学和用户说一句话  模拟说话
      this.list.push({ msg: '你好，同学', name: 'xz' }) // 表示  naem;zx小智同学说的 //模拟的
    })
    // 如何知道链接成功
    // 需要监听  小智同学的回复消息  回调函数是有参数的
    // 这个位置  只有小智同学回复的时候在会调用
    this.socket.on('message', data => {
      // mag（小智同学回复的内容）  timestamp（小智同学回复的时间戳）
      this.list.push({ ...data, name: 'xz' }) // 给name:zx  相当于给我们消息记录下 谁给我们发了消息
      this.scrollBottom() // 滚动
    })
  },
  // 销毁 链接   销毁钩子函数
  beforeDestroy () {
    this.socket.close()
  }

}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
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
}
</style>
