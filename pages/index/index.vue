<template>
	<view class="ph-container">
		<!-- 顶部导航栏 -->
		<view class="ph-header">
			<view class="ph-menu-btn" @click="toggleSidebar">
				<view class="ph-menu-line"></view>
				<view class="ph-menu-line"></view>
				<view class="ph-menu-line"></view>
			</view>
			<view class="ph-logo">
				<text class="ph-logo-text">Porn</text>
				<text class="ph-logo-highlight">hub</text>
			</view>
			<view class="ph-header-right">
				<view class="ph-icon ph-search-icon">
					<text class="ph-icon-text">🔍</text>
				</view>
			</view>
		</view>

		<!-- 侧边菜单 -->
		<view class="ph-sidebar" :class="{ 'active': sidebarOpen }">
			<view class="ph-sidebar-header">
				<view class="ph-sidebar-logo">
					<text class="ph-logo-text">Porn</text>
					<text class="ph-logo-highlight">hub</text>
				</view>
				<view class="ph-close-btn" @click="toggleSidebar">
					<text class="ph-close-icon">✕</text>
				</view>
			</view>

			<view class="ph-sidebar-menu">
				<view class="ph-menu-item">
					<view class="ph-menu-icon">🎬</view>
					<view class="ph-menu-text">精选色情片</view>
				</view>

				<view class="ph-menu-item">
					<view class="ph-menu-icon">🔥</view>
					<view class="ph-menu-text">美国 中最热</view>
					<view class="ph-menu-flag">🇺🇸</view>
				</view>
				<view class="ph-menu-category">
					<view class="ph-menu-item" @click="toggleCategory('hotCategory')">
						<view class="ph-menu-icon">🎬</view>
						<view class="ph-menu-text">热门类别</view>
						<view class="ph-menu-arrow" :class="{ 'rotated': categoryOpen.hotCategory }">▼</view>
					</view>

					<!-- 子菜单内容 - 可折叠部分 -->
					<view class="ph-submenu" :class="{ 'open': categoryOpen.hotCategory }">
						<view class="ph-submenu-item">
							<view class="ph-submenu-icon">📹</view>
							<view class="ph-submenu-text">青少年</view>
						</view>
						<view class="ph-submenu-item">
							<view class="ph-submenu-icon">📹</view>
							<view class="ph-submenu-text">辣妈</view>
						</view>
						<view class="ph-submenu-item">
							<view class="ph-submenu-icon">📹</view>
							<view class="ph-submenu-text">女性之选</view>
						</view>
						<view class="ph-all-categories" @click="viewAllCategories">
							<text>所有分类</text>
						</view>
						<!-- 更多分类... -->
					</view>
				</view>
			</view>
		</view>

		<!-- 遮罩层 - 当侧边栏打开时显示 -->
		<view class="ph-overlay" :class="{ 'active': sidebarOpen }" @click="closeSidebar"></view>

		<!-- 滚动内容区域 -->
		<scroll-view scroll-y="true" class="ph-content" show-scrollbar="false" enable-back-to-top="true"
			refresher-enabled="false" bounces="true">
			<!-- 横幅广告 -->
			<view class="ph-banner">
				<image src="https://placehold.co/800x100/333/ffffff?text=Banner" mode="aspectFill"></image>
			</view>

			<!-- 推荐视频标题 -->
			<view class="ph-section-header">
				<view class="ph-section-title">热门推荐</view>
				<view class="ph-section-more">更多 ></view>
			</view>

			<!-- 视频网格 -->
			<view class="ph-video-grid">
				<view class="ph-video-item" v-for="(item, index) in hotVideos" :key="index">
					<view class="ph-video-cover">
						<image :src="`https://placehold.co/400x225/333/ffffff?text=Video+${index+1}`" mode="aspectFill">
						</image>
						<view class="ph-video-duration">{{ item.duration }}</view>
						<view class="ph-video-hd" v-if="item.hd">HD</view>
					</view>
					<view class="ph-video-info">
						<view class="ph-video-title">{{ item.title }}</view>
						<view class="ph-video-meta">
							<text class="ph-video-views">{{ item.views }}次观看</text>
							<text class="ph-video-rating">
								<text class="ph-rating-percent">{{ item.rating }}%</text>
							</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 最新视频标题 -->
			<view class="ph-section-header">
				<view class="ph-section-title">最新上传</view>
				<view class="ph-section-more">更多 ></view>
			</view>

			<!-- 最新视频网格 -->
			<view class="ph-video-grid">
				<view class="ph-video-item" v-for="(item, index) in newVideos" :key="index">
					<view class="ph-video-cover">
						<image :src="`https://placehold.co/400x225/333/ffffff?text=New+${index+1}`" mode="aspectFill">
						</image>
						<view class="ph-video-duration">{{ item.duration }}</view>
						<view class="ph-video-hd" v-if="item.hd">HD</view>
					</view>
					<view class="ph-video-info">
						<view class="ph-video-title">{{ item.title }}</view>
						<view class="ph-video-meta">
							<text class="ph-video-views">{{ item.views }}次观看</text>
							<text class="ph-video-rating">
								<text class="ph-rating-percent">{{ item.rating }}%</text>
							</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 热门分类 -->
			<view class="ph-section-header">
				<view class="ph-section-title">热门分类</view>
				<view class="ph-section-more">全部 ></view>
			</view>

			<!-- 分类网格 -->
			<view class="ph-category-grid">
				<view class="ph-category-card" v-for="(item, index) in categories" :key="index">
					<image :src="`https://placehold.co/200x120/333/ffffff?text=Category+${index+1}`" mode="aspectFill">
					</image>
					<view class="ph-category-name">{{ item.name }}</view>
				</view>
			</view>

			<!-- 热门模特 -->
			<!-- <view class="ph-section-header">
				<view class="ph-section-title">推荐频道</view>
				<view class="ph-section-more">更多 ></view>
			</view> -->

			<!-- 模特列表 -->
			<!-- <view class="ph-model-list">
				<view class="ph-model-item" v-for="(item, index) in models" :key="index">
					<view class="ph-model-avatar">
						<image :src="`https://placehold.co/100x100/333/ffffff?text=Channel+${index+1}`"
							mode="aspectFill"></image>
					</view>
					<view class="ph-model-info">
						<view class="ph-model-name">{{ item.name }}</view>
						<view class="ph-model-videos">{{ item.videos }}个视频</view>
					</view>
					<view class="ph-model-subscribe">
						<text>订阅</text>
					</view>
				</view>
			</view> -->

			<!-- 底部区域 -->
			<view class="ph-footer">
				<view class="ph-footer-links">
					<text class="ph-footer-link">关于</text>
					<text class="ph-footer-link">条款</text>
					<text class="ph-footer-link">隐私</text>
					<text class="ph-footer-link">DMCA</text>
					<text class="ph-footer-link">联系我们</text>
				</view>
				<view class="ph-footer-copyright">
					<text>© 2025 视频站点演示</text>
				</view>
			</view>
		</scroll-view>

		<!-- 底部导航栏 -->
		<view class="ph-bottom-nav">
			<view class="ph-nav-item active">
				<view class="ph-nav-icon">🏠</view>
				<view class="ph-nav-text">首页</view>
			</view>
			<view class="ph-nav-item">
				<view class="ph-nav-icon">🔥</view>
				<view class="ph-nav-text">热门</view>
			</view>
			<view class="ph-nav-item">
				<view class="ph-nav-icon">📂</view>
				<view class="ph-nav-text">分类</view>
			</view>
			<view class="ph-nav-item">
				<view class="ph-nav-icon">👤</view>
				<view class="ph-nav-text">账户</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';

	// 侧边栏状态
	const sidebarOpen = ref(false);

	// 新增：分类菜单展开/折叠状态
	const categoryOpen = ref({
		hotCategory: false,
		// 您可以添加更多分类
	});

	// 切换侧边栏
	const toggleSidebar = () => {
		sidebarOpen.value = !sidebarOpen.value;
	};

	// 关闭侧边栏
	const closeSidebar = () => {
		sidebarOpen.value = false;
	};

	// 新增：切换分类折叠/展开
	const toggleCategory = (category) => {
		categoryOpen.value[category] = !categoryOpen.value[category];
	};

	// 热门视频数据
	const hotVideos = ref([{
			title: '热门视频标题1非常长所以需要省略号来处理',
			duration: '12:34',
			views: '125.6万',
			rating: 95,
			hd: true
		},
		{
			title: '热门视频标题2',
			duration: '8:42',
			views: '89.2万',
			rating: 87,
			hd: true
		},
		{
			title: '热门视频标题3',
			duration: '15:21',
			views: '56.4万',
			rating: 92,
			hd: false
		},
		{
			title: '热门视频标题4',
			duration: '10:05',
			views: '42.8万',
			rating: 83,
			hd: true
		},
		{
			title: '热门视频标题5',
			duration: '22:18',
			views: '38.1万',
			rating: 90,
			hd: true
		},
		{
			title: '热门视频标题6',
			duration: '7:55',
			views: '27.5万',
			rating: 85,
			hd: false
		}
	]);

	// 最新视频数据
	const newVideos = ref([{
			title: '最新视频标题1',
			duration: '10:28',
			views: '35.2万',
			rating: 89,
			hd: true
		},
		{
			title: '最新视频标题2',
			duration: '14:07',
			views: '21.8万',
			rating: 91,
			hd: true
		},
		{
			title: '最新视频标题3',
			duration: '9:36',
			views: '18.5万',
			rating: 82,
			hd: false
		},
		{
			title: '最新视频标题4',
			duration: '11:52',
			views: '14.7万',
			rating: 88,
			hd: true
		},
		{
			title: '最新视频标题5',
			duration: '17:44',
			views: '13.2万',
			rating: 86,
			hd: true
		},
		{
			title: '最新视频标题6',
			duration: '8:19',
			views: '10.9万',
			rating: 79,
			hd: false
		}
	]);

	// 热门分类数据
	const categories = ref([{
			name: '分类1'
		},
		{
			name: '分类2'
		},
		{
			name: '分类3'
		},
		{
			name: '分类4'
		},
		{
			name: '分类5'
		},
		{
			name: '分类6'
		},
		{
			name: '分类7'
		},
		{
			name: '分类8'
		}
	]);

	// 热门模特数据
	const models = ref([{
			name: '频道名称1',
			videos: '215'
		},
		{
			name: '频道名称2',
			videos: '186'
		},
		{
			name: '频道名称3',
			videos: '147'
		},
		{
			name: '频道名称4',
			videos: '132'
		}
	]);
</script>