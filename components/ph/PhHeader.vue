<template>
	<view class="ph-header">
		<!-- Logo 区域 -->
		<view class="ph-header-logo">
			<text class="ph-header-logo-text">Porn<text class="ph-header-logo-hub">Hub</text></text>
		</view>
		
		<!-- 搜索栏 -->
		<view class="ph-header-search">
			<uni-icons type="search" size="20" color="#FFFFFF"></uni-icons>
			<input 
				type="text" 
				v-model="searchKeyword" 
				placeholder="搜索视频..." 
				confirm-type="search"
				@confirm="handleSearch"
				class="ph-header-search-input" 
			/>
			<view v-if="searchKeyword" class="ph-header-search-clear" @click="clearSearch">
				<uni-icons type="clear" size="16" color="#808080"></uni-icons>
			</view>
		</view>
		
		<!-- 右侧操作区 -->
		<view class="ph-header-actions">
			<view class="ph-header-action-item" @click="goToNotifications">
				<uni-icons type="notification" size="24" color="#FFFFFF"></uni-icons>
			</view>
			<view class="ph-header-action-item" @click="toggleMenu">
				<uni-icons type="more-filled" size="24" color="#FFFFFF"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'PhHeader',
		data() {
			return {
				searchKeyword: '',
				isMenuOpen: false
			}
		},
		props: {
			// 用户信息
			user: {
				type: Object,
				default: () => ({})
			}
		},
		methods: {
			// 处理搜索
			handleSearch() {
				if (!this.searchKeyword.trim()) return;
				
				this.$emit('search', this.searchKeyword);
				this.clearSearch();
			},
			
			// 清除搜索关键词
			clearSearch() {
				this.searchKeyword = '';
			},
			
			// 前往通知页面
			goToNotifications() {
				uni.navigateTo({
					url: '/pages/notifications/notifications'
				});
			},
			
			// 切换菜单显示
			toggleMenu() {
				this.isMenuOpen = !this.isMenuOpen;
				// 实现菜单显示逻辑
				// 可以用 ph-ui.js 中的 actionSheet 方法
				const menuItems = ['上传视频', '我的频道', '设置', '客服中心', '关于我们'];
				
				uni.showActionSheet({
					itemList: menuItems,
					success: (res) => {
						// 根据选择的菜单项执行相应的操作
						console.log('选择的菜单项:', menuItems[res.tapIndex]);
						
						// 这里可以根据实际需求处理各种菜单选项
						switch(res.tapIndex) {
							case 0: // 上传视频
								uni.navigateTo({ url: '/pages/upload/upload' });
								break;
							case 1: // 我的频道
								uni.navigateTo({ url: '/pages/my-channel/my-channel' });
								break;
							case 2: // 设置
								uni.navigateTo({ url: '/pages/settings/settings' });
								break;
							case 3: // 客服中心
								uni.navigateTo({ url: '/pages/customer-service/customer-service' });
								break;
							case 4: // 关于我们
								uni.navigateTo({ url: '/pages/about/about' });
								break;
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.ph-header {
		  display: flex;
		  align-items: center;
		  justify-content: space-between;
		  padding: 20rpx;
		  background-color: var(--ph-black);
		  height: 100rpx;
		  width: 100%;
		  box-sizing: border-box;
		  position: fixed; /* 改为固定定位 */
		  top: 0; /* 固定在顶部 */
		  left: 0;
		  right: 0;
		  z-index: 999; /* 确保在其他元素上方 */
		  border-bottom: 1px solid var(--ph-grey);
		  
		  /* 适配不同平台的安全区域 */
		  /* #ifdef APP-PLUS || MP */
		  padding-top: calc(20rpx + constant(safe-area-inset-top));
		  padding-top: calc(20rpx + env(safe-area-inset-top));
		  /* #endif */
		
		/* Logo 样式 */
		&-logo {
			margin-right: 20rpx;
			
			&-text {
				font-size: 36rpx;
				font-weight: bold;
				color: var(--ph-white);
			}
			
			&-hub {
				color: var(--ph-orange);
				background-color: var(--ph-black);
				padding: 0 6rpx;
				border-radius: 8rpx;
			}
		}
		
		/* 搜索框样式 */
		&-search {
			flex: 1;
			display: flex;
			align-items: center;
			background-color: var(--ph-grey);
			border-radius: 40rpx;
			padding: 0 20rpx;
			height: 70rpx;
			
			&-input {
				flex: 1;
				height: 100%;
				font-size: 28rpx;
				color: var(--ph-white);
				padding: 0 20rpx;
				background-color: transparent;
			}
			
			&-clear {
				padding: 10rpx;
			}
		}
		
		/* 右侧操作区样式 */
		&-actions {
			display: flex;
			align-items: center;
			margin-left: 20rpx;
		}
		
		&-action-item {
			padding: 10rpx;
			position: relative;
			margin-left: 10rpx;
			
			/* 激活状态 */
			&:active {
				opacity: 0.7;
			}
			
			/* 徽标 */
			.badge {
				position: absolute;
				top: 0;
				right: 0;
				background-color: var(--ph-orange);
				color: var(--ph-black);
				font-size: 20rpx;
				min-width: 32rpx;
				height: 32rpx;
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
			}
		}
		
		/* 适配不同平台的安全区域 */
        /* #ifdef APP-PLUS || MP */
        padding-top: calc(20rpx + constant(safe-area-inset-top));
        padding-top: calc(20rpx + env(safe-area-inset-top));
        /* #endif */
	}
</style>