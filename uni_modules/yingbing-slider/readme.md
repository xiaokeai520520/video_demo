#使用须知

* 1、这是一个注重性能的滑动组件，适用于短视频
* 2、这个插件支持APP-NVUE、APP-VUE、H5、微信小程序
* 3、该组件滑动项同时只能存在当前项、前面项、后面项3个，其余项会被销毁，如果需要记录缓存的，比如视频播放时间或者滚动位置等，需要开发者手动记录
* 4、微信小程序可以使用引入子组件的方式使用
* 5、有什么不懂，可以加群 1087735942 聊

#props属性
| 属性名 | 类型 | 默认值 | 可选值 | 说明 |
| :----- | :----: | :----: | :----: | :---- |
| data | Array | ---- | ---- | 列表数据 |
| componentName | String | ---- | ---- | 控制微信小程序在子组件的显示 |
| current | Number | 0 | ---- | 初始化位置 |
| vertical | Boolean | false | true/false | 垂直滑动 |
| circular |Boolean | false | true/false | 衔接滑动（当数据数据大于2时有效） |
| duration | Number | 100 | ---- | 滑动动画时间 |
| pulldownable | Boolean | false | true/false | 开启下拉刷新（circular为true时忽略此属性） |
| pullupable | Boolean | false | true/false | 开启上拉加载（circular为true时忽略此属性） |
| pulldownHeight | Number | 80 | ---- | 下拉刷新控件高度（px） |
| pullupHeight | Number | 80 | ---- | 上拉加载控件高度（px） |
| sliderFault | Number | 20 | ---- | 滑动容错距离（px） |

#event事件
| 事件名 | 参数 | 说明 |
| :----- | :----: | :---- |
| change | current: 当前滑动位置, detail: 当前滑动位置列表数据 | 位置改变事件 |
| pulldown | callback: 回调 | 下拉刷新事件 |
| pullup | callback: 回调 | 上拉加载事件 |

#内置方法
| 方法名 | 参数 | 说明 |
| :--- | :------ | :---- |
| refresh | ---- | 刷新滑动位置（替换数据时使用） |
| slideToNext | ---- | 滑动到下个位置 |
| slideToPrev | ---- | 滑动到上个位置 |

#slot插槽
| 名称  | 说明 |
| :----- | :---- | :---- |
| pulldownDefault | 下拉加载默认提示 |
| pulldownReady | 下拉加载准备提示 |
| pulldownLoading | 下拉加载等待提示 |
| pulldownSuccess | 下拉加载成功提示 |
| pulldownFail | 下拉加载失败提示 |
| pullupDefault | 上拉加载默认提示 |
| pullupReady | 上拉加载准备提示 |
| pullupLoading | 上拉加载等待提示 |
| pullupSuccess | 上拉加载成功提示 |
| pullupFail | 上拉加载失败提示 |


#快速开始
```html
	<yingbing-slider :data="list" style="height: 100vh;">
		<!-- #ifndef MP -->
		<template v-slot="{item, index}">
		<!-- #endif -->
		<!-- #ifndef MP -->
		<template v-for="(item, index) in list" :slot="`wx:${index}`">
		<!-- #endif -->
			<view style="height: 100vh">
				<text style="font-size: 50px;font-weight: bold;color: #fff;">{{item}}</text>
			</view>
		</template>
	</yingbing-slider>
```
```javascript
	export default {
		data () {
			return {
				list: []
			}
		},
		onReady () {
			for ( let i = 0; i < 10; i++ ) {
				this.list.push(i)
			}
		}
	}
```

