<template>
	<view class="container">
		<TikTokLoading :isLoading="true" text="正在连接服务器..."></TikTokLoading>
	</view>
</template>

<script>
	import TikTokLoading from '@/components/TikTokLoading.vue';
	export default {
		components: {
			TikTokLoading
		},
		data() {
			return {
				
			}
		},
		methods: {

		}
	}
</script>

<style>
</style>
