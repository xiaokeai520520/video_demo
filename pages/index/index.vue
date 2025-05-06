<template>
	<view class="page-wrapper">
		<view class="page-container index-page">
			<!-- 顶部导航栏 -->
			<ph-header @search="handleSearch"></ph-header>

			<!-- 内容区域 -->
			<scroll-view 
				scroll-y 
				class="content-scroll" 
				:refresher-enabled="false"
				@scrolltoupper="onScrollToUpper"
			>
				<!-- 轮播图 -->
				<ph-banner :banners="bannerData"></ph-banner>

				<!-- 推荐视频区域 -->
				<ph-section title="热门推荐" icon="fire" :videos="hotVideos"></ph-section>

				<!-- 加载更多 -->
				<view v-if="hotVideos.length > 0" class="load-more" @click="loadMore">
					<text v-if="!isLoadingMore" class="load-more-text">加载更多</text>
					<uni-icons v-if="isLoadingMore" type="spinner-cycle" size="20" color="#FF9000"></uni-icons>
				</view>
			</scroll-view>

			<!-- 底部导航栏 -->
			<ph-tabbar :current="currentTabIndex" @change="switchTab"></ph-tabbar>
		</view>
	</view>
</template>

<script>
	import pageMixin from '@/mixins/pageMixin.js';
	import http from '@/utils/request.js';
	import mockData from './mock/index.js';

	// 导入组件
	import PhHeader from '@/components/ph/PhHeader.vue';
	import PhBanner from '@/components/ph/PhBanner.vue';
	import PhSection from '@/components/ph/PhSection.vue';
	import PhTabbar from '@/components/ph/PhTabbar.vue';

	export default {
		mixins: [pageMixin],
		components: {
			PhHeader,
			PhBanner,
			PhSection,
			PhTabbar
		},
		data() {
			return {
				isLoadingMore: false,
				pageIndex: 1,
				pageSize: 10,

				// 数据
				bannerData: [],
				hotVideos: []
			}
		},
		onLoad() {
			this.$store.commit('setTabIndex', 0);
			this.initData();
		},
		onReachBottom() {
			this.loadMore();
		},
		methods: {
			// 实现 fetchData 方法 (在 mixin 中被调用)
			async fetchData() {
				// 获取轮播图数据
				this.bannerData = await this.fetchBanners();
				
				// 获取推荐视频
				this.hotVideos = await this.fetchVideoList('hot', 1);
				
				return true;
			},
			
			// 加载更多
			async loadMore() {
				if (this.isLoadingMore) return;

				this.isLoadingMore = true;
				this.pageIndex++;

				try {
					// 模拟加载更多数据
					const moreHotVideos = await this.fetchVideoList('hot', this.pageIndex);
					this.hotVideos = [...this.hotVideos, ...moreHotVideos];
				} catch (error) {
					console.error('加载更多失败:', error);
					// 恢复页码
					this.pageIndex--;
				} finally {
					this.isLoadingMore = false;
				}
			},

			// 获取轮播图数据
			async fetchBanners() {
				// 模拟API调用
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(mockData.getBanners());
					}, 300);
				});
			},

			// 获取视频列表
			async fetchVideoList(type, page = 1) {
				// 模拟API调用
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(mockData.getVideos(type, page, this.pageSize));
					}, 400);
				});
			}
		}
	}
</script>

<style>
	@import '@/styles/pages/index.scss';
</style>