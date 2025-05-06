import Mock from 'mockjs';

// 设置延迟
Mock.setup({
	timeout: '200-600'
});

// 随机生成轮播图数据
const getBanners = () => {
	return Mock.mock({
		'list|4-6': [{
			'id|+1': 1,
			'title': '@ctitle(5, 20)',
			'image': '@image(750x400, @color, @natural)',
			'duration|60-1800': 1,
			'views|1000-9999999': 1,
			'tag|1': ['精选', '热门', 'VIP', '独家', '新片'],
			'url': '@url'
		}]
	}).list;
};

// 随机生成分类数据
// 使用数组随机选择颜色和文字
const getCategories = () => {
	const Random = Mock.Random;
	const count = Random.integer(10, 12);
	const result = [];
	
	for (let i = 0; i < count; i++) {
		result.push({
			id: i + 1,
			name: Random.word(4, 8),
			image: Random.image('300x300', Random.color(), Random.word(1)),
			videoCount: Random.integer(100, 9999)
		});
	}
	
	return result;
};

// 随机生成视频数据，根据不同类型生成不同特点的数据
const getVideos = (type = 'recommended', page = 1, pageSize = 10) => {
	// 不同类型的视频有不同的特点
	const config = {
		hot: {
			// 热门视频具有较高的观看量和点赞数
			'views|500000-10000000': 1,
			'likes|10000-500000': 1,
			'isPremium|5-1': false // 每6个中有1个是会员视频
		},
		new: {
			// 新上传视频有较低的观看量
			'views|1000-50000': 1,
			'likes|100-3000': 1,
			'isPremium|5-1': false
		},
		long: {
			// 较长的视频
			'duration|1800-7200': 1,
			'views|50000-2000000': 1,
			'likes|5000-100000': 1,
			'isPremium|3-1': false // 每4个中有1个是会员视频
		},
		recommended: {
			// 推荐视频
			'views|100000-5000000': 1,
			'likes|5000-200000': 1,
			'isPremium|8-1': false
		}
	};
	
	// 使用对应类型的配置，如果没有则使用默认的推荐配置
	const typeConfig = config[type] || config.recommended;
	
	// 生成当前页的视频数据
	return Mock.mock({
		[`list|${pageSize}`]: [{
			'id|+1': (page - 1) * pageSize + 1,
			'title': '@ctitle(10, 30)',
			'thumbnail': '@image(600x400, @color, @natural)',
			'duration|180-3600': 1, // 默认3分钟到1小时
			'channelName': '@name',
			'channelAvatar': '@image(100x100, @color, @first)',
			'uploadTime': '@datetime("yyyy-MM-dd")',
			...typeConfig
		}]
	}).list;
};

export default {
	getBanners,
	getCategories,
	getVideos
};