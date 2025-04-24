<template>
	<!-- #ifndef APP-NVUE -->
	<view class="yingbing-slider"
	:prop="sliderProp"
	:change:prop="slider.propWatcher"
	@touchstart="slider.touchstart"
	@touchmove="slider.touchmove"
	@touchend="slider.touchend"
	@touchcancel="slider.touchcancel">
	<!-- #endif -->
	<!-- #ifdef APP-NVUE -->
	<view class="yingbing-slider"
	@touchstart="slidertouchstart"
	@touchmove="slidertouchmove"
	@touchend="slidertouchend"
	ref="yingbingSlider">
	<!-- #endif -->
		<view
		class="yingbing-slider-item"
		:class="'yingbing-slider-item_' + item"
		v-for="(item, index) in dataSync"
		:ref="'yingbingSliderItem_' + item"
		:key="item"
		:style="{
			'transform': translate + '(' + ( item == prevIndex ? '-' + fullSize : item == nextIndex ? fullSize : 0 )  + ')'
		}">
			<!-- #ifdef MP -->
			<mp-child class="yingbing-slider-item" v-if="item > -1 && item < count && componentName" :item="data[item]" :index="item" :componentName="componentName"></mp-child>
			<slot v-if="item > -1 && item < count && !componentName" :name="'wx:' + item"></slot>
			<!-- #endif -->
			<!-- #ifndef MP -->
			<slot v-if="item > -1 && item < count" :item="data[item]" :index="item"></slot>
			<!-- #endif -->
		</view>
		<!-- #ifdef APP-NVUE -->
		<!-- <view
		class="yingbing-slider-item yingbing-slider-item_1"
		:ref="'yingbingSliderItem_' + index1"
		:style="{
			'transform':vertical ? 'translateY(-3050rpx)' : 'translateX(-750rpx)'
		}">
			<slot :name="index1"></slot>
		</view>
		<view
		class="yingbing-slider-item yingbing-slider-item_2"
		:ref="'yingbingSliderItem_' + index2">
			<slot :name="index2"></slot>
		</view>
		<view
		class="yingbing-slider-item yingbing-slider-item_3"
		:ref="'yingbingSliderItem_' + index3"
		:style="{
			'transform': vertical ? 'translateY(3050rpx)' : 'translateX(750rpx)'
		}">
			<slot :name="index3"></slot>
		</view> -->
		<!-- #endif -->
		<view class="yingbing-slider-pulldown"
		:style="[pulldownStyle]" v-if="pulldownable" ref="yingbing_slider_pulldown">
			<view class="yingbing-slider-pulldown-item yingbing-slider-pulldown-default" ref="yingbing_slider_pulldown_default">
				<slot name="pulldownDefault"></slot>
			</view>
			<view class="yingbing-slider-pulldown-item yingbing-slider-pulldown-ready" ref="yingbing_slider_pulldown_ready">
				<slot name="pulldownReady"></slot>
			</view>
			<view class="yingbing-slider-pulldown-item yingbing-slider-pulldown-loading" ref="yingbing_slider_pulldown_loading">
				<slot name="pulldownLoading"></slot>
			</view>
			<view class="yingbing-slider-pulldown-item yingbing-slider-pulldown-success" ref="yingbing_slider_pulldown_success">
				<slot name="pulldownSuccess"></slot>
			</view>
			<view class="yingbing-slider-pulldown-item yingbing-slider-pulldown-fail" ref="yingbing_slider_pulldown_fail">
				<slot name="pulldownFail"></slot>
			</view>
		</view>
		<view class="yingbing-slider-pullup"
		:style="[pullupStyle]" v-if="pullupable" ref="yingbing_slider_pullup">
			<view class="yingbing-slider-pullup-item yingbing-slider-pullup-default" ref="yingbing_slider_pullup_default">
				<slot name="pullupDefault"></slot>
			</view>
			<view class="yingbing-slider-pullup-item yingbing-slider-pullup-ready" ref="yingbing_slider_pullup_ready">
				<slot name="pullupReady"></slot>
			</view>
			<view class="yingbing-slider-pullup-item yingbing-slider-pullup-loading" ref="yingbing_slider_pullup_loading">
				<slot name="pullupLoading"></slot>
			</view>
			<view class="yingbing-slider-pullup-item yingbing-slider-pullup-success" ref="yingbing_slider_pullup_success">
				<slot name="pullupSuccess"></slot>
			</view>
			<view class="yingbing-slider-pullup-item yingbing-slider-pullup-fail" ref="yingbing_slider_pullup_fail">
				<slot name="pullupFail"></slot>
			</view>
		</view>
	</view>
