<template>
	<view class="video-detail-container">
		<!-- 视频播放器区域 - 将根据滚动位置固定或随页面滚动 -->
		<view class="video-player-wrapper" :class="{ 'fixed-top': isPlayerFixed }">
			<!-- 使用条件编译区分平台 -->
			<!-- #ifdef APP-PLUS -->
			<video v-if="platform === 'ios' || !useNvue" id="myVideo" ref="videoPlayer" :src="videoInfo.videoUrl"
				:poster="videoInfo.coverUrl" :controls="true" :show-center-play-btn="true"
				:enable-progress-gesture="true" :vslide-gesture="true" :vslide-gesture-in-fullscreen="true"
				object-fit="contain" @play="onVideoPlay" @pause="onVideoPause" @ended="onVideoEnded"
				@timeupdate="onTimeUpdate"></video>
			<!-- #endif -->

			<!-- 使用自定义播放器组件，可根据平台切换实现 -->
			<custom-video-player v-if="platform === 'android' && useNvue" ref="customPlayer"
				:video-url="videoInfo.videoUrl" :cover-url="videoInfo.coverUrl" @play="onVideoPlay"
				@pause="onVideoPause" @ended="onVideoEnded" />

			<!-- H5平台可以使用原生视频标签获取更好体验 -->
			<!-- #ifdef H5 -->
			<video id="myVideo" ref="videoPlayer" :src="videoInfo.videoUrl" :poster="videoInfo.coverUrl" controls
				playsinline webkit-playsinline x5-playsinline x5-video-player-type="h5"
				x5-video-player-fullscreen="true" preload="auto" @play="onVideoPlay" @pause="onVideoPause"
				@ended="onVideoEnded" @timeupdate="onTimeUpdate"></video>
			<!-- #endif -->
		</view>

		<!-- 视频信息区域 -->
		<view class="video-info-section">
			<view class="video-title">{{ videoInfo.title }}</view>
			<view class="video-stats">
				<text class="views">{{ videoInfo.views }} 次观看</text>
				<text class="rating">{{ videoInfo.rating }}%</text>
				<text class="time">{{ videoInfo.time }}</text>
			</view>

			<!-- 操作按钮区 -->
			<view class="action-buttons">
				<view class="action-btn">
					<view class="btn-icon">👍</view>
					<view class="btn-text">{{ videoInfo.likes }}</view>
				</view>
				<view class="action-btn">
					<view class="btn-icon">👎</view>
					<view class="btn-text">{{ videoInfo.dislikes }}</view>
				</view>
				<view class="action-btn">
					<view class="btn-icon">❤️</view>
					<view class="btn-text">{{ videoInfo.favorites }}</view>
				</view>
				<view class="action-btn">
					<view class="btn-icon">➕</view>
					<view class="btn-text">添加至</view>
				</view>
				<view class="action-btn">
					<view class="btn-icon">🚩</view>
					<view class="btn-text">举报</view>
				</view>
				<view class="action-btn">
					<view class="btn-icon">↗️</view>
					<view class="btn-text">分享</view>
				</view>
			</view>
		</view>

		<!-- 猜你喜欢区域 -->
		<view class="recommendation-section">
			<view class="section-title">猜你喜欢</view>
			<view class="video-list">
				<view v-for="(item, index) in recommendedVideos" :key="index" class="video-item"
					@click="navigateToVideo(item.id)">
					<view class="video-cover">
						<image :src="item.coverUrl" mode="aspectFill"></image>
						<view class="video-duration">{{ item.duration }}</view>
						<view v-if="item.isHD" class="video-quality">HD</view>
					</view>
					<view class="video-info">
						<view class="video-title">{{ item.title }}</view>
						<view class="video-meta">
							<text class="channel-name">{{ item.channelName }}</text>
							<text class="video-views">{{ item.views }} 次观看</text>
							<text class="video-rating">{{ item.rating }}%</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CustomVideoPlayer from '../../components/custom-video-player.nvue'

	export default {
		components: {
		    // 显式注册组件
		    'custom-video-player': CustomVideoPlayer
		},
		data() {
			return {
				isPlayerFixed: false,
				platform: '',
				useNvue: false, // 是否使用nvue页面
				playerHeight: 0,
				scrollTop: 0,
				videoInfo: {
					id: '123456',
					title: '成熟的妈妈 Sofia Staks 是素食主义者，但喜欢一些年轻的 TubeSteak',
					videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
					coverUrl: 'https://example.com/cover.jpg',
					views: '423,565',
					rating: '89',
					time: '1年前',
					likes: '1K',
					dislikes: '140',
					favorites: '1K'
				},
				recommendedVideos: [{
						id: '1',
						title: '大山雀金发妓女艾米·阿祖拉（Amy Azurra）在吸吮和他妈的后得到了她渴望的精液!',
						coverUrl: 'https://example.com/video1.jpg',
						duration: '14:47',
						channelName: 'Box Of Porn',
						views: '303K',
						rating: '91',
						isHD: true
					},
					// 更多推荐视频...
				]
			};
		},
		onLoad() {
			// 获取当前平台
			this.detectPlatform();

			// 根据平台决定是否使用Nvue页面
			this.decideRenderMode();

			// 获取视频信息和推荐视频
			// this.getVideoDetails();
			// this.getRecommendedVideos();
		},
		onPageScroll(e) {
			// 记录滚动位置
			this.scrollTop = e.scrollTop;

			// 当滚动超过播放器高度时，固定播放器在顶部
			if (this.scrollTop > this.playerHeight && !this.isPlayerFixed) {
				this.isPlayerFixed = true;
			} else if (this.scrollTop <= this.playerHeight && this.isPlayerFixed) {
				this.isPlayerFixed = false;
			}
		},
		onReady() {
			// 获取播放器高度
			const query = uni.createSelectorQuery();
			query.select('.video-player-wrapper').boundingClientRect(data => {
				if (data) {
					this.playerHeight = data.height;
				}
			}).exec();
		},
		methods: {
			detectPlatform() {
				// 检测当前运行平台
				// #ifdef APP-PLUS
				const platform = uni.getSystemInfoSync().platform;
				this.platform = platform.toLowerCase();
				// #endif

				// #ifdef H5
				this.platform = 'h5';
				// #endif
			},
			decideRenderMode() {
				// 根据平台和设备性能决定是否使用Nvue
				if (this.platform === 'android') {
					// 可以根据设备性能进一步判断
					const systemInfo = uni.getSystemInfoSync();
					// 如果是低端设备，使用Nvue
					if (this.isLowEndDevice(systemInfo)) {
						this.useNvue = true;
					}
				}
			},
			isLowEndDevice(systemInfo) {
				// 简单判断是否为低端设备
				// 可以根据实际情况调整判断标准
				if (systemInfo.brand && systemInfo.model) {
					// 根据品牌和型号判断
					const lowEndBrands = ['huawei', 'xiaomi', 'oppo', 'vivo'];
					const isLowEndBrand = lowEndBrands.some(brand =>
						systemInfo.brand.toLowerCase().includes(brand)
					);

					// 可以加入更精确的判断
					return isLowEndBrand;
				}
				return false;
			},
			getVideoDetails() {
				// 从服务器获取视频详情
				// 示例代码，实际中应从API获取
				uni.request({
					url: 'https://your-api.com/videos/' + this.videoInfo.id,
					success: (res) => {
						if (res.data && res.data.code === 0) {
							this.videoInfo = res.data.data;
						}
					}
				});
			},
			getRecommendedVideos() {
				// 从服务器获取推荐视频
				// 示例代码，实际中应从API获取
				uni.request({
					url: 'https://your-api.com/videos/recommended',
					success: (res) => {
						if (res.data && res.data.code === 0) {
							this.recommendedVideos = res.data.data;
						}
					}
				});
			},
			navigateToVideo(id) {
				// 导航到新的视频详情页
				uni.navigateTo({
					url: `/pages/video/detail?id=${id}`
				});
			},
			onVideoPlay() {
				console.log('视频开始播放');
			},
			onVideoPause() {
				console.log('视频暂停');
			},
			onVideoEnded() {
				console.log('视频播放结束');
				// 可以在这里自动播放下一个视频
			},
			onTimeUpdate(e) {
				// 视频播放进度更新
				console.log('当前播放时间:', e.detail.currentTime);
			}
		}
	}
