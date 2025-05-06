<template>
	<view class="ph-section">
		<view class="ph-section-header">
			<view class="ph-section-title">
				<uni-icons v-if="icon" :type="icon" size="22" color="#FF9000" class="ph-section-icon"></uni-icons>
				<text class="ph-section-title-text">{{ title }}</text>
			</view>
			<view class="ph-section-more" @click="goToMore">
				<text>更多</text>
				<uni-icons type="forward" size="14" color="#FFFFFF"></uni-icons>
			</view>
		</view>
		
		<view class="ph-section-content">
			<view 
				class="ph-video-card" 
				v-for="(item, index) in videos" 
				:key="index"
				@click="handleVideoClick(item)"
			>
				<view class="ph-video-thumbnail">
					<image class="ph-video-image" :src="item.thumbnail" mode="aspectFill"></image>
					<view class="ph-video-duration">{{ formatDuration(item.duration) }}</view>
					<view class="ph-video-premium" v-if="item.isPremium">
						<uni-icons type="star-filled" size="12" color="#FF9000"></uni-icons>
					</view>
				</view>
				
				<view class="ph-video-info">
					<text class="ph-video-title">{{ item.title }}</text>
					
					<view class="ph-video-meta">
						<view class="ph-video-channel">
							<image v-if="item.channelAvatar" class="ph-video-avatar" :src="item.channelAvatar" mode="aspectFill"></image>
							<text class="ph-video-channel-name">{{ item.channelName }}</text>
						</view>
						
						<view class="ph-video-stats">
							<text class="ph-video-views">{{ formatViews(item.views) }}次观看</text>
							<text class="ph-video-likes">
								<uni-icons type="hand-up-filled" size="12" color="#808080"></uni-icons>
								{{ formatNumber(item.likes) }}
							</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'PhSection',
		props: {
			title: {
				type: String,
				required: true
			},
			icon: {
				type: String,
				default: ''
			},
			videos: {
				type: Array,
				default: () => []
			},
			type: {
				type: String,
				default: 'recommended'
			}
		},
		methods: {
			// 前往更多页面
			goToMore() {
				// 根据类型跳转到不同的列表页面
				uni.navigateTo({
					url: `/pages/video-list/video-list?type=${this.type}&title=${encodeURIComponent(this.title)}`
				});
			},
			
			// 处理视频点击
			handleVideoClick(item) {
				console.log('点击视频:', item);
				
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
			
			// 格式化数字
			formatNumber(num) {
				if (!num) return '0';
				
				if (num >= 1000000) {
					return (num / 1000000).toFixed(1) + 'M';
				} else if (num >= 1000) {
					return (num / 1000).toFixed(1) + 'K';
				}
				
				return num;
			},
			
			// 格式化观看次数
			formatViews(views) {
				return this.formatNumber(views);
			}
		}
	}
</script>

<style lang="scss">
	.ph-section {
		margin-bottom: 40rpx;
		
		&-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 20rpx;
			margin-bottom: 20rpx;
		}
		
		&-title {
			display: flex;
			align-items: center;
			
			&-text {
				font-size: 32rpx;
				font-weight: bold;
				color: var(--ph-orange);
			}
		}
		
		&-icon {
			margin-right: 10rpx;
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
		
		&-content {
			display: flex;
			flex-direction: column;
			padding: 0 20rpx;
		}
	}
	
	.ph-video {
		&-card {
			margin-bottom: 30rpx;
			
			&:active {
				opacity: 0.9;
			}
		}
		
		&-thumbnail {
			position: relative;
			width: 100%;
			height: 380rpx;
			border-radius: 12rpx;
			overflow: hidden;
			margin-bottom: 15rpx;
		}
		
		&-image {
			width: 100%;
			height: 100%;
		}
		
		&-duration {
			position: absolute;
			bottom: 10rpx;
			right: 10rpx;
			background-color: rgba(0, 0, 0, 0.7);
			color: var(--ph-white);
			font-size: 22rpx;
			padding: 4rpx 10rpx;
			border-radius: 4rpx;
		}
		
		&-premium {
			position: absolute;
			top: 10rpx;
			right: 10rpx;
			background-color: rgba(0, 0, 0, 0.7);
			color: var(--ph-orange);
			font-size: 22rpx;
			padding: 4rpx 10rpx;
			border-radius: 4rpx;
			display: flex;
			align-items: center;
		}
		
		&-info {
			padding: 0 10rpx;
		}
		
		&-title {
			font-size: 28rpx;
			color: var(--ph-white);
			font-weight: bold;
			margin-bottom: 10rpx;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
			line-height: 1.3;
		}
		
		&-meta {
			display: flex;
			flex-direction: column;
		}
		
		&-channel {
			display: flex;
			align-items: center;
			margin-bottom: 10rpx;
		}
		
		&-avatar {
			width: 40rpx;
			height: 40rpx;
			border-radius: 20rpx;
			margin-right: 10rpx;
		}
		
		&-channel-name {
			font-size: 24rpx;
			color: var(--ph-orange);
		}
		
		&-stats {
			display: flex;
			align-items: center;
			font-size: 22rpx;
			color: rgba(255, 255, 255, 0.5);
		}
		
		&-views {
			margin-right: 20rpx;
		}
		
		&-likes {
			display: flex;
			align-items: center;
			
			.uni-icons {
				margin-right: 4rpx;
			}
		}
	}
</style>