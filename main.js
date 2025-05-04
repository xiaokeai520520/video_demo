import {
	createSSRApp
} from 'vue'
import App from './App.vue'
import './mock'
import http from '@/utils/request'

const globalData = {
	baseUrls: null,
	initializing: true // 添加初始化状态
};

export function createApp() {
	const app = createSSRApp(App);

	// 将http服务和globalData挂载到全局
	app.config.globalProperties.$http = http;
	app.config.globalProperties.$globalData = globalData;

	// 添加自定义的模态框服务
	app.config.globalProperties.$modal = {
		show(options) {
			uni.showModal(options);
		}
	};

	// 初始化HTTP服务 (只调用一次)
	http.init().then(urls => {
		globalData.baseUrls = urls;
		globalData.initializing = false; // 正确更新全局状态
		console.log('URL初始化成功:', urls);
	}).catch(error => {
		console.error('URL初始化失败:', error);
		globalData.initializing = false; // 正确更新全局状态
		uni.showToast({
			title: '无法连接到服务器，请检查网络',
			icon: 'none',
			duration: 3000
		});
	});

	return {
		app,
		globalData
	}
}