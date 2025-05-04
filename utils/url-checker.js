/**
 * URL检测服务
 * 用于检测多个URL的可用性，并返回第一个可用的URL
 */

// 从配置文件读取URL配置
const getUrlConfig = () => {
	return new Promise((resolve, reject) => {
		// 添加时间戳防止缓存
		const timestamp = new Date().getTime();
		const configUrl = `/static/config.json?t=${timestamp}`;

		uni.request({
			url: configUrl,
			success: (res) => {
				if (res.statusCode === 200 && res.data) {
					resolve(res.data);
				} else {
					reject(new Error('获取配置文件失败'));
				}
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
};

// 检测单个URL是否可访问
const checkUrl = (url) => {
	console.log(`检测URL: ${url}`);
	return new Promise((resolve) => {
		// 设置超时时间较短，防止长时间等待
		const timeout = 5000;

		// 构建测试URL - 使用testurl.php端点
		const testEndpoint = `${url}/testurl.php`;

		uni.request({
			url: testEndpoint,
			timeout: timeout,
			success: (res) => {
				const isAvailable = res.statusCode === 200 && res.data === 'success';
				console.log(`URL ${url} 检测结果: ${isAvailable ? '可用' : '不可用'}`);
				resolve({
					url: url,
					available: isAvailable,
					reason: !isAvailable ? '返回内容不是success' : null
				});
			},
			fail: (err) => {
				console.log(`URL ${url} 检测失败: ${err.errMsg || '请求失败'}`);
				resolve({
					url: url,
					available: false,
					reason: err.errMsg || '请求失败'
				});
			}
		});
	});
};

// 检测URL数组中的所有URL，返回第一个可用的
const findFirstAvailableUrl = async (urlArray) => {
	if (!urlArray || !urlArray.length) {
		return null;
	}

	// 使用Promise.all同时发送所有请求，然后按顺序获取第一个可用的
	const results = await Promise.all(urlArray.map(url => checkUrl(url)));
	const availableUrl = results.find(result => result.available);

	if (availableUrl) {
		console.log('找到第一个可用URL:', availableUrl.url);
		return availableUrl.url;
	} else {
		console.error('所有URL均不可用');
		return null;
	}
};

// 用于存储已初始化的URL
let baseUrlsCache = null;
let initPromise = null;

// 初始化所有URL并获取可用的基础URL
// 初始化所有URL并获取可用的基础URL
const initBaseUrls = async () => {
	// 如果已有缓存的结果，直接返回
	if (baseUrlsCache) {
		return baseUrlsCache;
	}

	// 如果已有进行中的初始化，返回该Promise
	if (initPromise) {
		return initPromise;
	}

	// 创建新的初始化Promise
	initPromise = new Promise(async (resolve, reject) => {
		try {
			// 获取配置
			const config = await getUrlConfig();
			const {
				api_url,
				video_url,
				error_url
			} = config;

			// 创建初始化结果对象
			let result = {
				apiBaseUrl: null,
				videoBaseUrl: null,
				errorBaseUrl: null
			};

			// 创建标志位，表示初始化是否已完成
			let isInitialized = false;

			// 判断是否可以完成初始化
			const tryFinishInit = () => {
				if (!isInitialized && result.apiBaseUrl && result.videoBaseUrl) {
					// 同时找到了API URL和视频URL，可以立即完成初始化
					isInitialized = true;
					console.log('找到可用的API和视频URL，立即完成初始化');
					baseUrlsCache = {
						...result
					};
					resolve(baseUrlsCache);
				}
			};

			// 并行检测所有类型的URL
			// 处理API URL
			api_url.forEach(url => {
				checkUrl(url).then(checkResult => {
					if (checkResult.available && !result.apiBaseUrl) {
						console.log('找到可用的API URL:', url);
						result.apiBaseUrl = url;
						tryFinishInit();
					}
				});
			});

			// 处理视频URL
			video_url.forEach(url => {
				checkUrl(url).then(checkResult => {
					if (checkResult.available && !result.videoBaseUrl) {
						console.log('找到可用的视频URL:', url);
						result.videoBaseUrl = url;
						tryFinishInit();
					}
				});
			});

			// 处理错误URL
			error_url.forEach(url => {
				checkUrl(url).then(checkResult => {
					if (checkResult.available && !result.errorBaseUrl) {
						console.log('找到可用的错误URL:', url);
						result.errorBaseUrl = url;
					}
				});
			});

			// 设置一个最长等待时间，防止所有URL都不可用导致无法完成初始化
			const maxWaitTime = Math.max(api_url.length, video_url.length, error_url.length) *
				5000 + 1000;

			setTimeout(() => {
				if (!isInitialized) {
					console.log('初始化等待超时，使用当前最佳结果');

					// 如果API和视频URL都不可用，且有错误URL，则报告错误
					if (!result.apiBaseUrl && !result.videoBaseUrl && result.errorBaseUrl) {
						reportAllUrlsError(result.errorBaseUrl);
						reject(new Error('所有服务地址不可用，请稍后再试'));
					} else if (!result.apiBaseUrl && !result.videoBaseUrl) {
						// 没有可用的API和视频URL
						reject(new Error('无法连接到服务器，请检查网络'));
					} else {
						// 至少有一个可用的URL，使用当前结果
						baseUrlsCache = {
							...result
						};
						resolve(baseUrlsCache);
					}
				}
			}, maxWaitTime);

		} catch (error) {
			console.error('初始化基础URL失败:', error);
			reject(error);
			initPromise = null;
		}
	});

	return initPromise;
};
// 报告所有URL不可用
const reportAllUrlsError = async (errorUrl) => {
	if (!errorUrl) return;

	try {
		// 添加时间戳防止缓存
		const timestamp = new Date().getTime();
		const reportUrl = `${errorUrl}/api/all_url_error?_t=${timestamp}`;

		await uni.request({
			url: reportUrl,
			method: 'POST',
			data: {
				client_type: uni.getSystemInfoSync().platform,
				app_version: '1.0.0', // 从应用配置获取
				device_info: uni.getSystemInfoSync(),
				timestamp: timestamp
			}
		});
	} catch (error) {
		console.error('报告URL错误失败:', error);
	}
};

// 清除URL缓存，强制重新初始化
const clearUrlCache = () => {
	baseUrlsCache = null;
};

export {
	initBaseUrls,
	findFirstAvailableUrl,
	clearUrlCache
};