#引入子组件的使用方式（仅支持微信小程序）
```html
	<!-- 兼容微信小程序先填入自己定义好的组件名 -->
	<yingbing-slider component-name="your-component" :data="list" style="height: 100vh;"></yingbing-slider>
```
```javascript
	export default {
		data () {
			return {
				list: []
			}
		},
		onReady () {
			for ( let i = 0; i < 10; i++ ) {
				this.list.push(i)
			}
		}
	}
```
* 自己定义的组件基本结构
```html
	<view style="height: 100%">
		<text style="font-size: 50px;font-weight: bold;color: #fff;">{{item}}</text>
	</view>
```
```javascript
	export default {
		props: {
			item: {
				type: Number,
				default: 0
			},
			index: {
				type: Number,
				default: 0
			}
		}
	}
```
* 在mpChild组件当中引入（组件位置uni_modules/yingbing-flip/modules/mpChild.vue）
```html
	<view>
	<!-- 在这里引入你的组件 -->
	<your-component :item="item" :index="index" v-if="componentName == 'your-component'"></your-component>
	</view>
```
```javascript
	import YourComponent from '@/components/YourComponent'
	export default {
		components: {
			YourComponent
		},
		props: {
			item: {
				type: [Object, String, Number],
				default () {
					return new Object
				}
			},
			index: {
				type: Number,
				default: 0
			},
			componentName: {
				type: String,
				default: ''
			}
		}
	}
```

#垂直滑动
```html
	<yingbing-slider :data="list" vertical style="height: 100vh;">
		<!-- #ifndef MP -->
		<template v-slot="{item, index}">
		<!-- #endif -->
		<!-- #ifndef MP -->
		<template v-for="(item, index) in list" :slot="`wx:${index}`">
		<!-- #endif -->
			<view style="height: 100vh">
				<text style="font-size: 50px;font-weight: bold;color: #fff;">{{item}}</text>
			</view>
		</template>
	</yingbing-slider>
```
```javascript
	export default {
		data () {
			return {
				list: []
			}
		},
		onReady () {
			for ( let i = 0; i < 10; i++ ) {
				this.list.push(i)
			}
		}
	}
```

#衔接滑动
```html
	<yingbing-slider :data="list" circular style="height: 100vh;">
		<!-- #ifndef MP -->
		<template v-slot="{item, index}">
		<!-- #endif -->
		<!-- #ifndef MP -->
		<template v-for="(item, index) in list" :slot="`wx:${index}`">
		<!-- #endif -->
			<view style="height: 100vh">
				<text style="font-size: 50px;font-weight: bold;color: #fff;">{{item}}</text>
			</view>
		</template>
	</yingbing-slider>
```
```javascript
	export default {
		data () {
			return {
				list: []
			}
		},
		onReady () {
			for ( let i = 0; i < 10; i++ ) {
				this.list.push(i)
			}
		}
	}
```

#下拉刷新
```html
	<yingbing-slider :data="list" vertical pulldownable @pulldown="handlePulldown" style="height: 100vh;">
		<!-- #ifndef MP -->
		<template v-slot="{item, index}">
		<!-- #endif -->
		<!-- #ifndef MP -->
		<template v-for="(item, index) in list" :slot="`wx:${index}`">
		<!-- #endif -->
			<view style="height: 100vh">
				<text style="font-size: 50px;font-weight: bold;color: #fff;">{{item}}</text>
			</view>
		</template>
		<template #pulldownDefault>
			<view class="pulldown">
				<text>下拉刷新</text>
			</view>
		</template>
		<template #pulldownReady>
			<view class="pulldown">
				<text>松开刷新</text>
			</view>
		</template>
		<template #pulldownLoading>
			<view class="pulldown">
				<text>正在刷新</text>
			</view>
		</template>
		<template #pulldownSuccess>
			<view class="pulldown">
				<text>刷新成功</text>
			</view>
		</template>
		<template #pulldownFail>
			<view class="pulldown">
				<text>刷新失败</text>
			</view>
		</template>
	</yingbing-slider>
```
```javascript
	export default {
		data () {
			return {
				list: []
			}
		},
		onReady () {
			for ( let i = 0; i < 10; i++ ) {
				this.list.push(i)
			}
		},
		methods: {
			handlePulldown (callback) {
				//模拟请求
				setTimeout(() => {
					let arr = []
					for ( let i = 0; i < 10; i++ ) {
						arr.push(i)
					}
					this.list = arr
					callback('success') //成功回调
					// callback('fail') //失败回调
				}, 500)
			}
		}
	}
```
```css
	.pulldown {
		display: flex;
		align-items: center;
		justify-content: center;
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
	}
```


