<template>
   <div class="container">
    <van-nav-bar @click-right="saveUserInfo" left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  @click="showPhoto=true" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <!-- 昵称 -->
      <van-cell is-link title="名称" @click="showName=true" :value="user.name" />
      <!-- 性别 -->
      <van-cell is-link title="性别" @click="showGender=true" :value='user.gender === 0 ? "男":"女"'/>
      <!-- 生日 -->
      <van-cell is-link title="生日" @click="showDate" :value="user.birthday" />
    </van-cell-group>
    <!-- 弹层 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1本地相册选择图片 -->
      <!-- 拍照 -->
   <van-cell @click="openChangeFile" is-link title="本地相册选择图片"></van-cell>
       <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 弹 昵称  点击确定 关闭弹层  round 和round=true 效果一样-->
    <van-popup :close-on-click-overlay="false" v-model="showName" round style="width:80%">
      <!-- 编辑用户昵称  双向数据绑定的昵称-->
      <van-field :error-message="nameMag" v-model="user.name" type="textarea" rows="4"></van-field>
      <!-- 关闭弹层 -->
      <van-button type="info" size="large" block @click="btnName" style="width:100%">确定</van-button>
    </van-popup>
    <!-- 性别选择上拉菜单  性别数据通过actions属性显示 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <!-- v-model 当前的时间  取消时将弹层关闭 -->
      <van-datetime-picker
           v-model="currentDate"
           type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="showBirthDay=false"
          @confirm="confirmDate"
         />
    </van-popup>
    <!-- 设置一个  文件上传控件 但是不能让人看到 -->
    <input @change="upload" ref="myFile" type="file" name="" style="display:none">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updateImg, saveUserInfo } from '@/api/user' // 引入获取资料的方法
export default {
  name: 'profile',
  data () {
    return {
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间  永远小于等于当前的时间
      currentDate: new Date(), // 当前时间

      showBirthDay: false, // 是否显示日期弹层
      showGender: false, // 是否显示性别选择弹层
      showPhoto: false, // 是否显示悬着头像的弹层
      showName: false, // 是否显示编辑昵称的弹层
      // 定义数据
      user: {
        name: '', // 用户名字
        gender: '', // 性别 0男  1女
        birthday: '' // 给一个默认的生日
      },
      actions: [{ name: '男' }, { name: '女' }], // 性别
      nameMag: ''// 专门来控制显示的错误信息
    }
  },
  methods: {
    // 绑定按钮事件
    // 用户昵称
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        // 如果长度 小于1 或者大于7 表示不符合昵称的要求
        this.nameMag = '请输入大于1小于7的昵称名字'
        return false // 不会继续往下执行了
      }
      // 如果满足的话  就会执行
      this.nameMag = '' // 先把消息清空
      this.showName = false // 关闭弹层
    },
    // 用户性别
    // 当点击菜单项时 会触发该方法
    selectItem (item) {
      // item就是选择的对象
      this.user.gender = item.name === '男' ? 0 : 1 // 根据判断得到当前的性别
      this.showGender = false // 关闭当前的弹层
    },
    // 生日当前的时间 触发
    showDate () {
      this.currentDate = new Date(this.user.birthday) /// 将当前用户的生日  赋值给绑定当前时间数据
      this.showBirthDay = true // 显示生日弹层
    },
    // 点击生日弹层的确定时
    confirmDate (date) {
      this.user.birthday = dayjs(date).format('YYYY-MM-DD') // 格式化方法  在赋值给user.birthday 生日
      this.showBirthDay = false
    },
    // 获取用户资料的方法
    async  getUserProfile () {
      let data = await getUserProfile()
      // 将数据赋值给user
      this.user = data
    },
    // 点击选择图片时触发
    openChangeFile () {
      // 上传文件
      // 触发文件上传组件的点击事件
      // 获取input的dom对象
      this.$refs.myFile.click() // 触发上传组件
    },
    async  upload () {
      // 这里应该做什么？
      // 上传我们的头像  获取我们选择的图片呢
      // this.$refs.myFile.files[0]
      // 首先  应该把头像上传到服务器上
      // 调用编辑头像的方法
      let data = new FormData()
      data.append('photo', this.$refs.myFile.files[0])
      let result = await updateImg(data) // result 上传成功返回结果
      // 应该把之地同步的设置给 当前页面数据
      this.user.photo = result.photo // 将上传成功的头像 设置给当前的头像
      this.showPhoto = false
    },
    // 保存方法 调用接口  这里是不需要传我们的photo 数据的
    // 1.我me通过别的方法 更新了头像
    // 2.要求photo 是bese64 的字符串
    async  saveUserInfo () {
      // 保存用户信息
      try {
        await saveUserInfo({ ...this.user, photo: null })
        this.$gnotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$gnotify({ type: 'danger', message: '保存失败' })
      }
    }

  },
  created () {
    this.getUserProfile() // 调用获取用户资料的方法
  }
}
</script>

<style lang="less" scoped>

</style>
