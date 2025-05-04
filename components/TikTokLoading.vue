<template>
	<div class="loading-overlay" v-if="isLoading">
		<div class="loading-wrapper">
			<div class="loading-container">
				<div class="loading-circle circle-one"></div>
				<div class="loading-circle circle-two"></div>
			</div>
			<div class="loading-text" v-if="showText">{{ text }}</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'TikTokLoading',
		props: {
			isLoading: Boolean, // 是否显示加载动画
			showText: {
				type: Boolean,
				default: true
			},
			text: {
				type: String,
				default: ''
			}
		},
		created() {
			console.log('TkLoading组件已创建', this.isLoading);
		},
		mounted() {
			console.log('TkLoading组件已挂载');
			console.log('DOM元素:', this.$el);
		}
	};
</script>

<style scoped lang="scss">
	$animation-duration: 1200ms;
	$primary-color: #fe2c55; // TikTok红色
	$secondary-color: #25f4ee; // TikTok青色

	// 全屏半透明遮罩
	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.85); // 深色半透明背景
		z-index: 100000;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	// 新增一个包装容器，专门处理垂直布局
	.loading-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 30px;
	}

	// 保持原来的loading-container结构不变
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.loading-circle {
		width: 20px;
		aspect-ratio: 1;
		border-radius: 50%;
		display: inline-block;
		margin: 0;
		position: relative;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	.circle-one {
		background: $primary-color;
		animation: clockwise $animation-duration infinite linear;
		filter: brightness(1.2);
		z-index: 2;
	}

	.circle-two {
		background: $secondary-color;
		margin-left: -5px; // 保持原来的重叠效果
		animation: counter-clockwise $animation-duration infinite linear;
		filter: brightness(1.2);
		z-index: 1;

		// 使用光照效果替代mix-blend-mode
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), transparent 70%);
			border-radius: 50%;
			opacity: 0.6;
		}
	}

	// 添加发光效果
	.circle-one::before,
	.circle-two::before {
		content: '';
		position: absolute;
		top: -5px;
		left: -5px;
		right: -5px;
		bottom: -5px;
		border-radius: 50%;
		filter: blur(6px);
		z-index: -1;
	}

	.circle-one::before {
		// background: $primary-color;
		opacity: 0.5;
	}

	.circle-two::before {
		// background: $secondary-color;
		opacity: 0.5;
	}

	.loading-text {
		color: #ffffff;
		font-size: 16px;
		text-align: center;
		font-weight: 500;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	@keyframes clockwise {
		0% {
			transform: translateX(0);
			width: 20px;
		}

		25% {
			width: 25px;
		}

		50% {
			transform: translateX(100%);
			width: 20px;
		}

		75% {
			width: 25px;
		}

		100% {
			transform: translateX(0);
			width: 20px;
		}
	}

	@keyframes counter-clockwise {
		0% {
			transform: translateX(0);
		}

		50% {
			transform: translateX(-100%);
		}

		100% {
			transform: translateX(0);
		}
	}
</style>