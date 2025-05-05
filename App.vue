<script>
	import phUI from '@/utils/ph-ui.js';
	export default {
		onLaunch: function() {
			phUI.overrideUniMethods();
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	@import '@/styles/pornhub-theme.css';
	@import '@/styles/layout/page-layout.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	/* #endif */
</style>
