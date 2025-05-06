<template>
	<view class="page-wrapper">
		<view class="page-container categories-page">
			<!-- 顶部导航栏 -->
			<ph-header @search="handleSearch"></ph-header>

			<!-- 内容区域 -->
			<scroll-view 
				scroll-y 
				class="content-scroll" 
				:refresher-enabled="false"
				@scrolltoupper="null"
			>
				<!-- 分类标题 -->
				<view class="categories-title">
					<text class="title-text">所有分类</text>
				</view>
				
				<!-- 分类列表 -->
				<view class="categories-list">
					<view 
						class="category-item" 
						v-for="(item, index) in allCategories" 
						:key="index" 
						@click="navigateToCategory(item)"
					>
						<view class="category-image-wrapper">
							<image class="category-image" :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="category-info">
							<text class="category-name">{{ item.name }}</text>
							<text class="category-count">{{ formatCount(item.videoCount) }} 个视频</text>
						</view>
					</view>
				</view>
				
				<!-- 推荐分类 -->
				<view class="recommended-section">
					<view class="section-header">
						<text class="section-title">热门推荐</text>
					</view>
					
					<scroll-view scroll-x class="recommended-scroll" :show-scrollbar="false">
						<view class="recommended-list">
							<view 
								class="recommended-item" 
								v-for="(item, index) in recommendedCategories" 
								:key="index"
								@click="navigateToCategory(item)"
							>
								<view class="recommended-image-wrapper">
									<image class="recommended-image" :src="item.image" mode="aspectFill"></image>
								</view>
								<text class="recommended-name">{{ item.name }}</text>
								<text class="recommended-count">{{ formatCount(item.videoCount) }}</text>
							</view>
						</view>
					</scroll-view>
				</view>
			</scroll-view>

			<!-- 底部导航栏 -->
			<ph-tabbar :current="currentTabIndex" @change="switchTab"></ph-tabbar>
		</view>
	</view>
</template>

<script>
	import pageMixin from '@/mixins/pageMixin.js';
	import mockData from '../index/mock/index.js';

	// 导入组件
	import PhHeader from '@/components/ph/PhHeader.vue';
	import PhTabbar from '@/components/ph/PhTabbar.vue';

	export default {
		mixins: [pageMixin],
		components: {
			PhHeader,
			PhTabbar
		},
		data() {
			return {				
				// 分类数据
				allCategories: [],
				recommendedCategories: []
			}
		},
		onLoad() {
			this.$store.commit('setTabIndex', 1);
			this.initData();
		},
		methods: {
			// 实现 fetchData 方法 (在 mixin 中被调用)
			async fetchData() {
				// 获取所有分类
				const categoriesData = await this.getCategoriesData();
				
				// 所有分类
				this.allCategories = categoriesData;
				
				// 推荐分类（取前6个）
				this.recommendedCategories = categoriesData
					.sort((a, b) => b.videoCount - a.videoCount)
					.slice(0, 6);
				
				return true;
			},
			
			// 从mock数据获取分类
			async getCategoriesData() {
				// 模拟API调用
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(mockData.getCategories());
					}, 300);
				});
			},
			
			// 导航到分类页面
			navigateToCategory(category) {
				uni.navigateTo({
					url: `/pages/category/category?id=${category.id}&name=${encodeURIComponent(category.name)}`
				});
			}
		}
	}
</script>

<style lang="scss">
	@import '@/styles/pages/categories.scss';
</style>