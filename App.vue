<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style>
	/* 导入首页样式 */
	@import './static/css/index.css';
	/* 导入视频页面样式 */
	@import './static/css/video.css';

	/* 基础样式 */
	page {
		background-color: #000000;
		color: #ffffff;
		font-family: Arial, sans-serif;
	}

	/* 隐藏滚动条 */
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}
</style>