</script>

<style>
	.video-detail-container {
		background-color: #000;
		color: #fff;
	}

	.video-player-wrapper {
		width: 100%;
		height: 56.25vw;
		/* 16:9 宽高比 */
		background-color: #000;
		position: relative;
		z-index: 10;
	}

	.fixed-top {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
	}

	/* 视频播放器样式 */
	video {
		width: 100%;
		height: 100%;
	}

	/* 视频信息区域 */
	.video-info-section {
		padding: 20rpx;
		border-bottom: 1px solid #333;
	}

	.video-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 15rpx;
		line-height: 1.4;
	}

	.video-stats {
		display: flex;
		font-size: 26rpx;
		color: #aaa;
		margin-bottom: 20rpx;
	}

	.views {
		margin-right: 20rpx;
	}

	.rating {
		color: #ff9000;
		margin-right: 20rpx;
	}

	/* 操作按钮区 */
	.action-buttons {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 10rpx 0;
	}

	.action-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 16.66%;
	}

	.btn-icon {
		font-size: 40rpx;
		margin-bottom: 5rpx;
	}

	.btn-text {
		font-size: 22rpx;
		color: #ccc;
	}

	/* 推荐视频区域 */
	.recommendation-section {
		padding: 20rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.video-list {
		display: flex;
		flex-direction: column;
	}

	.video-item {
		display: flex;
		margin-bottom: 30rpx;
	}

	.video-cover {
		position: relative;
		width: 320rpx;
		height: 180rpx;
		margin-right: 20rpx;
		border-radius: 8rpx;
		overflow: hidden;
		background-color: #333;
	}

	.video-cover image {
		width: 100%;
		height: 100%;
	}

	.video-duration {
		position: absolute;
		bottom: 10rpx;
		right: 10rpx;
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 22rpx;
		padding: 2rpx 8rpx;
		border-radius: 4rpx;
	}

	.video-quality {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		background-color: #ff9000;
		color: #000;
		font-size: 20rpx;
		font-weight: bold;
		padding: 2rpx 8rpx;
		border-radius: 4rpx;
	}

	.video-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.video-info .video-title {
		font-size: 28rpx;
		margin-bottom: 10rpx;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.video-meta {
		display: flex;
		flex-direction: column;
		font-size: 24rpx;
		color: #aaa;
	}

	.channel-name {
		margin-bottom: 5rpx;
	}
</style>