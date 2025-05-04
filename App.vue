<template>
	<view class="app-container">
		<view class="fixed-loading">
			<TikTokLoading text="正在连接服务器..."></TikTokLoading>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	import TikTokLoading from '@/components/TikTokLoading.vue';
	import http from '@/utils/request';

	export default {
		components: {
			TikTokLoading
		},
		data() {
			return {
				urlsInitialized: false
			}
		},
		onLaunch() {
			console.log('App.vue 加载完成');
			this.initializeUrls();
		},
		methods: {
			async initializeUrls() {
				try {
					// 检查全局数据中是否已有初始化结果
					const app = getApp();
					if (app && app.globalData && app.globalData.baseUrls) {
						this.urlsInitialized = true;
						return;
					}

					// 没有初始化结果，主动初始化
					await http.init();
					this.urlsInitialized = true;
				} catch (error) {
					console.error('URL初始化失败:', error);
					// 可以添加重试逻辑
					setTimeout(() => {
						this.initializeUrls();
					}, 3000);
				}
			}
		}
	}
</script>

<style>
	.init-loading {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		z-index: 9999;
	}
</style>