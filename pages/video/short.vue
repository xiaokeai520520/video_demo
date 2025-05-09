<template>
	<view class="short-video-container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">←</text>
			</view>
			<view class="logo">
				<text class="logo-text">Porn</text>
				<text class="logo-highlight">hub</text>
				<text class="beta-tag">BETA</text>
			</view>
		</view>

		<!-- 需要完全用户交互才能播放时显示的大播放按钮 -->
		<view class="full-play-button" v-if="showFullPlayButton" @click="handleFullPlayClick">
			<view class="play-icon-large">▶</view>
			<view class="play-text">点击播放视频</view>
		</view>

		<!-- 滑动视频区域 -->
		<swiper class="video-swiper" :vertical="true" :circular="false" :skip-hidden-item-layout="true"
			:current="currentIndex" @change="onSwiperChange" @animationfinish="onAnimationFinish"
			@transition="onTransition">
			<swiper-item v-for="(item, index) in videoList" :key="item.id">
				<view class="video-item" :id="`video-item-${index}`">
					<!-- 视频播放器 -->
					<!-- #ifdef APP-PLUS -->
					<video :id="`video-${index}`" class="video-player" :ref="`videoRef${index}`" :src="item.videoUrl"
						:poster="item.coverUrl" :controls="false" :loop="true" :enable-progress-gesture="false"
						:object-fit="'cover'" :show-fullscreen-btn="false" :show-play-btn="false"
						:show-center-play-btn="false" :show-progress="false" :muted="index !== currentIndex || isMuted"
						preload="auto" :style="{opacity: 1}" @loadeddata="onVideoReady(index)"
						@canplay="onVideoReady(index)" @canplaythrough="onVideoReady(index)"
						@loadedmetadata="onVideoReady(index)" @play="onVideoPlay(index)" @pause="onVideoPause(index)"
						@ended="onVideoEnded(index)" @timeupdate="onTimeUpdate(index, $event)"
						@waiting="onVideoWaiting(index)" @error="onVideoError(index, $event)"></video>
					<!-- #endif -->

					<!-- 在H5平台使用特殊优化的视频播放器 -->
					<!-- #ifdef H5 -->
					<!-- 修改H5视频标签，添加点击事件 -->
					<video :id="`video-${index}`" class="video-player" :ref="`videoRef${index}`" :src="item.videoUrl"
						:poster="item.coverUrl" :controls="false" :loop="true" :enable-progress-gesture="false"
						:object-fit="'cover'" :muted="index !== currentIndex || isMuted" preload="auto"
						:style="{opacity: 1}" webkit-playsinline playsinline x5-playsinline x5-video-player-type="h5"
						@click="handleVideoClick(index)" @loadeddata="onVideoReady(index)"
						@canplay="onVideoReady(index)" @canplaythrough="onVideoReady(index)"
						@loadedmetadata="onVideoReady(index)" @play="onVideoPlay(index)" @pause="onVideoPause(index)"
						@ended="onVideoEnded(index)" @timeupdate="onTimeUpdate(index, $event)"
						@waiting="onVideoWaiting(index)" @error="onVideoError(index, $event)"></video>
					<!-- #endif -->

					<!-- 加载指示器 -->
					<view class="video-loading" v-if="item.buffering">
						<view class="loading-icon"></view>
					</view>

					<!-- 视频内容覆盖层 -->
					<view class="video-overlay" @click.stop="togglePlayState(index)">
						<!-- 暂停图标 -->
						<view class="pause-icon" v-if="!item.playing && !item.buffering">
							<text class="icon-play">▶</text>
						</view>
					</view>

					<!-- 需要用户交互才能开启声音时显示的静音提示 -->
					<view class="unmute-button" v-if="showUnmuteButton && isMuted && index === currentIndex"
						@click="handleUnmuteClick">
						<view class="unmute-icon">🔊</view>
						<view class="unmute-text">点击开启声音</view>
					</view>

					<!-- 视频信息 -->
					<view class="video-info">
						<view class="author-info">
							<view class="author-avatar">
								<image :src="item.authorAvatar" mode="aspectFill"></image>
								<view class="verified-badge" v-if="item.authorVerified">✓</view>
							</view>
							<text class="author-name">{{ item.authorName }}</text>
						</view>
						<view class="video-title">{{ item.title }}</view>
					</view>

					<!-- 操作按钮 -->
					<view class="action-buttons">
						<view class="action-btn" @click="handleLike(item.id)">
							<view class="action-icon">👍</view>
							<view class="action-count">{{ formatCount(item.likes) }}</view>
						</view>
						<view class="action-btn" @click="handleDislike(item.id)">
							<view class="action-icon">👎</view>
							<view class="action-count">{{ item.dislikes > 0 ? formatCount(item.dislikes) : '' }}</view>
						</view>
						<view class="action-btn" @click="handleShare(item.id)">
							<view class="action-icon">↗️</view>
							<view class="action-text">分享</view>
						</view>
						<view class="action-btn" @click="handleFavorite(item.id)">
							<view class="action-icon">{{ item.favorited ? '❤️' : '🤍' }}</view>
							<view class="action-count">{{ formatCount(item.favorites) }}</view>
						</view>
						<view class="action-btn" @click="toggleMute">
							<view class="action-icon">{{ isMuted ? '🔇' : '🔊' }}</view>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentIndex: 0,
				preloadDistance: 2, // 预加载前后2个视频
				isMuted: false,
				isAndroid: false,
				isIOS: false,
				isH5: false,
				isSafari: false,
				// 自动播放能力检测结果
				canAutoplayMuted: false,
				canAutoplayWithSound: false,
				// 播放状态控制
				showFullPlayButton: false,
				showUnmuteButton: false,
				hasUserInteracted: false,
				// 视频数据
				videoList: [{
						id: '1',
						videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
						coverUrl: 'https://example.com/cover1.jpg',
						authorName: 'Zane Walker',
						authorAvatar: 'https://example.com/avatar1.jpg',
						authorVerified: true,
						title: '妩小少女蘑菇 Q 有史以来第一次中出 - Zane Walker',
						likes: 2000,
						dislikes: 0,
						favorites: 737,
						playing: false,
						buffering: false,
						loaded: false,
						favorited: false,
						duration: 0,
						currentTime: 0
					},
					{
						id: '2',
						videoUrl: 'https://avtshare01.rz.tu-ilmenau.de/avt-vqdb-uhd-1/test_1/segments/bigbuck_bunny_8bit_2000kbps_1080p_60.0fps_h264.mp4',
						coverUrl: 'https://example.com/cover2.jpg',
						authorName: 'Sofia Staks',
						authorAvatar: 'https://example.com/avatar2.jpg',
						authorVerified: true,
						title: '成熟的妈妈 Sofia Staks 是素食主义者，但喜欢一些年轻的 TubeSteak',
						likes: 1500,
						dislikes: 120,
						favorites: 520,
						playing: false,
						buffering: false,
						loaded: false,
						favorited: false,
						duration: 0,
						currentTime: 0
					},
					{
						id: '3',
						videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
						coverUrl: 'https://example.com/cover3.jpg',
						authorName: 'Amy Azurra',
						authorAvatar: 'https://example.com/avatar3.jpg',
						authorVerified: false,
						title: '大山雀金发妓女艾米·阿祖拉（Amy Azurra）在吸吮和他妈的后得到了她渴望的精液!',
						likes: 3200,
						dislikes: 210,
						favorites: 980,
						playing: false,
						buffering: false,
						loaded: false,
						favorited: false,
						duration: 0,
						currentTime: 0
					}
				],
				videoContexts: [],
				lastPlayedIndex: -1,
				transitionStartTime: 0,
				isTransitioning: false,
				loadingVideos: new Set(),
				operationTimeouts: {} // 用于跟踪和清除超时操作
			}
		},
		onLoad() {
			// 检测平台
			this.detectPlatform();

			// 延迟执行以确保DOM完全加载
			setTimeout(() => {
				// 在H5环境下，先检测浏览器能力，然后再初始化视频
				if (this.isH5) {
					this.checkBrowserCapabilities().then(() => {
						this.initializeAfterDetection();
					});
				} else {
					// App环境直接初始化
					this.initializeAfterDetection();
				}
			}, 200);
		},
		onShow() {
			// 页面显示时恢复播放，但要考虑浏览器限制
			if (this.hasUserInteracted) {
				if (this.lastPlayedIndex >= 0) {
					this.resetAndPlayVideo(this.lastPlayedIndex);
				} else {
					this.resetAndPlayVideo(this.currentIndex);
				}
			}
		},
		onHide() {
			// 页面隐藏时暂停播放
			this.stopAllVideos();
			this.lastPlayedIndex = this.currentIndex;
		},
		onUnload() {
			// 页面卸载时释放资源
			this.clearAllTimeouts();
			this.destroyAllVideos();
		},
		methods: {
			// 初始化功能 - 在检测完成后调用
			initializeAfterDetection() {
				console.log('[调试] 初始化视频组件');

				// 预先创建视频上下文
				this.createVideoContexts();

				// 设置初始配置
				this.setupInitialConfig();

				// 使用延迟确保上下文创建完成
				setTimeout(() => {
					if (this.showFullPlayButton) {
						// 如果需要用户交互，不自动播放
						console.log('[调试] 等待用户交互');
					} else {
						// 重置并播放第一个视频
						this.resetAndPlayVideo(this.currentIndex);

						// 预加载其他视频
						this.preloadVideos(this.currentIndex);
					}
				}, 500);
			},

			// 检测浏览器自动播放能力
			async checkBrowserCapabilities() {
				console.log('[调试] 检测浏览器自动播放能力');

				// 默认假设移动端H5环境不支持自动播放
				this.canAutoplayMuted = false;
				this.canAutoplayWithSound = false;

				// 如果是H5环境，进行实际检测
				if (this.isH5) {
					// 先检测静音自动播放
					this.canAutoplayMuted = await this.checkAutoplayCapability(false);
					console.log('[调试] 静音自动播放能力:', this.canAutoplayMuted);

					// 再检测带声音自动播放
					this.canAutoplayWithSound = await this.checkAutoplayCapability(true);
					console.log('[调试] 带声音自动播放能力:', this.canAutoplayWithSound);
				}
			},

			// 检测自动播放能力 - 优化版本
			checkAutoplayCapability(withSound = false) {
				return new Promise((resolve) => {
					// 如果不是H5环境，直接返回true（App环境通常可以控制播放）
					if (!this.isH5) {
						resolve(true);
						return;
					}

					console.log(`[调试] 检测${withSound ? '带声音' : '静音'}自动播放能力`);

					// 创建临时视频元素
					let tempVideo = null;
					let timeoutId = null;

					// 清理函数
					const cleanup = () => {
						if (timeoutId) {
							clearTimeout(timeoutId);
							timeoutId = null;
						}

						// 添加额外检查，确保元素存在
						try {
							if (tempVideo) {
								if (tempVideo.pause && typeof tempVideo.pause === 'function') {
									tempVideo.pause();
								}
								if (tempVideo.parentNode) {
									tempVideo.parentNode.removeChild(tempVideo);
								}
							}
						} catch (e) {
							console.error("清理临时视频时出错:", e);
						}

						tempVideo = null;
					};

					try {
						tempVideo = document.createElement('video');

						if (!tempVideo) {
							console.error('[调试] 无法创建视频元素');
							resolve(false);
							return;
						}

						// 设置视频属性
						tempVideo.setAttribute('playsinline', '');
						tempVideo.setAttribute('webkit-playsinline', '');

						// 设置静音状态，根据检测需求
						tempVideo.muted = !withSound;

						// 使用一个非常短的视频源
						tempVideo.src =
							'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAA7RtZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0OCByMjY0MyA1YzY1NzA0IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTAgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTMgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAA3//728P4FNjuZQQAAAu5tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAAZAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACSnRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAZAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAgAAAAIAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAGQAAAEAAAAAAZBtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAACgAAAAEAFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAE7bWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAA+3N0YmwAAACXc3RzZAAAAAAAAAABAAAAh2F2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAgACAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAxYXZjQwFkAAr/4QAYZ2QACqzZX4iIhAAAAwAEAAADAFA8SJZYAQAGaOvjyyLAAAAAGHN0dHMAAAAAAAAAAQAAAAEAAAQAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAABRzdHN6AAAAAAAAAsUAAAABAAAAFHN0Y28AAAAAAAAAAQAAADAAAABidWR0YQAAAFptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAAC1pbHN0AAAAJal0b28AAAAdZGF0YQAAAAEAAAAATGF2ZjU2LjQwLjEwMQ==';

						// 需要添加到DOM中
						tempVideo.style.display = 'none';
						document.body.appendChild(tempVideo);

						// 设置超时，以防卡住
						timeoutId = setTimeout(() => {
							cleanup();
							// 超时视为不支持
							console.log(`[调试] ${withSound ? '带声音' : '静音'}自动播放检测超时，假设不支持`);
							resolve(false);
						}, 2000);

						// 播放成功事件
						tempVideo.onplaying = () => {
							cleanup();
							console.log(`[调试] ${withSound ? '带声音' : '静音'}自动播放: 支持`);
							resolve(true);
						};

						// 监听错误事件
						tempVideo.onended = tempVideo.onerror = tempVideo.onabort = () => {
							cleanup();
							console.log(`[调试] ${withSound ? '带声音' : '静音'}自动播放: 不支持 (出错)`);
							resolve(false);
						};

						// 尝试播放
						try {
							if (tempVideo.play && typeof tempVideo.play === 'function') {
								const playPromise = tempVideo.play();

								if (playPromise !== undefined && playPromise.then) {
									playPromise.catch(error => {
										console.log(`[调试] ${withSound ? '带声音' : '静音'}自动播放: 不支持`, error);
										cleanup();
										resolve(false);
									});
								} else {
									// 旧版浏览器不支持Promise API，依赖事件检测
									console.log("[调试] 使用事件检测自动播放能力");
								}
							} else {
								console.error('[调试] play不是一个函数');
								cleanup();
								resolve(false);
							}
						} catch (e) {
							console.error('[调试] 播放失败:', e);
							cleanup();
							resolve(false);
						}
					} catch (e) {
						console.error('[调试] 检测自动播放能力出错:', e);
						if (tempVideo && tempVideo.parentNode) {
							tempVideo.parentNode.removeChild(tempVideo);
						}
						resolve(false);
					}
				});
			},

			// 根据检测结果设置初始配置
			setupInitialConfig() {
				console.log('[调试] 设置初始配置');

				// 默认不显示交互按钮
				this.showFullPlayButton = false;
				this.showUnmuteButton = false;

				// 如果在H5环境
				if (this.isH5) {
					// 如果支持带声音自动播放
					if (this.canAutoplayWithSound) {
						this.isMuted = false;
					}
					// 如果只支持静音自动播放
					else if (this.canAutoplayMuted) {
						this.isMuted = true;
						this.showUnmuteButton = true; // 显示开启声音按钮
					}
					// 如果都不支持
					else {
						this.isMuted = true;
						this.showFullPlayButton = true; // 显示完全播放按钮
					}
				} else {
					// App环境通常可以自由控制播放
					this.isMuted = false;
				}

				console.log('[调试] 初始配置:', {
					isMuted: this.isMuted,
					showUnmuteButton: this.showUnmuteButton,
					showFullPlayButton: this.showFullPlayButton
				});
			},

			// 处理完全播放点击 - 优化版
			handleFullPlayClick() {
				console.log('[调试] 用户点击了完全播放按钮');

				this.showFullPlayButton = false;
				this.hasUserInteracted = true;

				// 延长延迟，确保DOM更新完成
				setTimeout(() => {
					// 先设置为静音，确保能播放成功
					this.isMuted = true;

					// 使用多种播放策略
					this.playVideoWithFallbacks(this.currentIndex);

					// 如果不支持带声音自动播放，显示静音提示
					if (!this.canAutoplayWithSound) {
						this.showUnmuteButton = true;
					}
				}, 500);
			},

			// 带回退机制的视频播放
			playVideoWithFallbacks(index) {
				console.log('[调试] 尝试带回退机制播放视频:', index);

				// 策略1: 使用DOM API直接播放
				try {
					const videoEl = this.getVideoElement(index);

					if (videoEl) {
						console.log('[调试] 策略1: 获取到视频元素，验证play方法');

						// 严格验证play方法
						if (videoEl.play && typeof videoEl.play === 'function') {
							console.log('[调试] play是一个函数，尝试播放');

							videoEl.muted = this.isMuted;

							// 尝试播放
							try {
								const playPromise = videoEl.play();

								if (playPromise && typeof playPromise.then === 'function') {
									playPromise.then(() => {
										console.log('[调试] 播放成功');
										this.videoList[index].playing = true;
									}).catch(e => {
										console.error('[调试] 播放失败，尝试策略2:', e);
										this.playWithStrategy2(index);
									});
								} else {
									console.log('[调试] play方法没有返回Promise，假设播放成功');
									this.videoList[index].playing = true;
								}
							} catch (e) {
								console.error('[调试] 直接播放出错:', e);
								this.playWithStrategy2(index);
							}
						} else {
							console.error('[调试] play不是一个函数，尝试策略2');
							this.playWithStrategy2(index);
						}
					} else {
						console.error('[调试] 无法获取视频元素，尝试策略2');
						this.playWithStrategy2(index);
					}
				} catch (e) {
					console.error('[调试] 策略1出错，尝试策略2:', e);
					this.playWithStrategy2(index);
				}
			},

			// 策略2: 使用uni API
			playWithStrategy2(index) {
				console.log('[调试] 策略2: 使用uni API播放视频');

				try {
					// 确保我们有视频上下文
					if (!this.videoContexts[index]) {
						this.createVideoContext(index);
					}

					if (this.videoContexts[index]) {
						// 设置静音状态
						try {
							this.videoContexts[index].muted = this.isMuted;
						} catch (e) {
							console.error('[调试] 设置静音失败:', e);
						}

						// 尝试播放
						try {
							this.videoContexts[index].play();
							console.log('[调试] uni API播放请求已发送');
							this.videoList[index].playing = true;
						} catch (e) {
							console.error('[调试] uni API播放失败，尝试策略3:', e);
							this.playWithStrategy3(index);
						}
					} else {
						console.error('[调试] 无法获取视频上下文，尝试策略3');
						this.playWithStrategy3(index);
					}
				} catch (e) {
					console.error('[调试] 策略2整体失败，尝试策略3:', e);
					this.playWithStrategy3(index);
				}
			},

			// 策略3: 重置播放器并重试
			playWithStrategy3(index) {
				console.log('[调试] 策略3: 重置播放器并重试');

				try {
					// 重置视频状态
					this.$set(this.videoList[index], 'loaded', true);
					this.$set(this.videoList[index], 'buffering', false);
					this.$set(this.videoList[index], 'playing', false);

					// 使用定时器确保视频元素已更新
					setTimeout(() => {
						// 强制重建视频上下文
						if (this.videoContexts[index]) {
							try {
								this.videoContexts[index].stop();
							} catch (e) {}
						}

						// 删除旧的上下文
						if (this.videoContexts[index]) {
							this.$delete(this.videoContexts, index);
						}

						// 创建新的上下文
						this.createVideoContext(index);

						// 再次尝试播放
						if (this.videoContexts[index]) {
							try {
								this.videoContexts[index].muted = this.isMuted;
								this.videoContexts[index].play();
								console.log('[调试] 重建上下文后播放成功');
								this.videoList[index].playing = true;
							} catch (e) {
								console.error('[调试] 重建上下文后播放仍失败:', e);
								this.showPlaybackError();
							}
						} else {
							console.error('[调试] 无法重建视频上下文');
							this.showPlaybackError();
						}
					}, 300);
				} catch (e) {
					console.error('[调试] 策略3失败:', e);
					this.showPlaybackError();
				}
			},

			// 显示播放错误
			showPlaybackError() {
				console.error('[调试] 所有播放策略均失败');

				// 显示错误提示
				uni.showToast({
					title: '视频播放失败，请稍后再试',
					icon: 'none',
					duration: 2000
				});

				// 如果已经隐藏了播放按钮，重新显示
				this.showFullPlayButton = true;
			},

			// 处理取消静音点击
			handleUnmuteClick() {
				console.log('[调试] 用户点击了开启声音按钮');

				// 用户已交互，可以取消静音
				this.isMuted = false;
				this.showUnmuteButton = false;
				this.hasUserInteracted = true;

				// 更新视频静音状态
				this.updateMuteStatus();
			},

			// 更新视频的静音状态
			updateMuteStatus() {
				// 设置当前视频的静音状态
				if (this.videoContexts[this.currentIndex]) {
					try {
						this.videoContexts[this.currentIndex].muted = this.isMuted;
						console.log(`[调试] 设置当前视频 ${this.currentIndex} 静音:`, this.isMuted);
					} catch (e) {
						console.error('更新视频静音状态失败:', e);
					}
				}

				// 如果在H5环境，直接操作DOM
				if (this.isH5) {
					try {
						const videoElement = this.getVideoElement(this.currentIndex);
						if (videoElement) {
							videoElement.muted = this.isMuted;
						}
					} catch (e) {
						console.error('更新DOM元素静音状态失败:', e);
					}
				}
			},

			// 优化版获取视频元素
			getVideoElement(index) {
				console.log(`[调试] 尝试获取视频元素: video-${index}`);

				let videoEl = null;

				// 尝试多种方式获取视频元素
				try {
					// 方式1：通过ID选择器
					videoEl = document.getElementById(`video-${index}`);
					if (videoEl) {
						console.log('[调试] 通过ID获取到视频元素');
					}

					// 方式2：如果方式1失败，尝试通过DOM结构查找
					if (!videoEl) {
						console.log('[调试] ID方式失败，尝试查找视频元素');

						// 尝试使用更通用的选择器
						const videos = document.querySelectorAll('video');
						console.log(`[调试] 找到 ${videos.length} 个视频元素`);

						if (videos.length > 0) {
							// 如果找到了视频元素，使用第一个
							videoEl = videos[0];
							console.log('[调试] 使用找到的第一个视频元素');
						}
					}

					// 检查元素是否有效
					if (videoEl) {
						console.log('[调试] 成功获取视频元素');

						// 验证元素的有效性
						if (videoEl.nodeName.toLowerCase() !== 'video') {
							console.error('[调试] 获取的元素不是视频元素');
							videoEl = null;
						}
					} else {
						console.error('[调试] 未找到视频元素');
					}
				} catch (e) {
					console.error('[调试] 获取视频元素时出错:', e);
				}

				return videoEl;
			},

			// 视频加载事件处理
			onVideoReady(index) {
				console.log(`[调试] 视频 ${index} 已加载`);
				this.videoList[index].loaded = true;
				this.loadingVideos.delete(index);

				// 如果是当前视频，确保它在播放
				if (index === this.currentIndex && !this.videoList[index].playing && !this.showFullPlayButton) {
					// 延迟一点以确保视频已准备好
					setTimeout(() => {
						this.resetAndPlayVideo(index);
					}, 100);
				}
			},

			detectPlatform() {
				// #ifdef APP-PLUS
				const platform = uni.getSystemInfoSync().platform;
				this.isAndroid = platform === 'android';
				this.isIOS = platform === 'ios';
				// #endif

				// #ifdef H5
				this.isH5 = true;

				// 检测 Safari 浏览器
				this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
				console.log('[调试] 是否 Safari 浏览器:', this.isSafari);
				// #endif
			},
			createVideoContext(index) {
			  console.log(`[调试] 创建视频 ${index} 上下文`);
			  try {
			    const ctx = uni.createVideoContext(`video-${index}`, this);
			    if (ctx) {
			      this.videoContexts[index] = ctx;
			      console.log(`[调试] 视频 ${index} 上下文创建成功`);
			      return ctx;
			    } else {
			      console.error(`[调试] 创建视频 ${index} 上下文失败`);
			      return null;
			    }
			  } catch (e) {
			    console.error(`创建视频 ${index} 上下文错误:`, e);
			    return null;
			  }
			},

			createVideoContexts() {
				console.log('[调试] 创建视频上下文');

				// 为当前视频创建上下文
				try {
					const ctx = uni.createVideoContext(`video-${this.currentIndex}`, this);
					if (ctx) {
						this.videoContexts[this.currentIndex] = ctx;
						console.log(`[调试] 视频 ${this.currentIndex} 上下文创建成功`);
					} else {
						console.error(`[调试] 创建视频 ${this.currentIndex} 上下文失败`);
					}
				} catch (e) {
					console.error(`创建视频上下文错误:`, e);
				}

				// 预加载的视频
				const preloadIndices = [this.currentIndex + 1, this.currentIndex - 1].filter(
					idx => idx >= 0 && idx < this.videoList.length
				);

				// 为预加载视频创建上下文
				preloadIndices.forEach(index => {
					try {
						const ctx = uni.createVideoContext(`video-${index}`, this);
						if (ctx) {
							this.videoContexts[index] = ctx;
							console.log(`[调试] 视频 ${index} 上下文创建成功`);
						}
					} catch (e) {
						console.error(`创建视频 ${index} 上下文错误:`, e);
					}
				});
			},

			releaseDistantVideos() {
				const currentIdx = this.currentIndex;

				this.videoList.forEach((video, index) => {
					// 如果视频距离当前视频超过3个位置，释放资源
					if (Math.abs(index - currentIdx) > 3) {
						if (this.videoContexts[index]) {
							try {
								this.videoContexts[index].stop();
								// 将视频源设为空字符串可以释放资源
								this.$set(this.videoList[index], 'tempVideoUrl', this.videoList[index].videoUrl);
								this.$set(this.videoList[index], 'videoUrl', '');
								this.$set(this.videoList[index], 'loaded', false);
								console.log(`[调试] 释放视频 ${index} 资源`);
							} catch (e) {
								console.error(`释放视频 ${index} 资源失败:`, e);
							}
						}
					} else if (this.videoList[index].tempVideoUrl) {
						// 恢复被释放的视频源
						this.$set(this.videoList[index], 'videoUrl', this.videoList[index].tempVideoUrl);
						this.$set(this.videoList[index], 'tempVideoUrl', '');
						console.log(`[调试] 恢复视频 ${index} 资源`);
					}
				});
			},

			onSwiperChange(e) {
				const oldIndex = this.currentIndex;
				const newIndex = e.detail.current;

				console.log(`[调试] 从视频 ${oldIndex} 切换到 ${newIndex}`);

				// 更新当前索引
				this.currentIndex = newIndex;

				// Safari 特殊处理
				if (this.isSafari) {
					this.handleSafariVideoSwitch(oldIndex, newIndex);
				} else {
					// 停止所有视频
					this.stopAllVideos();

					// 使用延迟确保停止操作完成
					setTimeout(() => {
						this.resetAndPlayVideo(newIndex);
					}, 100);
				}

				// 在视频切换成功后释放远处的视频资源
				setTimeout(() => {
					this.releaseDistantVideos();
				}, 500);
			},

			// 添加 Safari 特殊视频切换处理方法
			handleSafariVideoSwitch(oldIndex, newIndex) {
				console.log('[调试] Safari 特殊视频切换处理');

				// 先暂停旧视频
				if (this.videoContexts[oldIndex]) {
					try {
						this.videoContexts[oldIndex].pause();
						this.videoList[oldIndex].playing = false;
					} catch (e) {
						console.error(`Safari 暂停旧视频出错:`, e);
					}
				}

				// 在 Safari 中，我们需要引导用户点击来播放新视频
				// 设置新视频为准备状态，但不自动播放
				this.videoList[newIndex].loaded = true;
				this.videoList[newIndex].buffering = false;

				// 如果用户已经交互过，尝试自动播放
				if (this.hasUserInteracted) {
					// 尝试多策略播放
					this.playVideoWithFallbacks(newIndex);
				} else {
					// 如果用户还未交互，显示播放按钮
					this.showFullPlayButton = true;
				}
			},

			// 停止所有视频
			stopAllVideos() {
				this.videoList.forEach((_, index) => {
					if (this.videoContexts[index]) {
						try {
							// 先停止视频
							this.videoContexts[index].stop();
							this.videoList[index].playing = false;
						} catch (e) {
							console.error(`停止视频 ${index} 出错:`, e);
						}
					}
				});
			},

			// 重置并播放视频
			resetAndPlayVideo(index) {
				if (!this.videoContexts[index]) {
					console.error(`[调试] 视频上下文不存在: ${index}`);
					return;
				}

				console.log(`[调试] 重置并播放视频 ${index}`);

				// 强制设置为已加载
				this.videoList[index].loaded = true;
				this.videoList[index].buffering = false;

				// 如果需要用户交互而用户尚未交互
				if (this.showFullPlayButton && !this.hasUserInteracted) {
					console.log('[调试] 等待用户交互，不自动播放');
					return;
				}

				// 使用多策略播放
				this.playVideoWithFallbacks(index);
			},

			// 安全的暂停方法 - 简化版
			safePauseVideo(index) {
				if (!this.videoContexts[index]) return;

				try {
					this.videoContexts[index].pause();
					this.videoList[index].playing = false;
				} catch (e) {
					console.error(`暂停视频 ${index} 出错:`, e);
				}
			},

			// 清除所有超时
			clearAllTimeouts() {
				Object.keys(this.operationTimeouts).forEach(key => {
					if (typeof this.operationTimeouts[key] === 'number') {
						clearTimeout(this.operationTimeouts[key]);
					} else if (typeof this.operationTimeouts[key] === 'object') {
						clearInterval(this.operationTimeouts[key]);
					}
				});
				this.operationTimeouts = {};
			},

			pauseAllVideos() {
				this.videoList.forEach((_, index) => {
					this.safePauseVideo(index);
				});
			},

			// 使用多策略播放代替直接处理
			handleSafariPlay(index) {
				console.log(`[调试] Safari专用播放方法`);
				this.playVideoWithFallbacks(index);
			},

			destroyAllVideos() {
				// 释放视频资源
				this.videoContexts.forEach(ctx => {
					if (ctx && typeof ctx.destroy === 'function') {
						try {
							ctx.destroy();
						} catch (e) {
							console.error('销毁视频上下文出错:', e);
						}
					}
				});
				this.videoContexts = [];
			},

			// 简化预加载逻辑
			preloadVideos(currentIndex) {
				// 预加载前后几个视频
				const preloadIndices = [];

				// 计算需要预加载的视频索引
				for (let i = 1; i <= this.preloadDistance; i++) {
					// 向后预加载
					const nextIndex = currentIndex + i;
					if (nextIndex < this.videoList.length) {
						preloadIndices.push(nextIndex);
					}

					// 向前预加载
					const prevIndex = currentIndex - i;
					if (prevIndex >= 0) {
						preloadIndices.push(prevIndex);
					}
				}

				// 错开执行预加载，防止同时预加载导致性能问题
				preloadIndices.forEach((index, i) => {
					// 延迟预加载，每个视频错开200ms
					this.operationTimeouts[`preload_${index}`] = setTimeout(() => {
						// 简单标记为已加载
						this.videoList[index].loaded = true;
					}, i * 200);
				});
			},

			togglePlayState(index) {
				console.log(`[调试] 点击播放暂停按钮，当前状态: ${this.videoList[index].playing ? '播放中' : '已暂停'}`);

				// 标记用户已交互
				this.hasUserInteracted = true;

				// 移除提示按钮
				this.showFullPlayButton = false;

				if (this.videoList[index].playing) {
					// 视频正在播放，暂停它
					this.safePauseVideo(index);
				} else {
					// 视频已暂停，播放它
					this.playVideoWithFallbacks(index);
				}
			},

			// 添加到 methods 中
			handleVideoClick(index) {
				console.log(`[调试] 视频点击: ${index}`);

				// 标记用户已交互
				this.hasUserInteracted = true;

				// 如果有全屏播放按钮，先处理它
				if (this.showFullPlayButton) {
					this.handleFullPlayClick();
					return;
				}

				// 切换播放状态
				this.togglePlayState(index);
			},

			toggleMute() {
				this.isMuted = !this.isMuted;
				console.log(`[调试] 切换全局静音状态:`, this.isMuted);

				// 标记用户已交互
				this.hasUserInteracted = true;

				// 更新静音状态
				this.updateMuteStatus();

				// 如果取消静音，隐藏提示按钮
				if (!this.isMuted) {
					this.showUnmuteButton = false;
				}
			},

			onVideoPlay(index) {
				console.log(`[调试] 视频 ${index} 播放事件触发`);

				if (!this.videoList[index]) return;

				// 更新状态前检查
				if (this.videoList[index].buffering) {
					this.videoList[index].buffering = false;
				}

				this.videoList[index].playing = true;

				// 停止其他视频播放
				this.videoList.forEach((_, i) => {
					if (i !== index && this.videoList[i].playing) {
						this.safePauseVideo(i);
					}
				});
			},

			onVideoPause(index) {
				console.log(`[调试] 视频 ${index} 暂停事件触发`);
				this.videoList[index].playing = false;
			},

			onVideoEnded(index) {
				// 视频结束后循环播放
				this.videoList[index].playing = false;

				// 使用多策略播放
				this.playVideoWithFallbacks(index);
			},

			onTimeUpdate(index, e) {
				// 更新视频播放时间
				this.videoList[index].currentTime = e.detail.currentTime;

				// 如果获取到了视频总时长
				if (e.detail.duration && this.videoList[index].duration === 0) {
					this.videoList[index].duration = e.detail.duration;
				}

				// 视频播放中，确保设置为非缓冲状态
				this.videoList[index].buffering = false;
			},

			onVideoWaiting(index) {
				// 视频正在缓冲
				this.videoList[index].buffering = true;
			},

			onVideoError(index, e) {
				console.error(`[调试] 视频 ${index} 错误:`, e.detail);

				// 尝试重新加载视频
				setTimeout(() => {
					this.playVideoWithFallbacks(index);
				}, 1000);
			},

			onTransition(e) {
				// 滑动过渡开始
				if (!this.isTransitioning) {
					this.isTransitioning = true;
					this.transitionStartTime = Date.now();
				}
			},

			onAnimationFinish() {
				// 动画结束
				this.isTransitioning = false;
			},

			formatCount(count) {
				if (count >= 10000) {
					return (count / 10000).toFixed(1) + '万';
				} else if (count >= 1000) {
					return (count / 1000).toFixed(1) + 'K';
				}
				return count.toString();
			},

			handleLike(id) {
				// 处理点赞操作
				const index = this.videoList.findIndex(item => item.id === id);
				if (index !== -1) {
					this.videoList[index].likes++;
				}
			},

			handleDislike(id) {
				// 处理点踩操作
				const index = this.videoList.findIndex(item => item.id === id);
				if (index !== -1) {
					this.videoList[index].dislikes++;
				}
			},

			handleShare(id) {
				// 分享视频
				uni.showShareMenu({
					withShareTicket: true,
					success() {
						console.log('分享视频:', id);
					},
					fail() {
						// 分享菜单打开失败，使用自定义分享
						uni.showModal({
							title: '分享',
							content: '复制链接分享到社交媒体',
							success(res) {
								if (res.confirm) {
									uni.setClipboardData({
										data: `https://example.com/share/${id}`,
										success() {
											uni.showToast({
												title: '链接已复制',
												icon: 'success'
											});
										}
									});
								}
							}
						});
					}
				});
			},

			handleFavorite(id) {
				// 收藏视频
				const index = this.videoList.findIndex(item => item.id === id);
				if (index !== -1) {
					const isFavorited = !this.videoList[index].favorited;
					this.videoList[index].favorited = isFavorited;

					// 更新收藏数
					if (isFavorited) {
						this.videoList[index].favorites++;
					} else {
						this.videoList[index].favorites--;
					}
				}
			},

			goBack() {
				// 返回上一页
				uni.navigateBack();
			}
		}
	}
</script>
<style>
	@import '@/styles/pages/short-video.scss';
</style>