<template>
	<!-- #ifndef MP -->
	<cover-view class="video-content-box">
		<slot />
	</cover-view>
	<!-- #endif -->

	<!-- #ifdef MP -->
	<view class="video-content-box">
		<slot />
	</view>
	<!-- #endif -->
</template>

<script>
	export default {
		name:"ComCoverView",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.video-content-box {
		color: #fff;
		flex: 1;
		/* #ifndef APP-PLUS-NVUE */
		height: 100%;
		/* #endif*/
		// flex-direction: row;

	}
</style>
