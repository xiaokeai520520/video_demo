// 简化版的模拟数据，避免 Mock.js 递归调用栈溢出

// 轮播图数据
const getBanners = () => {
	return [
		{
			id: 1,
			title: '年度最热视频合集',
			image: 'https://via.placeholder.com/750x400/FF9000/000000?text=Hot+Videos',
			duration: 1200,
			views: 8457921,
			tag: '热门',
		},
		{
			id: 2,
			title: '独家访谈精彩内容',
			image: 'https://via.placeholder.com/750x400/000000/FF9000?text=Exclusive',
			duration: 900,
			views: 3245678,
			tag: '独家',
		},
		{
			id: 3,
			title: '本周最多观看视频',
			image: 'https://via.placeholder.com/750x400/333333/FFFFFF?text=Most+Viewed',
			duration: 1500,
			views: 6784523,
			tag: 'VIP',
		},
		{
			id: 4,
			title: '新人推荐视频',
			image: 'https://via.placeholder.com/750x400/000000/FFFFFF?text=New+Talent',
			duration: 1800,
			views: 2354879,
			tag: '新片',
		}
	];
};

// 分类数据
const getCategories = () => {
	return [
		{
			id: 1,
			name: 'Amateur',
			image: 'https://via.placeholder.com/300x300/FF9000/000000?text=Amateur',
			videoCount: 8432
		},
		{
			id: 2,
			name: 'Asian',
			image: 'https://via.placeholder.com/300x300/FF9000/000000?text=Asian',
			videoCount: 9654
		},
		{
			id: 3,
			name: 'Blonde',
			image: 'https://via.placeholder.com/300x300/FF9000/000000?text=Blonde',
			videoCount: 5678
		},
		{
			id: 4,
			name: 'Ebony',
			image: 'https://via.placeholder.com/300x300/FF9000/000000?text=Ebony',
			videoCount: 7842
		},
		{
			id: 5,
			name: 'Latina',
			image: 'https://via.placeholder.com/300x300/FF9000/000000?text=Latina',
			videoCount: 6523
		},
		{
			id: 6,
			name: 'Popular',
			image: 'https://via.placeholder.com/300x300/FF9000/000000?text=Popular',
			videoCount: 9876
		},
		{
			id: 7,
			name: 'Teen',
			image: 'https://via.placeholder.com/300x300/FF9000/000000?text=Teen',
			videoCount: 8765
		},
		{
			id: 8,
			name: 'MILF',
			image: 'https://via.placeholder.com/300x300/FF9000/000000?text=MILF',
			videoCount: 7654
		},
		{
			id: 9,
			name: 'Verified',
			image: 'https://via.placeholder.com/300x300/FF9000/000000?text=Verified',
			videoCount: 5432
		},
		{
			id: 10,
			name: 'HD',
			image: 'https://via.placeholder.com/300x300/FF9000/000000?text=HD',
			videoCount: 8765
		}
	];
};

// 生成视频数据的辅助函数
const generateVideo = (id, type) => {
	// 基础视频数据
	const baseVideo = {
		id,
		title: `示例视频标题 #${id} - ${type}`,
		thumbnail: `https://via.placeholder.com/600x400/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=Video+${id}`,
		channelName: `Channel ${id % 10 + 1}`,
		channelAvatar: `https://via.placeholder.com/100x100/FF9000/000000?text=${id % 10 + 1}`,
		uploadTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
		isPremium: id % 6 === 0
	};
	
	// 根据类型设置不同的观看数、点赞数和时长
	switch(type) {
		case 'hot':
			return {
				...baseVideo,
				views: 500000 + Math.floor(Math.random() * 9500000),
				likes: 10000 + Math.floor(Math.random() * 490000),
				duration: 180 + Math.floor(Math.random() * 1620)
			};
		case 'new':
			return {
				...baseVideo,
				views: 1000 + Math.floor(Math.random() * 49000),
				likes: 100 + Math.floor(Math.random() * 2900),
				duration: 180 + Math.floor(Math.random() * 1620)
			};
		case 'long':
			return {
				...baseVideo,
				views: 50000 + Math.floor(Math.random() * 1950000),
				likes: 5000 + Math.floor(Math.random() * 95000),
				duration: 1800 + Math.floor(Math.random() * 5400)
			};
		default: // recommended 和其他类型
			return {
				...baseVideo,
				views: 100000 + Math.floor(Math.random() * 4900000),
				likes: 5000 + Math.floor(Math.random() * 195000),
				duration: 180 + Math.floor(Math.random() * 3420)
			};
	}
};

// 获取视频列表
const getVideos = (type = 'recommended', page = 1, pageSize = 10) => {
	const videos = [];
	
	// 生成指定数量的视频
	for (let i = 0; i < pageSize; i++) {
		const videoId = (page - 1) * pageSize + i + 1;
		videos.push(generateVideo(videoId, type));
	}
	
	return videos;
};

export default {
	getBanners,
	getCategories,
	getVideos
};