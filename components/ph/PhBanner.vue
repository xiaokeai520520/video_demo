<template>
	<view class="ph-banner">
		<swiper class="ph-banner-swiper" 
			:indicator-dots="true" 
			:autoplay="true" 
			:interval="3000" 
			:duration="500" 
			:circular="true"
			indicator-active-color="#FF9000"
			indicator-color="rgba(255, 255, 255, 0.3)"
		>
			<swiper-item v-for="(item, index) in banners" :key="index" class="ph-banner-item" @click="handleBannerClick(item)">
				<view class="ph-banner-content">
					<image class="ph-banner-image" :src="item.image" mode="aspectFill"></image>
					
					<!-- 内容遮罩和标题 -->
					<view class="ph-banner-overlay">
						<view class="ph-banner-tag" v-if="item.tag">{{ item.tag }}</view>
						<view class="ph-banner-info">
							<text class="ph-banner-title">{{ item.title }}</text>
							<view class="ph-banner-meta">
								<text class="ph-banner-duration">{{ formatDuration(item.duration) }}</text>
								<text class="ph-banner-views">{{ formatViews(item.views) }} 次观看</text>
							</view>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name: 'PhBanner',
		props: {
			banners: {
				type: Array,
				default: () => []
			}
		},
		methods: {
			// 处理轮播图点击
			handleBannerClick(item) {
				console.log('点击轮播图:', item);
				
				// 跳转到视频详情页
				uni.navigateTo({
					url: `/pages/video/video?id=${item.id}`
				});
			},
			
			// 格式化时长
			formatDuration(seconds) {
				if (!seconds) return '00:00';
				
				const minutes = Math.floor(seconds / 60);
				const remainingSeconds = seconds % 60;
				
				return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
			},
			
			// 格式化观看次数
			formatViews(views) {
				if (!views) return '0';
				
				if (views >= 1000000) {
					return (views / 1000000).toFixed(1) + 'M';
				} else if (views >= 1000) {
					return (views / 1000).toFixed(1) + 'K';
				}
				
				return views;
			}
		}
	}
</script>

<style lang="scss">
	.ph-banner {
		padding: 20rpx;
		
		&-swiper {
			height: 400rpx;
			border-radius: 12rpx;
			overflow: hidden;
		}
		
		&-item {
			width: 100%;
			height: 100%;
			position: relative;
		}
		
		&-content {
			width: 100%;
			height: 100%;
			position: relative;
		}
		
		&-image {
			width: 100%;
			height: 100%;
		}
		
		&-overlay {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 30rpx 20rpx;
			background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
		}
		
		&-tag {
			position: absolute;
			top: 20rpx;
			left: 20rpx;
			background-color: var(--ph-orange);
			color: var(--ph-black);
			font-size: 24rpx;
			font-weight: bold;
			padding: 6rpx 16rpx;
			border-radius: 6rpx;
		}
		
		&-info {
			display: flex;
			flex-direction: column;
		}
		
		&-title {
			font-size: 32rpx;
			color: var(--ph-white);
			font-weight: bold;
			margin-bottom: 10rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		
		&-meta {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.7);
		}
		
		&-duration {
			margin-right: 20rpx;
			background-color: rgba(0, 0, 0, 0.5);
			padding: 4rpx 12rpx;
			border-radius: 4rpx;
		}
		
		&-views {
			/* Nothing special */
		}
	}
</style>