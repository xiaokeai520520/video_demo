import {
	createSSRApp
} from 'vue'
import App from './App.vue'
import './mock'
import TkLoading from '@/components/TikTokLoading.vue'
import {
	initBaseUrls
} from '@/utils/url-checker'

const globalData = {
	baseUrls: null
};

// 初始化URL（立即开始异步加载）
initBaseUrls().then(urls => {
	globalData.baseUrls = urls;
	console.log('URL初始化成功:', urls);
}).catch(error => {
	console.error('URL初始化失败:', error);
	// 设置默认值或显示错误
	globalData.baseUrls = null;
});

export function createApp() {
	const app = createSSRApp(App);

	// 注册全局组件
	app.component('TkLoading', TkLoading);

	// 将baseUrls添加为全局属性
	app.config.globalProperties.$baseUrls = globalData.baseUrls;

	// 添加自定义的模态框服务
	app.config.globalProperties.$modal = {
		show(options) {
			uni.showModal(options);
		}
	};

	return {
		app,
		globalData // 导出全局数据，可通过getApp().globalData访问
	}
}