#上拉加载
```html
	<yingbing-slider :data="list" vertical pullupable @pullup="handlePullup" style="height: 100vh;">
		<!-- #ifndef MP -->
		<template v-slot="{item, index}">
		<!-- #endif -->
		<!-- #ifndef MP -->
		<template v-for="(item, index) in list" :slot="`wx:${index}`">
		<!-- #endif -->
			<view style="height: 100vh">
				<text style="font-size: 50px;font-weight: bold;color: #fff;">{{item}}</text>
			</view>
		</template>
		<template #pullupDefault>
			<view class="pulldown">
				<text>上拉加载</text>
			</view>
		</template>
		<template #pullupReady>
			<view class="pulldown">
				<text>松开刷新</text>
			</view>
		</template>
		<template #pullupLoading>
			<view class="pulldown">
				<text>正在刷新</text>
			</view>
		</template>
		<template #pullupSuccess>
			<view class="pulldown">
				<text>刷新成功</text>
			</view>
		</template>
		<template #pullupFail>
			<view class="pulldown">
				<text>刷新失败</text>
			</view>
		</template>
	</yingbing-slider>
```
```javascript
	export default {
		data () {
			return {
				list: []
			}
		},
		onReady () {
			for ( let i = 0; i < 10; i++ ) {
				this.list.push(i)
			}
		},
		methods: {
			handlePullup (callback) {
				//模拟请求
				setTimeout(() => {
					for ( let i = 0; i < 10; i++ ) {
						this.list.push(i)
					}
					callback('success') //成功回调
					// callback('fail') //失败回调
				}, 500)
			}
		}
	}
```
```css
	.pulldown {
		display: flex;
		align-items: center;
		justify-content: center;
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
	}
```

#JS控制滑动
```html
	<yingbing-slider ref="slider" :data="list" style="height: 100vh;">
		<!-- #ifndef MP -->
		<template v-slot="{item, index}">
		<!-- #endif -->
		<!-- #ifndef MP -->
		<template v-for="(item, index) in list" :slot="`wx:${index}`">
		<!-- #endif -->
			<view style="height: 100vh">
				<text style="font-size: 50px;font-weight: bold;color: #fff;">{{item}}</text>
			</view>
		</template>
	</yingbing-slider>
	<button @tap="slideToPrev">向前滑动</button>
	<button @tap="slideToNext">向后滑动</button>
```
```javascript
	export default {
		data () {
			return {
				list: [1,2,3,5,6]
			}
		},
		methods: {
			slideToNext () {
				this.$refs.slider.slideToNext()
			},
			slideToPrev () {
				this.$refs.slider.slideToPrev()
			}
		}
	}
```

#刷新组件
```html
	<yingbing-slider ref="slider" :data="list" style="height: 100vh;">
		<!-- #ifndef MP -->
		<template v-slot="{item, index}">
		<!-- #endif -->
		<!-- #ifndef MP -->
		<template v-for="(item, index) in list" :slot="`wx:${index}`">
		<!-- #endif -->
			<view style="height: 100vh">
				<text style="font-size: 50px;font-weight: bold;color: #fff;">{{item}}</text>
			</view>
		</template>
	</yingbing-slider>
	<button @tap="refresh">刷新</button>
```
```javascript
	export default {
		data () {
			return {
				list: [1,2,3,5,6]
			}
		},
		methods: {
			refresh () {
				this.list = [7,8,9,10,11]
				this.$refs.slider.refresh()
			}
		}
	}
```