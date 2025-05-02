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
							<text class="action-icon">👍</text>
							<text class="action-count">{{ formatCount(item.likes) }}</text>
						</view>
						<view class="action-btn" @click="handleDislike(item.id)">
							<text class="action-icon">👎</text>
							<text class="action-count">{{ item.dislikes > 0 ? formatCount(item.dislikes) : '' }}</text>
						</view>
						<view class="action-btn" @click="handleShare(item.id)">
							<text class="action-icon">↗️</text>
							<text class="action-text">分享</text>
						</view>
						<view class="action-btn" @click="handleFavorite(item.id)">
							<text class="action-icon">{{ item.favorited ? '❤️' : '🤍' }}</text>
							<text class="action-count">{{ formatCount(item.favorites) }}</text>
						</view>
						<view class="action-btn" @click="toggleMute">
							<text class="action-icon">{{ isMuted ? '🔇' : '🔊' }}</text>
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
						videoUrl: 'https://avtshare01.rz.tu-ilmenau.de/avt-vqdb-uhd-1/test_1/segments/bigbuck_bunny_8bit_2000kbps_1080p_60.0fps_h264.mp4',
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

			// 预先创建视频上下文
			this.createVideoContexts();

			// 使用延迟确保上下文创建完成
			setTimeout(() => {
				// 重置并播放第一个视频
				this.resetAndPlayVideo(this.currentIndex);

				// 预加载其他视频
				for (let i = 0; i < this.videoList.length; i++) {
					if (i !== this.currentIndex) {
						// 预加载其他视频，但不播放
						this.videoList[i].loaded = true;
					}
				}
			}, 500);
		},
		onShow() {
			// 页面显示时恢复播放
			if (this.lastPlayedIndex >= 0) {
				this.resetAndPlayVideo(this.lastPlayedIndex);
			} else {
				this.resetAndPlayVideo(this.currentIndex);
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
			// 添加到 methods 中
			handleVideoClick(index) {
				console.log(`[调试] 视频点击: ${index}`);

				// Safari特殊处理
				if (this.isSafari && index === this.currentIndex) {
					try {
						// 获取DOM元素直接操作
						const videoElement = document.getElementById(`video-${index}`);
						if (videoElement) {
							// 设置正确的静音状态
							videoElement.muted = this.isMuted;

							if (this.videoList[index].playing) {
								videoElement.pause();
								this.videoList[index].playing = false;
							} else {
								videoElement.play().then(() => {
									this.videoList[index].playing = true;
									console.log(`[调试] Safari视频播放成功`);
								}).catch(e => {
									console.error(`[调试] Safari播放失败:`, e);
									uni.showToast({
										title: '请再次点击视频播放',
										icon: 'none',
										duration: 2000
									});
								});
							}
						}
					} catch (e) {
						console.error(`处理视频点击出错:`, e);
					}
				}
			},
			// 视频加载事件处理
			onVideoReady(index) {
				console.log(`[调试] 视频 ${index} 已加载`);
				this.videoList[index].loaded = true;
				this.loadingVideos.delete(index);

				// 如果是当前视频，确保它在播放
				if (index === this.currentIndex && !this.videoList[index].playing) {
					// 特殊处理第二个视频
					if (index === 1) {
						setTimeout(() => {
							if (!this.isMuted) {
								this.videoContexts[index].muted = false;
							}
						}, 100);
					}
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
			createVideoContexts() {
				console.log('[调试] 开始创建视频上下文');
				// 为每个视频创建上下文
				this.videoContexts = this.videoList.map((_, index) => {
					const ctx = uni.createVideoContext(`video-${index}`, this);
					console.log(`[调试] 视频 ${index} 上下文创建结果:`, ctx ? '成功' : '失败');
					return ctx;
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
					return;
				}

				// 停止所有视频
				this.stopAllVideos();

				// 使用延迟确保停止操作完成
				setTimeout(() => {
					this.resetAndPlayVideo(newIndex);
				}, 100);
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

				// 尝试直接播放（可能会失败，但值得一试）
				setTimeout(() => {
					try {
						const videoElement = document.getElementById(`video-${newIndex}`);
						if (videoElement) {
							videoElement.muted = this.isMuted;
							videoElement.play().catch(() => {
								// 如果失败，则显示提示
								uni.showToast({
									title: '点击视频开始播放',
									icon: 'none',
									duration: 2000
								});
							});
						}
					} catch (e) {
						console.error('Safari自动播放失败:', e);
					}
				}, 300);
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
			  if (!this.videoContexts[index]) return;
			  
			  console.log(`[调试] 重置并播放视频 ${index}`);
			  
			  // 强制设置为已加载
			  this.videoList[index].loaded = true;
			  this.videoList[index].buffering = false;
			  
			  // Safari 特殊处理
			  if (this.isSafari && this.isH5) {
			    this.handleSafariPlay(index);
			    return;
			  }
			  
			  // 非Safari浏览器或App端处理
			  try {
			    // 设置静音状态
			    this.videoContexts[index].muted = this.isMuted;
			    
			    // 播放视频
			    this.videoContexts[index].play();
			    
			    // 主动设置状态，不等待事件回调
			    this.videoList[index].playing = true;
			    console.log(`[调试] 视频 ${index} 已请求播放`);
			  } catch (e) {
			    console.error(`播放视频 ${index} 出错:`, e);
			    // 发生错误时还原状态
			    this.videoList[index].playing = false;
			  }
			},
			// 安全的播放方法 - 替换为直接调用重置播放
			safePlayVideo(index) {
				this.resetAndPlayVideo(index);
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
			handleSafariPlay(index) {
			  console.log(`[调试] Safari专用播放方法`);
			  
			  try {
			    const videoElement = document.getElementById(`video-${index}`);
			    if (videoElement) {
			      // 设置正确的静音状态
			      videoElement.muted = this.isMuted;
			      
			      // 尝试播放
			      videoElement.play().then(() => {
			        this.videoList[index].playing = true;
			        console.log(`[调试] Safari视频播放成功`);
			      }).catch(e => {
			        console.error(`[调试] Safari播放失败:`, e);
			        // 播放失败时提示用户
			        uni.showToast({
			          title: '点击播放视频',
			          icon: 'none',
			          duration: 2000
			        });
			        // 恢复状态
			        this.videoList[index].playing = false;
			      });
			    }
			  } catch (e) {
			    console.error(`Safari播放处理出错:`, e);
			  }
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
			  
			  // 如果是Safari浏览器，使用特殊处理
			  if (this.isSafari && this.isH5) {
			    this.handleSafariPlayToggle(index);
			    return;
			  }
			  
			  if (this.videoList[index].playing) {
			    // 视频正在播放，暂停它
			    this.safePauseVideo(index);
			  } else {
			    // 视频已暂停，播放它
			    this.resetAndPlayVideo(index);
			  }
			},
			// 新增方法 - Safari特殊处理播放/暂停
			// 修改Safari的点击处理
			handleSafariPlayToggle(index) {
			  console.log(`[调试] Safari专用播放/暂停处理`);
			  
			  try {
			    // 获取视频元素
			    const videoEl = document.querySelector(`#video-${index}`);
			    console.log(`[调试] Safari点击获取视频元素:`, videoEl);
			    
			    if (videoEl) {
			      if (this.videoList[index].playing) {
			        // 如果是播放状态，尝试暂停
			        if (typeof videoEl.pause === 'function') {
			          videoEl.pause();
			        }
			        this.videoList[index].playing = false;
			        console.log(`[调试] Safari视频已暂停`);
			      } else {
			        // 如果是暂停状态，尝试播放
			        videoEl.muted = this.isMuted;
			        
			        if (typeof videoEl.play === 'function') {
			          const playPromise = videoEl.play();
			          
			          if (playPromise !== undefined) {
			            playPromise.then(() => {
			              this.videoList[index].playing = true;
			              console.log(`[调试] Safari视频已开始播放`);
			            }).catch(e => {
			              console.error(`[调试] Safari播放失败:`, e);
			              // 恢复视频状态
			              this.videoList[index].playing = false;
			              
			              // 提示用户
			              uni.showToast({
			                title: '请再次点击视频播放',
			                icon: 'none',
			                duration: 2000
			              });
			            });
			          } else {
			            // 旧版Safari支持
			            this.videoList[index].playing = true;
			          }
			        } else {
			          // 尝试使用uni API
			          if (this.videoContexts[index]) {
			            this.videoContexts[index].play();
			            this.videoList[index].playing = true;
			          }
			        }
			      }
			    } else {
			      console.error(`[调试] 无法找到视频元素`);
			      
			      // 降级处理 - 尝试使用uni API
			      if (this.videoList[index].playing) {
			        this.safePauseVideo(index);
			      } else {
			        this.resetAndPlayVideo(index);
			      }
			    }
			  } catch (e) {
			    console.error(`Safari播放/暂停处理出错:`, e);
			    
			    // 降级处理
			    if (this.videoList[index].playing) {
			      this.safePauseVideo(index);
			    } else {
			      this.resetAndPlayVideo(index);
			    }
			  }
			},
			// 修改处理Safari播放的方法
			handleSafariPlay(index) {
			  console.log(`[调试] Safari专用播放方法`);
			  
			  try {
			    // 使用更可靠的方式获取视频元素
			    const videoEl = document.querySelector(`#video-${index}`);
			    console.log(`[调试] Safari视频元素:`, videoEl);
			    
			    if (videoEl && typeof videoEl.play === 'function') {
			      // 确认play方法存在再调用
			      videoEl.muted = this.isMuted;
			      
			      // 使用Promise处理play()调用
			      const playPromise = videoEl.play();
			      
			      if (playPromise !== undefined) {
			        playPromise.then(() => {
			          console.log(`[调试] Safari视频播放成功`);
			          this.videoList[index].playing = true;
			        }).catch(err => {
			          console.error(`[调试] Safari播放失败:`, err);
			          this.videoList[index].playing = false;
			          
			          // 提示用户交互
			          uni.showToast({
			            title: '请点击视频区域播放',
			            icon: 'none',
			            duration: 2000
			          });
			        });
			      } else {
			        // 部分旧版Safari不返回Promise
			        console.log(`[调试] Safari旧版本播放处理`);
			        // 假设播放成功
			        this.videoList[index].playing = true;
			      }
			    } else {
			      console.error(`[调试] 无法获取有效的视频元素:`, videoEl);
			      
			      // 尝试使用uni API
			      if (this.videoContexts[index]) {
			        this.videoContexts[index].play();
			        this.videoList[index].playing = true;
			      }
			    }
			  } catch (e) {
			    console.error(`Safari播放处理出错:`, e);
			    
			    // 降级处理 - 尝试使用uni API
			    try {
			      if (this.videoContexts[index]) {
			        this.videoContexts[index].play();
			        this.videoList[index].playing = true;
			      }
			    } catch (err) {
			      console.error(`降级处理也失败:`, err);
			    }
			  }
			},
			toggleMute() {
				this.isMuted = !this.isMuted;
				console.log(`[调试] 切换全局静音状态:`, this.isMuted);

				// 设置当前视频的静音状态
				if (this.videoContexts[this.currentIndex]) {
					this.videoContexts[this.currentIndex].muted = this.isMuted;
					console.log(`[调试] 设置当前视频 ${this.currentIndex} 静音:`, this.isMuted);

					// 针对Safari的特殊处理
					if (this.isSafari) {
						try {
							const videoElement = document.getElementById(`video-${this.currentIndex}`);
							if (videoElement) {
								videoElement.muted = this.isMuted;
							}
						} catch (e) {}
					}
				}
			},
			onVideoPlay(index) {
			  console.log(`[调试] 视频 ${index} 播放事件触发`);
			  this.videoList[index].playing = true;
			  this.videoList[index].buffering = false;
			},
			
			onVideoPause(index) {
			  console.log(`[调试] 视频 ${index} 暂停事件触发`);
			  this.videoList[index].playing = false;
			},
			onVideoEnded(index) {
				// 视频结束后循环播放
				this.videoList[index].playing = false;

				// 使用安全的播放方法重新播放
				this.resetAndPlayVideo(index);
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
					this.resetAndPlayVideo(index);
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

