<template>
	<view class="ph-categories">
		<view class="ph-categories-header">
			<text class="ph-categories-title">热门分类</text>
			<view class="ph-categories-more" @click="goToAllCategories">
				<text>全部</text>
				<uni-icons type="forward" size="14" color="#FFFFFF"></uni-icons>
			</view>
		</view>
		
		<scroll-view class="ph-categories-scroll" scroll-x :show-scrollbar="false">
			<view class="ph-categories-list">
				<view 
					class="ph-category-item" 
					v-for="(item, index) in categories" 
					:key="index"
					@click="handleCategoryClick(item)"
				>
					<view class="ph-category-image-wrapper">
						<image class="ph-category-image" :src="item.image" mode="aspectFill"></image>
					</view>
					<text class="ph-category-name">{{ item.name }}</text>
					<text class="ph-category-count">{{ formatCount(item.videoCount) }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'PhCategories',
		props: {
			categories: {
				type: Array,
				default: () => []
			}
		},
		methods: {
			// 跳转到所有分类页面
			goToAllCategories() {
				uni.navigateTo({
					url: '/pages/categories/categories'
				});
			},
			
			// 处理分类点击
			handleCategoryClick(item) {
				console.log('点击分类:', item);
				
				uni.navigateTo({
					url: `/pages/category/category?id=${item.id}&name=${encodeURIComponent(item.name)}`
				});
			},
			
			// 格式化视频数量
			formatCount(count) {
				if (!count) return '0';
				
				if (count >= 1000000) {
					return (count / 1000000).toFixed(1) + 'M';
				} else if (count >= 1000) {
					return (count / 1000).toFixed(1) + 'K';
				}
				
				return count;
			}
		}
	}
</script>

<style lang="scss">
	.ph-categories {
		margin: 20rpx 0 30rpx;
		
		&-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 20rpx;
			margin-bottom: 20rpx;
		}
		
		&-title {
			font-size: 32rpx;
			font-weight: bold;
			color: var(--ph-orange);
		}
		
		&-more {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.7);
			
			&:active {
				opacity: 0.7;
			}
		}
		
		&-scroll {
			width: 100%;
			white-space: nowrap;
		}
		
		&-list {
			display: flex;
			padding: 0 10rpx;
		}
	}
	
	.ph-category {
		&-item {
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			padding: 0 10rpx;
			width: 160rpx;
			margin-bottom: 20rpx;
			
			&:active {
				opacity: 0.7;
			}
		}
		
		&-image-wrapper {
			width: 140rpx;
			height: 140rpx;
			border-radius: 70rpx;
			overflow: hidden;
			margin-bottom: 15rpx;
			border: 2px solid var(--ph-grey);
		}
		
		&-image {
			width: 100%;
			height: 100%;
		}
		
		&-name {
			font-size: 26rpx;
			color: var(--ph-white);
			margin-bottom: 6rpx;
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			width: 100%;
		}
		
		&-count {
			font-size: 22rpx;
			color: rgba(255, 255, 255, 0.5);
			text-align: center;
		}
	}
</style>