</template>
<script>
	// #ifdef APP-NVUE
	import sliderBindingx from '../../modules/slider_bindingx.js'
	// #endif
	// #ifdef MP
	import MpChild from '../../modules/mpChild.vue'
	// #endif
	export default {
		// #ifdef APP-NVUE
		mixins: [sliderBindingx],
		// #endif
		// #ifdef MP
		components: {
			MpChild
		},
		// #endif
		props: {
			// #ifdef MP
			// 控制小程序子组件显示，传入组件名称则不使用插槽
			componentName: {
				type: String,
				default: ''
			},
			// #endif
			data: {
				type: Array,
				default () {
					return new Array
				}
			},
			current: {
				type: Number,
				default: 0
			},
			//垂直滑动
			vertical: {
				type: Boolean,
				default: false
			},
			//衔接滑动
			circular: {
				type: Boolean,
				default: false
			},
			//滑动周期
			duration: {
				type: Number,
				default: 100
			},
			//开启下拉刷新
			pulldownable: {
				type: Boolean,
				default: false
			},
			//下拉刷新高度
			pulldownHeight: {
				type: Number,
				default: 80
			},
			//开启上拉加载
			pullupable: {
				type: Boolean,
				default: false
			},
			//上拉加载高度
			pullupHeight: {
				type: Number,
				default: 80
			},
			//滑动容错距离
			sliderFault: {
				type: Number,
				default: 20
			}
		},
		computed: {
			dataSync () {
				let arr = []
				if ( this.prevIndex >= 0 ) {
					arr.push(this.prevIndex)
				}
				arr.push(this.currentIndex)
				if ( this.nextIndex < this.count ) {
					arr.push(this.nextIndex)
				}
				return this.refreshing ? [] : arr
			},
			nextIndex () {
				return this.currentIndex + 1 > this.count - 1 && this.count > 2 ? 0 : this.currentIndex + 1
			},
			prevIndex () {
				return this.currentIndex - 1 < 0 && this.count > 2 ? this.count - 1 : this.currentIndex - 1
			},
			count () {
				return this.data.length
			},
			sliderProp () {
				return {
					vertical: this.vertical,
					circular: this.circular,
					duration: this.duration,
					pulldownable: this.pulldownable,
					pullupable: this.pullupable,
					pulldownHeight: this.pulldownHeight,
					pullupHeight: this.pullupHeight,
					loadingState: this.loadingState,
					nextIndex: this.nextIndex,
					prevIndex: this.prevIndex,
					currentIndex: this.currentIndex,
					count: this.count,
					slideTo: this.slideTo,
					sliderFault: this.sliderFault,
					translate: this.translate
				}
			},
			pulldownStyle () {
				return this.vertical ? {
					left: 0,
					right: 0,
					top: 0,
					height: this.pulldownHeight + 'px',
					transform: this.translate + '(-' + this.pulldownHeight + 'px)'
				} : {
					left: 0,
					top: 0,
					bottom: 0,
					width: this.pulldownHeight + 'px',
					transform: this.translate + '(-' + this.pulldownHeight + 'px)'
				}
			},
			pullupStyle () {
				return this.vertical ? {
					left: 0,
					right: 0,
					bottom: 0,
					height: this.pullupHeight + 'px',
					transform: this.translate + '(' + this.pullupHeight + 'px)'
				} : {
					right: 0,
					top: 0,
					bottom: 0,
					width: this.pullupHeight + 'px',
					transform: this.translate + '(' + this.pullupHeight + 'px)'
				}
			},
			translate () {
				return this.vertical ? 'translateY' : 'translateX'
			},
			fullSize () {
				return this.vertical ? '3050rpx' : '750rpx'
			}
		},
		data () {
			return {
				currentIndex: 0,
				loadingState: '',
				slideTo: 0,
				refreshing: false
			}
		},
		created() {
			this.currentIndex = this.current
		},
		methods: {
			handleSliderChange (value) {
				if ( value > 0 ) {
					this.currentIndex = this.currentIndex + value > this.count - 1 ? 0 : this.currentIndex + value
				} else {
					this.currentIndex = this.currentIndex + value < 0 ? this.count - 1 : this.currentIndex + value
				}
				this.$emit('change', {
					current: this.currentIndex,
					detail: this.data[this.currentIndex]
				})
				this.$emit('update:current', this.currentIndex)
			},
			pullingRefresh (type) {
				this.$emit(type, (state) => {
					this.loadingState = state
					// #ifdef APP-NVUE
					this.resetPullingBindingx()
					// #endif
				})
			},
			slideToNext () {
				// #ifdef APP-NVUE
				this.slideToNextBindingX()
				// #endif
				// #ifndef APP-NVUE
				this.slideTo = 0
				this.$nextTick(function () {
					this.slideTo = 1
				})
				// #endif
				
			},
			slideToPrev () {
				// #ifdef APP-NVUE
				this.slideToPrevBindingX()
				// #endif
				// #ifndef APP-NVUE
				this.slideTo = 0
				this.$nextTick(function () {
					this.slideTo = -1
				})
				// #endif
			},
			refresh () {
				this.refreshing = true
				this.$nextTick(function () {
					this.currentIndex = this.current
					this.refreshing = false
				})
			},
			resetLoading () {
				this.loadingState = ''
			}
		},
		watch: {
			current (newVal) {
				this.currentIndex = newVal
			}
		}
	}
</script>
<!-- #ifdef APP-VUE || H5 || MP-QQ || MP-WEIXIN -->
<script lang="wxs" module="slider" src="../../modules/slider.wxs"></script>
<!-- #endif -->
<style>
	.yingbing-slider {
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
		overflow: hidden;
		position: relative;
	}
	.yingbing-slider-pulldown, .yingbing-slider-pullup {
		position: absolute;
	}
	.yingbing-slider-pulldown-item, .yingbing-slider-pullup-item {
		/* #ifndef APP-NVUE */
		visibility: hidden;
		/* #endif */
		/* #ifdef APP-NVUE */
		opacity: 0;
		/* #endif */
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.yingbing-slider-item {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	/* #ifdef MP */
	/deep/ .scoped-ref {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	yingbing-slider {
		display: block;
	}
	/* #endif */
</style>
