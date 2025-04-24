<template>
  <view class="play-rate-list" :style="[boxStyle]">
    <view v-for="(item, index) in ['0.5', '0.8', '1.0', '1.25', '1.5']" :key="index" class="play-rate-item"
      :data-rate="item" @tap.stop="switchRate">
      <text class="c-white ta-c" :style="[rateStyle(item)]">
        {{ item }}
      </text>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      rateShow: {
        type: Boolean,
        default: true
      },
      currentRate: {
        type: Number,
        default: 1
      },
      isFullScreen: {
        type: Boolean,
        default: false
      },
      activeColor: {
        type: String,
        default: '#00d8ff'
      }
    },
    computed: {
      rateStyle() {
        return (item) => {

          let style = {}
          if (this.isFullScreen) {
            // style = { left: this.safePadding + 'px' }
          }
          if (item == this.currentRate) {
            style.color = this.activeColor
          }
          return style
        }
      },
      boxStyle() {
        let style = {}
        if (this.rateShow) {
          style = { width: '200px' }
        }
        return style
      },
    },
    data() {
      return {}
    },
    created() {},
    mounted() {},
    onUnload() {},
    methods: {
      switchRate(e) {
        this.$emit('change',  Number(e.currentTarget.dataset.rate))
      },
    },
  }
</script>

<style lang="scss" scoped>
  .play-rate-list {
    width: 0;
    top: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: width 0.3s ease;
    background-color: rgba(0, 0, 0, 0.65);
    z-index: 999;
  }

  .play-rate-item {
    transition: color ease 0.3s;
    height: 30px;
    line-height: 30px;
  }

  .ta-c {
    text-align: center;
  }

  .rate-text-full-screen {
    // line-height: 80px;
    // height: 80px;
  }

  .rate-active {
    color: #00d8ff;
  }
</style>