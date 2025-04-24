一个视频播放器

支持开源、一起构建开源生态

# 功能
已完成
- ✅ 全屏，小屏切换，退出
- ✅ 倍速选择、播放
- ✅ 进度条拖动
- ✅ 锁屏
- ✅ 设置初始时间
- ✅ 长按2倍速播放
- ✅ 修复ios,安卓nvue无法显示

待完成
- [ ] 弹幕
- [ ] 自定义页面图标的点击事件
- [ ] 编写使用文档
- [ ] 选集播放
- [ ] 切换清晰度
- [ ] 声音控制
- [ ] 投屏

基础版1.0，如果有需要完善里面的功能的，请留言，优先开发，app端需要使用nvue

# 使用 
```vue
<template>
  <view>
    <uni-section title="基础用法" type="line" padding>
      <view class="example-body">
        <AVideoPalyer src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-uni-app-doc/3c1782e0-60ab-11eb-8ff1-d5dcf8779628.m4v"></AVideoPalyer>
      </view>
    </uni-section>
  </view>
</template>

<script>
  import AVideoPalyer from '@/uni_modules/a-video-player/components/a-video-player/a-video-player.nvue'
  export default {
    components:{
      AVideoPalyer
    },
    data() {
      return {

      };
    },
  }
</script>

<style lang="scss" scoped>
</style>

```

## Props属性
|属性名							|说明												|类型						|默认值	|说明														|
|:-:								|:-:												|:-:						|:-:		|:-:														|
|src								|视频url地址									|String					|-			|必填														|
|initialTime				|设置初始时间，单位秒					|Number，String	|0			|																|
|autoPlay						|自动播放										|Boolean				|false	|																|
|controls						|是否展示控制区域							|Boolean				|true		|																|
|showPlayRate				|全屏时是否显示倍数切换				|Boolean				|true		|																|
|fullScreenPadding	|全屏时，左右的间隔距离，单位px	|Number					|40			|																|
|dragSliderAutoPlay	|拖动滑块，自动播放						|Boolean				|false	|																|
|longTapSpeed				|长按播放速度									|Number, String	|2			|  可选值 0.5/0.8/1.0/1.25/1.5/2	|


## Event事件
|属性名		|说明					|回调参数	|平台差异说明	|
|:-:			|:-:					|:-:			|:-:					|
|@share		|点击分享按钮	|					|							|
|@collect	|点击搜藏按钮	|					|							|