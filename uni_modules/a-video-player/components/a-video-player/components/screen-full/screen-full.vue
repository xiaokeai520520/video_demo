<template>
  <view class="video-content-box" @tap.stop.prevent="onclick">
    <!-- 头部控件区域 -->
    <!-- <view
            class="video-control-header"
            v-if="controlsShow && showPlayRate"
            @tap.stop.prevent="controllerAreaClick"
            :style="[headerStyle]"
          >
            <view class="back plr-10" @tap.stop.prevent="fullScreen">
              <text class="iconfont">&#xe600;</text>
            </view>
            <view class="header-right">
              <view @tap.stop.prevent="onCollectClick" class="plr-10">
                <text v-if="isCollect" class="iconfont">&#xe65b;</text>
                <text v-else class="iconfont">&#xe65a;</text>
              </view>
              <view @tap.stop.prevent="onShareClick"><text class="iconfont plr-10">&#xe626;</text></view>
              <view @tap.stop.prevent="onMoreClick"><text class="iconfont plr-10">&#xe624;</text></view>
            </view>
          </view> -->
    <!-- 底部控件区域 -->
    <view
      class="video-control-footer"
      v-if="controlsShow && showPlayRate"
      @tap.stop.prevent="controllerAreaClick"
      :style="[headerStyle]"
     >
      <!-- 播放/暂停 -->
      <view v-if="playing" class="plr-10" @tap.stop.prevent="pauseVideo">
        <text class="iconfont" >&#xe633;</text>
      </view>
      <view v-else class="plr-10" @tap.stop.prevent="playVideo">
        <text class="iconfont">&#xe623;</text>
      </view>
      <!-- <text class="sm-title">{{ currentDuration }}/{{ lastDuration }}</text> -->
      <!-- 进度条 -->
      <text class="c-white time">{{ secondToMinute(current) }}</text>
      <!-- <VideoSlider
        :max="duration"
        :value="current"
        :width="sliderWidth"
        @touchStart="preventHideControl"
        @change="changeCurrent"
        :backgroundColor="color"
        :blockColor="color"
        :isFullScreen="isFullScreen"
      ></VideoSlider> -->
      <text class="c-white time">{{ secondToMinute(duration) }}</text>
      <!-- 全屏 -->
      <view class="plr-10" @tap.stop.prevent="enterFullScreen">
        <text class="iconfont">&#xe62b;</text>
      </view>
    </view>
  </view>
</template>

<script>
import ComCoverView from '../com-cover-view/com-cover-view.vue'
export default {
  components: {
    ComCoverView
  },
  data() {
    return {
      controlsShow: true,
      showPlayRate: true,
      headerStyle: {},
      list: [],

      videoContext: '',
      isLocked: false,
      rateShow: false,
      isOpenBarrage: false,
      controlsShow: true,
      videoCurrentTime: 0,
      videoPreTime: 0,
      currentRate: 1,
      playing: false,
      isFullScreen: false,
      color: '#ffffff',
      duration: 100,
      current: 0,
      padding: 0
    }
  },
  onShow() {},
  onLoad() {},
  methods: {
    playVideo(){
      
    },
    pauseVideo(){
      
    },
    enterFullScreen(){
      
    },
    secondToMinute(second) {
      let sec = Math.floor(second % 60)
      let minute = Math.floor(second / 60)

      return `${minute < 10 ? '0' + minute : minute}:${
        sec < 10 ? '0' + sec : sec
      }`
    }
  }
}
</script>

<style scoped>
.video-content-box {
  color: #fff;
  flex: 1;
  /* #ifndef APP-PLUS-NVUE */
  display: flex;
  height: 100%;
  /* #endif*/
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: absolute;
}
.video-control-footer {
  z-index: 99;
  background-color: rgba(1, 1, 1, 0.5);
  height: 90rpx;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex: 1;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

/* #ifndef APP-PLUS-NVUE */
@font-face {
  font-family: 'fvideoplayicon';
  src: url('fvideoplayicon.ttf') format('truetype');
}
/* #endif*/
.iconfont {
  color: #ffffff;
  font-family: fvideoplayicon !important;
  /* #ifndef APP-PLUS-NVUE */
  font-family: 'fvideoplayicon' !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* #endif*/
  font-style: normal;
  font-size: 20px;

}
</style>
