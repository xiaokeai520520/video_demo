<template>
	<view>
		<view v-if="initializing" class="init-loading">
			<TkLoading :isLoading="true" text="正在连接服务器..."></TkLoading>
		</view>
		<view v-else>
			<!-- 这里是应用的主内容区域 -->
			<view>
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	import TkLoading from '@/components/TikTokLoading.vue';

	export default {
		components: {
			TkLoading,
		},
		data() {
			return {
				initializing: true, // 初始化标志
				checkUrlInterval: null
			}
		},
		onLaunch() {
			console.log('App Launch');
			// 开始检查URL是否已初始化
			this.checkUrlInitialization();
		},
		methods: {
			checkUrlInitialization() {
				// 创建一个轮询，检查URL是否初始化完成
				this.checkUrlInterval = setInterval(() => {
					const app = getApp();
					if (app && app.globalData && app.globalData.baseUrls) {
						// URL已初始化，结束加载状态
						this.initializing = false;
						clearInterval(this.checkUrlInterval);
						console.log('URL初始化完成，应用已就绪');
					}
				}, 200);
			}
		},
		beforeDestroy() {
			// 清除所有定时器
			if (this.checkUrlInterval) {
				clearInterval(this.checkUrlInterval);
			}
		}
	}
</script>