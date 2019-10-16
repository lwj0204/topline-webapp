<template>
<!-- 组件
    navbar
    tab标签
    pullrefresh下拉刷新
    list列表
-->
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" fixed/>
    <!-- 频道列表 -->
    <van-tabs v-model="active" animated swipeable>
      <div slot="nav-right" class="wap-nav" @click="isChannelShow = true">
        <van-icon class="wap-nav" name="wap-nav" size="30"/>
      </div>

        <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id" >
            <!-- 文章列表 -->
            <van-pull-refresh v-model="channel.isPullDownLoading" @refresh="onRefresh">
              <van-list
                  v-model="channel.loading"
                  :finished="channel.finished"
                  finished-text="没有更多了"
                  @load="onLoad"
                  >
                  <van-cell
                  v-for="(article,index) in channel.articles"
                  :key="index"
                  :title="article.title"
                  >
                  <div slot="label">
                    <van-grid :border="false" :column-num="3">
                      <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                        <van-image lazy-load height="80" :src="img" />
                      </van-grid-item>
                    </van-grid>
                    <div class="article-info">
                      <div class="meta">
                        <span>{{ article.aut_name }}</span>
                        <span>{{ article.comm_count }}评论</span>
                        <span>{{ article.pubdate | relativeTime }}</span>
                      </div>
                  </div>
                  </div>
                </van-cell>
              </van-list>
            </van-pull-refresh>
        </van-tab>
    </van-tabs>

    <!-- 频道管理 -->
    <van-popup
      v-model="isChannelShow"
      round
      position="bottom"
      :style="{ height: '95%' }"
      closeable
      close-icon-position="top-left"
    >
      <div class="channel-container">
        <van-cell title="我的频道" :border="false">
          <van-button
          @click="isEditShow = !isEditShow"
          type="danger"
          size="mini">
            {{isEditShow ? '完成':'编辑'}}
          </van-button>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item
            v-for="(channel,index) in channels"
            :key="index"
            :text="channel.name"
            @click="onMyChannelClick(index)"
          >
          <van-icon
          v-show="isEditShow"
          class="close-icon"
          name="close"
          slot='icon'
          />

        </van-grid-item>
        </van-grid>
        <van-cell title="推荐频道" :border="false"/>
        <van-grid :gutter="10">
          <van-grid-item
            v-for="(channel,index) in recommondChannels"
            :key="index"
            :text="channel.name"
            @click="onAddChannel(channel)"
          />
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getDefaultChannels, getAllChannels } from '@/api/channel'
import { getArticles } from '@/api/articles'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      // list: [],
      // loading: false,
      // finished: false,
      channels: [], // 我的频道列表
      isChannelShow: false,
      allChannels: [], // 所有频道列表
      isEditShow: false
    }
  },
  watch: {
    // 函数名就是要监视的数据成员名称
    channels (newVal) {
      setItem('channels', newVal)
    }
  },
  computed: {
    // 获取推荐频道
    recommondChannels () {
      const arr = []
      // 遍历所有频道
      this.allChannels.forEach(channel => {
        // 判断 channel 是否存在我的频道中
        // 如果不存在，就证明是推荐的频道
        //
        const ret = this.channels.find(item => item.id === channel.id)
        if (!ret) {
          arr.push(channel)
        }
      })
      return arr
      // return 所有频道 - 我的频道
    }
  },

  created () {
    // 获取我的频道
    this.loadChannels()
    // 获取所有频道
    this.loadAllChannels()
  },
  methods: {
    async onLoad () {
      // 获取当前激活的频道对象
      const activeChannel = this.channels[this.active]
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id: activeChannel.id, // 频道ID
        timestamp: activeChannel.timestamp || Date.now(), // 时间戳
        with_top: 1 // 是否包含置顶
      })
      // 2.将数据添加到当前频道.articles
      // activeChannel.articles = activeChannel.articles.concat(data.data.results)
      // 展开运算符 ...
      activeChannel.articles.push(...data.data.results)
      // 3.结束当前频道的loading = false
      activeChannel.loading = false
      // 4.判断是否还有数据
      if (data.data.pre_timestamp) {
        // 更新获取下一页数据的页码时间戳
        activeChannel.timestamp = data.data.pre_timestamp
      } else {
        // 如果没有下一页数据 结束
        activeChannel.finished = true
      }
    },
    // onLoad () {
    //   // 当前频道
    //   const activeChannel = this.channels[this.active]
    //   // 1.请求获取数据
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       // 2.将数据添加到当前频道
    //       activeChannel.articles.push(activeChannel.articles.length + 1)
    //     }
    //     // 3.结束本次 loading
    //     activeChannel.loading = false
    //     // 4.判断数据是否已全部加载结束 如果没有数据 finish 设置为true
    //     if (activeChannel.articles.length >= 40) {
    //       activeChannel.finished = true
    //     }
    //   }, 500)
    // },
    // onLoad () {
    //   // 异步更新数据
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1)
    //     }
    //     // 设置本次加载状态结束
    //     // 每次数据加载完毕。列表组件都会判断数据是否满足一屏了
    //     // 如果当前数据不够一屏 他就继续onload
    //     // 本次不终止，它不会继续加载更多
    //     this.loading = false

    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true
    //     }
    //   }, 2000)
    // },

    // 加载我的频道列表
    async loadChannels () {
      let channels = []
      // 读取本地存储中的频道列表
      const localChannels = getItem('channels')
      // 如果有本地存储的频道列表就使用本地存储的频道列表
      if (localChannels) {
        channels = localChannels
      } else {
        // 如果没有，就请求获取后台推荐的频道列表
        const { data } = await getDefaultChannels()
        console.log(data)
        channels = data.data.channels
      }

      channels.forEach(channel => {
        channel.articles = [] // 存储频道的文章列表
        channel.finished = false // 存储频道的加载结束状态
        channel.loading = false // 存储频道的加载更多 loading 状态
        channel.timestamp = null // 存储获取频道下一页的时间戳
        channel.isPullDownLoading = false // 存储频道的下拉刷新loading状态
      })

      // 最后把数据更新到组件中
      this.channels = channels
    },
    // 下拉刷新
    async onRefresh () {
      const activeChannel = this.channels[this.active]
      // 1.请求获取最新推荐的文章列表
      const { data } = await getArticles({
        channel_id: activeChannel.id, // 频道ID
        timestamp: Date.now(), // 下拉刷新永远都是在获取最新事件戳
        with_top: 1 // 是否包含置顶
      })
      // 2.将数据添加到文章列表顶部
      activeChannel.articles.unshift(...data.data.results)

      // 3.关闭下拉刷新的 loading 状态
      activeChannel.isPullDownLoading = false

      // 4.提示
      this.$toast('刷新成功')
    },
    // 获取所有频道列表
    async loadAllChannels () {
      const { data } = await getAllChannels()
      // console.log(data)
      this.allChannels = data.data.channels
    },
    // 添加频道
    onAddChannel (channel) {
      this.channels.push(channel)
    },
    // 当我的频道项点击处理函数
    onMyChannelClick (index) {
      if (this.isEditShow) {
        // 如果是编辑状态，删除频道
        this.channels.splice(index, 1)
      } else {
        // 如果是非编辑状态，切换频道展示
        // 切换频道展示
        this.active = index
        // 关闭弹层
        this.isChannelShow = false
      }
    }
  }
}
</script>

<style lang='less' scoped>
.home {
  .article-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .meta span {
      margin-right: 10px;
    }
  }
  // 展示频道的菜单列表
.wap-nav {
    position: sticky;
    right: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: 0.8;
  }

  // 标签组件
  .van-tabs{
     /deep/ .van-tabs__wrap{
      position: fixed;
      top:46px;
      z-index: 2;
      left: 0;
      right: 15px;
    }
    /deep/ .van-tabs__content{
      margin-top: 90px;
      margin-bottom:50px;
    }
  }
  .channel-container{
    padding-top: 30px;
    .close-icon{
      position:absolute;
      top: -5px;
      right: -5px;
    }
  }
}
</style>
