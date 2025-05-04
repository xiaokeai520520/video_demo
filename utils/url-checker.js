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
	return new Promise((resolve) => {
		// 设置超时时间较短，防止长时间等待
		const timeout = 5000;
		const startTime = Date.now();

		// 添加时间戳防止缓存
		const timestamp = new Date().getTime();
		const testUrl = url.includes('?') ?
			`${url}&_t=${timestamp}` :
			`${url}?_t=${timestamp}`;

		uni.request({
			url: testUrl,
			timeout: timeout,
			success: () => {
				// 成功访问，记录耗时
				const responseTime = Date.now() - startTime;
				resolve({
					url, // 返回原始URL，不包含时间戳
					available: true,
					responseTime
				});
			},
			fail: () => {
				resolve({
					url, // 返回原始URL，不包含时间戳
					available: false,
					responseTime: timeout
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

	// 同时检测所有URL
	const checkPromises = urlArray.map(url => checkUrl(url));

	// 使用Promise.race获取第一个成功的结果
	try {
		// 等待所有检测完成
		const results = await Promise.all(checkPromises);

		// 过滤出可用的URL并按响应时间排序
		const availableUrls = results
			.filter(result => result.available)
			.sort((a, b) => a.responseTime - b.responseTime);

		// 返回响应最快的URL
		return availableUrls.length > 0 ? availableUrls[0].url : null;
	} catch (error) {
		console.error('检测URL出错:', error);
		return null;
	}
};

// 初始化所有URL并获取可用的基础URL
const initBaseUrls = async () => {
	try {
		// 获取配置
		const config = await getUrlConfig();
		const {
			api_url,
			video_url,
			error_url
		} = config;

		// 检测API URL
		const availableApiUrl = await findFirstAvailableUrl(api_url);

		// 检测视频 URL
		const availableVideoUrl = await findFirstAvailableUrl(video_url);

		// 如果API和视频URL都不可用，使用错误URL
		if (!availableApiUrl && !availableVideoUrl) {
			const availableErrorUrl = await findFirstAvailableUrl(error_url);

			if (availableErrorUrl) {
				// 报告所有URL不可用
				await reportAllUrlsError(availableErrorUrl);
			}

			throw new Error('所有服务地址不可用，请稍后再试');
		}

		return {
			apiBaseUrl: availableApiUrl,
			videoBaseUrl: availableVideoUrl,
			errorBaseUrl: availableErrorUrl
		};
	} catch (error) {
		console.error('初始化基础URL失败:', error);
		throw error;
	}
};

// 报告所有URL不可用
const reportAllUrlsError = async (errorUrl) => {
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

export {
	initBaseUrls,
	findFirstAvailableUrl
};