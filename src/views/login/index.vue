<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar
    title="标题"
    />
    <!-- 登录表单 -->
    <van-cell-group>
        <van-field
        v-model="user.mobile"
            required
            clearable
            label="手机号"
            placeholder="请输入手机号"
        />
        <van-field
        v-model="user.code"
            type="password"
            label="验证码"
            placeholder="请输入验证码"
            required
        />
    </van-cell-group>
    <!-- 登录按钮 -->
    <div class="btn-wrap">
        <van-button class="btn" type="info" @click="onLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '15001230123',
        code: '246810'
      }
    }
  },
  methods: {
    async onLogin () {
      try {
        const { data } = await request({
          method: 'POST',
          url: '/app/v1_0/authorizations',
          data: this.user
        })
        console.log(data)
        this.$toast.success('登录成功')
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('登录失败，手机或验证码错误')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
    .btn-wrap {
        padding:20px;
        .btn {
            width: 100%;
            background-color: #6db4fb;
            color: #fff;
        }
    }
}
</style>
