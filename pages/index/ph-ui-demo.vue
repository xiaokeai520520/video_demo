<template>
	<view class="container">
		<view class="header">
			<text class="title">Pornhub 风格弹窗组件</text>
			<text class="subtitle">统一的 UI 弹窗管理器演示</text>
		</view>

		<view class="section">
			<text class="section-title">Toast 提示</text>
			<view class="button-group">
				<button class="ph-button" @click="showToast">文本提示</button>
				<button class="ph-button" @click="showSuccessToast">成功提示</button>
				<button class="ph-button" @click="showLoadingToast">加载提示</button>
				<button class="ph-button" @click="showErrorToast">错误提示</button>
			</view>
		</view>

		<view class="section">
			<text class="section-title">Loading 加载</text>
			<view class="button-group">
				<button class="ph-button" @click="showLoading">显示加载</button>
				<button class="ph-button ph-button-outline" @click="hideLoading">隐藏加载</button>
			</view>
		</view>

		<view class="section">
			<text class="section-title">对话框</text>
			<view class="button-group">
				<button class="ph-button" @click="showConfirm">确认对话框</button>
				<button class="ph-button" @click="showAlert">提示对话框</button>
				<button class="ph-button" @click="showCustomConfirm">自定义对话框</button>
			</view>
		</view>

		<view class="section">
			<text class="section-title">操作菜单</text>
			<view class="button-group">
				<button class="ph-button" @click="showActionSheet">底部操作菜单</button>
			</view>
		</view>

		<view class="section">
			<text class="section-title">通知提示</text>
			<view class="button-group">
				<button class="ph-button" @click="showInfoNotify">信息通知</button>
				<button class="ph-button" @click="showSuccessNotify">成功通知</button>
				<button class="ph-button" @click="showErrorNotify">错误通知</button>
			</view>
		</view>

		<view class="section">
			<text class="section-title">全局替换</text>
			<view class="button-group">
				<button class="ph-button" @click="toggleOverride">
					{{ isOverridden ? '恢复系统默认样式' : '替换所有系统弹窗' }}
				</button>
				<button v-if="isOverridden" class="ph-button" @click="showSystemModal">
					测试系统对话框
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import phUI from '@/utils/ph-ui.js';

	export default {
		data() {
			return {
				isOverridden: false,
				restoreFn: null
			}
		},
		methods: {
			// Toast 提示示例
			showToast() {
				phUI.toast('这是一条简单的提示消息');
			},

			showSuccessToast() {
				phUI.toast({
					title: '操作成功',
					icon: 'success',
					duration: 2000
				});
			},

			showLoadingToast() {
				phUI.toast({
					title: '加载中...',
					icon: 'loading',
					duration: 2000
				});
			},

			showErrorToast() {
				phUI.toast({
					title: '操作失败',
					icon: 'error',
					duration: 2000
				});
			},

			// Loading 示例
			showLoading() {
				phUI.loading('加载中...');

				// 3秒后自动关闭
				setTimeout(() => {
					phUI.hideLoading();
					phUI.toast('加载完成');
				}, 3000);
			},

			hideLoading() {
				phUI.hideLoading();
			},

			// 对话框示例
			showConfirm() {
				phUI.confirm({
					title: '确认操作',
					content: '您确定要执行此操作吗？',
					success: (res) => {
						if (res.confirm) {
							phUI.toast('您点击了确定');
						} else if (res.cancel) {
							phUI.toast('您点击了取消');
						}
					}
				});
			},

			showAlert() {
				phUI.alert({
					title: '提示',
					content: '这是一个提示对话框',
					confirmText: '知道了',
					success: (res) => {
						phUI.toast('您已确认');
					}
				});
			},

			showCustomConfirm() {
				phUI.confirm({
						title: '删除确认',
						content: '删除后无法恢复，确定要继续吗？',
						cancelText: '再想想',
						confirmText: '确认删除'
					})
					.then(res => {
						if (res.confirm) {
							phUI.toast({
								title: '已删除',
								icon: 'success'
							});
						}
					});
			},

			// 操作菜单示例
			showActionSheet() {
				phUI.actionSheet({
					itemList: ['发送给朋友', '保存到相册', '收藏', '删除', '举报'],
					success: (res) => {
						phUI.toast(`您选择了: ${res.tapIndex}`);
					}
				});
			},

			// 通知示例
			showInfoNotify() {
				phUI.notify({
					title: '这是一条信息通知',
					type: 'info',
					duration: 3000,
					position: 'top'
				});
			},

			showSuccessNotify() {
				phUI.notify({
					title: '操作已成功完成',
					type: 'success',
					duration: 3000,
					position: 'top'
				});
			},

			showErrorNotify() {
				phUI.notify({
					title: '操作失败，请重试',
					type: 'error',
					duration: 3000,
					position: 'bottom',
					showClose: true
				});
			},

			// 全局替换示例
			toggleOverride() {
				if (this.isOverridden) {
					// 恢复系统方法
					if (this.restoreFn) {
						this.restoreFn();
						this.restoreFn = null;
					}
					this.isOverridden = false;
					phUI.toast('已恢复系统默认样式');
				} else {
					// 替换所有系统方法
					this.restoreFn = phUI.overrideUniMethods();
					this.isOverridden = true;
					phUI.toast({
						title: '已替换所有系统弹窗',
						icon: 'success'
					});
				}
			},

			// 测试系统对话框
			showSystemModal() {
				uni.showModal({
					title: '系统对话框',
					content: '这是使用 uni.showModal 调用的对话框',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '您点击了确定'
							});
						} else {
							uni.showToast({
								title: '您点击了取消'
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20px;
		background-color: #000000;
		min-height: 100vh;
	}

	.header {
		margin-bottom: 30px;
		text-align: center;
	}

	.title {
		display: block;
		font-size: 22px;
		font-weight: bold;
		color: #FF9000;
		margin-bottom: 10px;
	}

	.subtitle {
		display: block;
		font-size: 16px;
		color: #FFFFFF;
	}

	.section {
		margin-bottom: 25px;
	}

	.section-title {
		display: block;
		font-size: 18px;
		font-weight: bold;
		color: #FF9000;
		margin-bottom: 15px;
	}

	.button-group {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	/* Pornhub 风格按钮 */
	.ph-button {
		background-color: #FF9000;
		color: #000000;
		font-weight: bold;
		font-size: 16px;
		padding: 12px 0;
		border-radius: 6px;
		border: none;
		text-align: center;
		transition: all 0.2s ease;

		&:active {
			transform: scale(0.98);
			opacity: 0.9;
		}

		&.ph-button-outline {
			background-color: transparent;
			color: #FF9000;
			border: 1px solid #FF9000;

			&:active {
				background-color: rgba(255, 144, 0, 0.1);
			}
		}
	}
</style>