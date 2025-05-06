<template>
	<view class="ph-tabbar">
		<view v-for="(item, index) in tabItems" :key="index" class="ph-tabbar-item"
			:class="{ 'ph-tabbar-active': activeIndex === index }" @click="switchTab(index)">
			<uni-icons :type="activeIndex === index ? item.activeIcon : item.icon" size="24"
				:color="activeIndex === index ? '#FF9000' : '#FFFFFF'"></uni-icons>
			<text class="ph-tabbar-text">{{ item.text }}</text>
		</view>
	</view>
</template>
<script>
	import uniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
	export default {
		name: 'PhTabbar',
		components: {
			uniIcons
		},
		props: {
			current: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				tabItems: [{
						text: '首页',
						icon: 'home',
						activeIcon: 'home-filled',
						url: '/pages/index/index'
					},
					{
						text: '分类',
						icon: 'settings',
						activeIcon: 'settings-filled',
						url: '/pages/categories/categories'
					},
					{
						text: '短视频',
						icon: 'fire',
						activeIcon: 'fire-filled',
						url: '/pages/video/short'
					},
					{
						text: '我的',
						icon: 'person',
						activeIcon: 'person-filled',
						url: '/pages/profile/profile'
					}
				]
			}
		},
		computed: {
			// 计算属性，始终返回正确的激活索引
			activeIndex() {
				// 首先检查当前路径
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				if (page) {
					const route = page.route;
					// 查找匹配的索引
					const index = this.tabItems.findIndex(item => route.includes(item.url.substring(1)));
					if (index !== -1) {
						return index;
					}
				}
				// 回退到 props 传入的值
				return this.current;
			}
		},
		methods: {
			switchTab(index) {
			  // 避免重复点击当前选中的选项卡
			  if (this.activeIndex === index) return;
			  
			  // 只发出事件
			  this.$emit('change', index);
			  
			  // 导航到新页面 - 使用 setTimeout 避免导航冲突
			  setTimeout(() => {
			    const url = this.tabItems[index].url;
			    uni.switchTab({
			      url,
			      fail: (err) => {
			        console.error('Tab切换失败:', err);
			        // 不要尝试使用 navigateTo 导航到 tabBar 页面
			      }
			    });
			  }, 0);
			}
		}
	}
</script>
<style lang="scss">
	.ph-tabbar {
		display: flex;
		align-items: center;
		justify-content: space-around;
		height: 100rpx;
		background-color: #000000;
		border-top: 1px solid #282828;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
		
		/* #ifdef APP-PLUS */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
		
		/* #ifdef MP */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
		
		&-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 10rpx 0;
			
			&:active {
				opacity: 0.7;
			}
			
			.ph-tabbar-text {
				font-size: 24rpx;
				color: #FFFFFF;
				margin-top: 6rpx;
			}
		}
		
		&-active {
			.ph-tabbar-text {
				color: #FF9000;
			}
		}
		
	}
</style>