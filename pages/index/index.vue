<template>
	<!-- 搜索栏 -->
	<view>
		<uni-search-bar placeholder="自定义背景色" bgColor="#EEEEEE" @confirm="search" />
	</view>
	<!-- 轮播图 -->
	<view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item   v-for="(item,index) in swiper_list" :key="item.id" >
				 <image mode="scaleToFill" :src="item.url" style="width: 100%;height: 100%;"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'

let title = ref("Hello")
let swiper_list = ref([
	{
		id: 0,
		type: 'image',
		url: '/static/111.png'
	}, {
		id: 1,
		type: 'image',
		url: '/static/222.png',
	}, {
		id: 2,
		type: 'image',
		url: '/static/333.png'
	}, {
		id: 3,
		type: 'image',
		url: '/static/444.png'
	}, {
		id: 4,
		type: 'image',
		url: '/static/555.png'
	}, {
		id: 5,
		type: 'image',
		url: '/static/666.png'
	}, {
		id: 6,
		type: 'image',
		url: '/static/777.png'
	}, {
		id: 7,
		type: 'image',
		url: '/static/888.png'
	},
	// {
	// 	id: 8,
	// 	type: 'video',
	// 	url: 'https://vjs.zencdn.net/v/oceans.mp4'  //在线视频链接
	// },
])

// onMounted生命周期
onMounted(() => {
	
	
})

function search(){
	
}

</script>

<style scoped>
	
</style>
