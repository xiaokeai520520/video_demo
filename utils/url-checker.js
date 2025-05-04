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
		
		// 构建测试URL - 使用testurl.php端点
		const testEndpoint = `${url}/testurl.php`;

		uni.request({
			url: testEndpoint,
			timeout: timeout,
			success: (res) => {
				// 判断返回内容是否为"success"
				if (res.statusCode === 200 && res.data === 'success') {
					resolve({
						url: url, // 返回原始URL
						available: true
					});
				} else {
					resolve({
						url: url,
						available: false,
						reason: '返回内容不是success'
					});
				}
			},
			fail: (err) => {
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
    
    // 使用Promise.race来获取第一个成功的结果
    try {
        // 创建一个可以单独处理每个URL检测结果的函数
        const checkUrlAndReturn = async (url) => {
            const result = await checkUrl(url);
            // 如果URL可用，直接返回
            if (result.available) {
                return result.url;
            }
            // 如果不可用，抛出错误以便继续检查下一个
            throw new Error(`URL ${url} 不可用: ${result.reason}`);
        };
        
        // 使用Promise.any获取第一个成功的结果
        // 如果浏览器不支持Promise.any，可以改用Promise.race和一些额外处理
        try {
            // 尝试使用Promise.any (较新的浏览器支持)
            return await Promise.any(urlArray.map(url => checkUrlAndReturn(url)));
        } catch {
            // 回退方案：手动实现类似Promise.any的功能
            let lastError = null;
            for (const url of urlArray) {
                try {
                    const result = await checkUrl(url);
                    if (result.available) {
                        console.log('找到第一个可用URL:', url);
                        return url;
                    }
                    lastError = `URL ${url} 不可用: ${result.reason}`;
                } catch (err) {
                    lastError = err;
                }
            }
            // 所有URL都不可用
            console.error('所有URL均不可用，最后错误:', lastError);
            return null;
        }
    } catch (error) {
        console.error('URL检测过程出错:', error);
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
		console.log('可用的API URL:', availableApiUrl);

		// 检测视频 URL
		const availableVideoUrl = await findFirstAvailableUrl(video_url);
		console.log('可用的视频 URL:', availableVideoUrl);

		// 检测错误报告 URL
		const availableErrorUrl = await findFirstAvailableUrl(error_url);
		console.log('可用的错误报告 URL:', availableErrorUrl);

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