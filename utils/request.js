import {
	initBaseUrls
} from './url-checker';

// 全局保存基础URL
let BASE_URLS = {
	apiBaseUrl: '',
	videoBaseUrl: '',
	errorBaseUrl: ''
};
let isInitialized = false;
let initPromise = null;

// 请求超时时间
const TIMEOUT = 60000; // 默认60秒

// 初始化请求服务
const initRequestService = async () => {
	if (isInitialized && BASE_URLS.apiBaseUrl) {
		return BASE_URLS;
	}

	if (initPromise) {
		return initPromise;
	}

	// 创建初始化Promise
	initPromise = new Promise(async (resolve, reject) => {
		try {
			// 检测并获取可用的URL
			const urls = await initBaseUrls();

			// 保存基础URL
			BASE_URLS = urls;
			isInitialized = true;

			resolve(BASE_URLS);
		} catch (error) {
			// 初始化失败
			console.error('初始化请求服务失败:', error);
			reject(error);
		} finally {
			// 重置Promise
			initPromise = null;
		}
	});

	return initPromise;
};

// 请求拦截器
const requestInterceptor = (config) => {
	// 在这里添加请求头、token等
	const token = uni.getStorageSync('token');
	if (token) {
		config.header = {
			...config.header,
			'Authorization': `Bearer ${token}`
		};
	}

	// 可以在这里添加其他通用请求头
	config.header = {
		...config.header,
		'Content-Type': 'application/json',
		'X-Client-Type': 'app'
	};

	return config;
};

// 响应拦截器
const responseInterceptor = (response) => {
	// 这里可以统一处理响应
	if (response.statusCode === 200) {
		// 可以在这里统一处理接口返回的数据格式
		// 假设后端返回格式为 { code: 0, data: {}, message: 'success' }
		const {
			data
		} = response;

		if (data.code === 0) {
			return data.data; // 直接返回业务数据
		} else {
			// 处理业务错误
			showError(data.message || '请求失败');
			return Promise.reject(data);
		}
	} else if (response.statusCode === 401) {
		// 处理未授权，通常是token过期
		uni.removeStorageSync('token');
		uni.showModal({
			title: '提示',
			content: '登录状态已过期，请重新登录',
			showCancel: false,
			success: () => {
				// 跳转到登录页
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
		});
		return Promise.reject(response);
	} else {
		// 处理HTTP错误
		showError(`网络错误(${response.statusCode})`);
		return Promise.reject(response);
	}
};

// 错误处理
const showError = (message) => {
	uni.showToast({
		title: message,
		icon: 'none',
		duration: 2000
	});
};

// 创建通用请求方法
const createRequest = (useVideoUrl = false) => async (options) => {
	// 确保BASE_URL已初始化
	if (!isInitialized || (!BASE_URLS.apiBaseUrl && !useVideoUrl) || (!BASE_URLS.videoBaseUrl && useVideoUrl)) {
		try {
			await initRequestService();
		} catch (error) {
			return Promise.reject(error);
		}
	}

	// 检查对应的URL是否可用
	const baseUrl = useVideoUrl ? BASE_URLS.videoBaseUrl : BASE_URLS.apiBaseUrl;
	if (!baseUrl) {
		const errorMsg = useVideoUrl ? '视频服务不可用，请稍后再试' : '网络连接失败，请检查网络设置';
		showError(errorMsg);
		return Promise.reject(new Error(useVideoUrl ? '视频服务不可用' : 'API服务不可用'));
	}

	// 合并选项，设置完整URL
	const config = {
		...options,
		url: options.url.startsWith('http') ? options.url : baseUrl + options.url,
		timeout: options.timeout || TIMEOUT
	};

	// 应用请求拦截器
	const interceptedConfig = requestInterceptor(config);

	// 返回Promise
	return new Promise((resolve, reject) => {
		uni.request({
			...interceptedConfig,
			success: (res) => {
				try {
					// 应用响应拦截器
					const result = responseInterceptor(res);
					resolve(result);
				} catch (error) {
					reject(error);
				}
			},
			fail: (err) => {
				showError(useVideoUrl ? '视频服务连接失败' : '网络连接失败');
				reject(err);
			}
		});
	});
};

// 标准请求和视频请求
const request = createRequest(false);
const videoRequest = createRequest(true);

// 创建HTTP方法别名
const http = {
	// 初始化方法，可以在应用启动时调用
	init: initRequestService,

	// 获取基础URL，可用于直接构建资源URL
	getBaseUrls: () => BASE_URLS,

	// 标准API请求
	get: (url, data, options = {}) => {
		return request({
			url,
			data,
			method: 'GET',
			...options
		});
	},
	post: (url, data, options = {}) => {
		return request({
			url,
			data,
			method: 'POST',
			...options
		});
	},
	put: (url, data, options = {}) => {
		return request({
			url,
			data,
			method: 'PUT',
			...options
		});
	},
	delete: (url, data, options = {}) => {
		return request({
			url,
			data,
			method: 'DELETE',
			...options
		});
	},

	// 视频服务请求
	video: {
		get: (url, data, options = {}) => {
			return videoRequest({
				url,
				data,
				method: 'GET',
				...options
			});
		},
		post: (url, data, options = {}) => {
			return videoRequest({
				url,
				data,
				method: 'POST',
				...options
			});
		}
	}
};

export default http;