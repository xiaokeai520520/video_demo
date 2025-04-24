<template>
	<view class="mp-child">
		<!-- 在这里引入你的组件 -->
		<!-- <your-component :item="item" :index="index" v-if="componentName == 'your-component'"></your-component> -->
	</view>
</template>

<script>
	// import YourComponent from '@/components/YourComponent'
	export default {
		// components: {
		// 	YourComponent
		// },
		props: {
			item: {
				type: [Object, String, Number, Array, Boolean],
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
</script>

<style scoped>
	.mp-child {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>