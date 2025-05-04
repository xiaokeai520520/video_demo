<template>
	<view v-if="show" class="porn-modal-container">
		<view class="porn-modal-mask" @tap.stop="maskClick"></view>
		<view class="porn-modal-content">
			<!-- 标题 -->
			<view v-if="title" class="porn-modal-title">{{ title }}</view>

			<!-- 内容 -->
			<view class="porn-modal-text">{{ content }}</view>

			<!-- 按钮区域 -->
			<view class="porn-modal-buttons" :class="{'single-button': !showCancel}">
				<view v-if="showCancel" class="porn-modal-button cancel-button" hover-class="button-hover"
					@tap="handleCancel">
					{{ cancelText }}
				</view>
				<view class="porn-modal-button confirm-button" hover-class="button-hover" @tap="handleConfirm">
					{{ confirmText }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'PornModal',
		data() {
			return {
				show: false,
				title: '提示',
				content: '',
				showCancel: true,
				cancelText: '取消',
				confirmText: '确定',
				success: null
			}
		},
		methods: {
			open(options) {
				this.show = true;
				this.title = options.title || '提示';
				this.content = options.content || '';
				this.showCancel = options.showCancel !== false;
				this.cancelText = options.cancelText || '取消';
				this.confirmText = options.confirmText || '确定';
				this.success = options.success;
			},
			handleConfirm() {
				this.show = false;
				if (typeof this.success === 'function') {
					this.success({
						confirm: true,
						cancel: false
					});
				}
			},
			handleCancel() {
				this.show = false;
				if (typeof this.success === 'function') {
					this.success({
						confirm: false,
						cancel: true
					});
				}
			},
			maskClick() {
				// 可选的点击蒙层关闭
				// this.handleCancel();
			}
		}
	}
</script>

<style lang="scss">
	.porn-modal-container {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.porn-modal-mask {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.8);
	}

	.porn-modal-content {
		position: relative;
		width: 80%;
		max-width: 600rpx;
		background-color: #1e1e1e;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
		animation: modal-in 0.25s ease-out forwards;
	}

	@keyframes modal-in {
		from {
			opacity: 0;
			transform: scale(0.8);
		}

		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.porn-modal-title {
		padding: 18px 15px 5px;
		font-size: 18px;
		font-weight: bold;
		text-align: center;
		color: $uni-white;
	}

	.porn-modal-text {
		padding: 15px 20px 20px;
		min-height: 40px;
		font-size: 16px;
		line-height: 1.5;
		text-align: center;
		color: $uni-base-color;
	}

	.porn-modal-buttons {
		display: flex;
		border-top: 1px solid $uni-border-2;
		height: 50px;
	}

	.porn-modal-button {
		flex: 1;
		height: 100%;
		line-height: 50px;
		text-align: center;
		font-size: 16px;
	}

	.cancel-button {
		color: $uni-secondary-color;
		border-right: 1px solid $uni-border-2;
	}

	.confirm-button {
		color: $uni-primary;
		font-weight: bold;
	}

	.button-hover {
		background-color: #2a2a2a;
	}

	.single-button .confirm-button {
		border-right: none;
	}
</style>