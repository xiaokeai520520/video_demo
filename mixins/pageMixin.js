import phUI from '@/utils/ph-ui.js';

// 页面通用混入
export default {
	data() {
		return {
			isLoading: false,
			isRefreshing: false,
			enablePullRefresh: true,
			// Tab 页面路径
			tabPages: [
				'/pages/index/index',
				'/pages/categories/categories',
				'/pages/video/short',
				'/pages/profile/profile'
			]
		}
	},
	computed: {
		currentTabIndex: {
			get() {
				return this.$store.state.currentTabIndex;
			},
			set(val) {
				this.$store.commit('setTabIndex', val);
			}
		}
	},
	methods: {
		// 初始化数据 - 需要在具体页面中实现 fetchData 方法
		async initData() {
			phUI.loading('加载中...');
			this.isLoading = true;

			try {
				// 调用页面自己的数据获取方法
				await this.fetchData();
			} catch (error) {
				console.error('加载数据失败:', error);
				phUI.toast('加载失败，请稍后重试');
			} finally {
				this.isLoading = false;
				phUI.hideLoading();
			}
		},

		// 监听滚动到顶部事件
		onScrollToUpper(e) {
			if (this.enablePullRefresh && !this.isRefreshing) {
				this.doRefresh();
			}
		},

		// 执行刷新
		doRefresh() {
			if (this.isRefreshing) return;

			phUI.loading('刷新中...');
			this.refreshData();
		},

		// 刷新数据
		async refreshData() {
			if (this.isRefreshing) return;

			this.isRefreshing = true;

			try {
				// 调用页面自己的数据获取方法
				await this.fetchData();
				phUI.toast('刷新成功');
			} catch (error) {
				console.error('刷新数据失败:', error);
				phUI.toast('刷新失败');
			} finally {
				this.isRefreshing = false;
				phUI.hideLoading();
				uni.stopPullDownRefresh();
			}
		},

		// 处理搜索
		handleSearch(keyword) {
			console.log('搜索关键词:', keyword);
			phUI.toast(`搜索: ${keyword}`);

			uni.navigateTo({
				url: `/pages/search/search?keyword=${encodeURIComponent(keyword)}`
			});
		},

		// 切换底部Tab
		switchTab(index) {
			// 设置当前索引
			if (this.$store && this.$store.commit) {
				this.$store.commit('setTabIndex', index);
			}
		},
		// 格式化数量
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