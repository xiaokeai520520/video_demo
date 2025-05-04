<template>
	<view>
		<view v-if="initializing" class="init-loading">
			<TkLoading ref="loadingRef" :isLoading="true" text="正在连接服务器..."></TkLoading>
		</view>
		<view v-else>
			<!-- 这里是应用的主内容区域 -->
			<view>
				<slot></slot>
			</view>
		</view>

		<!-- 全局弹窗组件 -->
		<PornModal ref="pornModalRef"></PornModal>
	</view>
</template>

<script>
	import TkLoading from '@/components/TikTokLoading.vue';
	import PornModal from '@/components/PornModal.vue';
	import http from '@/utils/request';

	export default {
		components: {
			TkLoading,
			PornModal
		},
		data() {
			return {
				initializing: true, // 初始化标志
			}
		},
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')

			// 初始化程序
			this.initApp();
		},
		onShow: function() {
			console.log('App Show')

			// 初始化全局服务
			this.$nextTick(() => {
				// 确保组件已挂载
				if (this.$refs.pornModalRef) {
					this.$modal.init(this.$refs.pornModalRef);
				}

				if (this.$refs.loadingRef) {
					this.$loading.init(this.$refs.loadingRef);
				}
			});
		},
		onHide: function() {
			console.log('App Hide')
		},
		// 在App.vue的methods中添加
		methods: {
			async initApp() {
				try {
					// 初始化请求服务，这会检测URL并设置base_url
					await http.init();

					// 初始化完成
					this.initializing = false;
					console.log('应用初始化完成');
				} catch (error) {
					console.error('应用初始化失败:', error);

					// 添加日志来检查实例
					console.log('Modal服务:', this.$modal);
					console.log('Modal实例:', this.$refs.pornModalRef);
					console.log('Modal服务实例:', this.$modal?._instance);

					// 如果modal实例不存在，先尝试初始化
					if (this.$refs.pornModalRef && !this.$modal._instance) {
						this.$modal.init(this.$refs.pornModalRef);
					}

					// 使用更长的延迟
					setTimeout(() => {
						// 再次检查
						console.log('延迟后Modal服务实例:', this.$modal?._instance);

						if (this.$modal && this.$modal._instance) {
							// 使用自定义弹窗
							this.$modal.show({
								title: '连接失败',
								content: '无法连接到服务器，请检查网络设置',
								showCancel: false,
								confirmText: '重试',
								success: (res) => {
									if (res.confirm) {
										this.initApp();
									}
								}
							});
						} else {
							// 使用系统弹窗
							console.warn('自定义弹窗未就绪，使用系统弹窗');
							uni.showModal({
								title: '连接失败',
								content: '无法连接到服务器，请检查网络设置',
								showCancel: false,
								success: () => {
									this.initApp();
								}
							});
						}
					}, 300); // 增加延迟时间
				}
			}
		},
		mounted() {
			// 组件挂载完成，初始化服务
			this.$nextTick(() => {
				if (this.$refs.pornModalRef) {
					this.$modal.init(this.$refs.pornModalRef);
				}

				if (this.$refs.loadingRef) {
					this.$loading.init(this.$refs.loadingRef);
				}
			});
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/*样式覆盖css */
	@import '@/styles/common.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	/* #endif */

	/* 初始化加载样式 */
	.init-loading {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #121212;
		z-index: 9999;
	}
</style>