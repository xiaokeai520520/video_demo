import {
	createSSRApp
} from 'vue'
import App from './App.vue'
import './mock' // 引入mock数据
import TkLoading from '@/components/TikTokLoading.vue'
import PornModal from '@/components/PornModal.vue'

// 创建全局 Modal 服务
const modalService = {
	_instance: null,

	// 初始化Modal实例(在App加载后调用)
	init(instance) {
		this._instance = instance;
	},

	// 显示弹窗方法
	show(options) {
		if (this._instance) {
			this._instance.open(options);
		} else {
			// 回退到系统弹窗
			uni.showModal(options);
		}
	}
};

// 创建全局 Loading 服务
const loadingService = {
	_instance: null,

	// 初始化Loading实例
	init(instance) {
		this._instance = instance;
	},

	// 显示加载
	show(text = '加载中...') {
		if (this._instance) {
			this._instance.isLoading = true;
			this._instance.text = text;
		}
	},

	// 隐藏加载
	hide() {
		if (this._instance) {
			this._instance.isLoading = false;
		}
	}
};

export function createApp() {
	const app = createSSRApp(App)

	// 注册全局组件
	app.component('TkLoading', TkLoading)
	app.component('PornModal', PornModal)

	// 添加全局属性
	app.config.globalProperties.$modal = modalService
	app.config.globalProperties.$loading = loadingService

	return {
		app
	}
}