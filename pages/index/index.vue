<template>
	<!-- 搜索栏 -->
	<view style="background-color: #FFC125;">
		<uni-search-bar placeholder="请输入搜索关键词" @confirm="search" />
	</view>
	<!-- 轮播图 -->
	<view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" style="height: 225px;">
			<swiper-item   v-for="(item,index) in swiper_list" :key="item.id" >
				<image mode="scaleToFill" :src="item.url" style="width: 100%;height: 100%;" v-if="item.type == 'image'" ></image>
				<video :src="item.url" style="width: 100%;height: 100%;" v-if="item.type == 'video'"></video>
			</swiper-item>
		</swiper>
	</view>
	<!-- 公告 -->
	<view>
		<uni-notice-bar :speed="50" show-icon scrollable text="公告：微信小程序正在重构中。敬请期待！！！！" />
	</view>
	<!-- 学习手册 -->
	<view style="border-bottom: 1px gainsboro solid;">
		<uni-section title="学习手册" type="line" titleFontSize="25px"></uni-section>
	</view>
	<view style="padding:10px">
		<uni-grid :column="3" :highlight="true" :show-border="false">
			<uni-grid-item >
				<view class="grid-item-box" >
					<uni-icons type="camera" size="50" color="red"></uni-icons>
					<text style="font-size: 17px;color: gray;">C</text>
				</view>
			</uni-grid-item>
			<uni-grid-item >
				<view class="grid-item-box" >
					<uni-icons type="videocam" size="50" color='orange'></uni-icons>
					<text style="font-size: 17px;color: gray;">C++</text>
				</view>
			</uni-grid-item>
			<uni-grid-item >
				<view class="grid-item-box">
					<uni-icons type="map" size="50" color='green'></uni-icons>
					<text style="font-size: 17px;color: gray;">Java</text>
				</view>
			</uni-grid-item>
			<uni-grid-item >
				<view class="grid-item-box">
					<uni-icons type="wallet" size="50" color="gray"></uni-icons>
					<text style="font-size: 17px;color: gray;">JavaScript</text>
				</view>
			</uni-grid-item>
		</uni-grid>
	</view>
	<!-- 其他 -->
	<view style="border-bottom: 1px gainsboro solid;">
		<uni-section title="其他" type="line" titleFontSize="25px"></uni-section>
	</view>
	<view>
		<view style="position:relative;padding: 10px;">
			<image mode="scaleToFill" src="/static/111.png" style="width: 100%;height:150px;border-radius: 5%;"></image>
			<view style="position: absolute;top:100px;left:20px;color:white;font-size: 25px;">我的博客</view>
		</view>
		<view style="position:relative;padding: 10px;">
			<image mode="scaleToFill" src="/static/222.png" style="width: 100%;height:150px;border-radius: 5%;"></image>
			<view style="position: absolute;top:100px;left:20px;color:white;font-size: 25px;">我的文档</view>
		</view>
		<view style="position:relative;padding: 10px;">
			<image mode="scaleToFill" src="/static/333.png" style="width: 100%;height:150px;border-radius: 5%;"></image>
			<view style="position: absolute;top:100px;left:20px;color:white;font-size: 25px;">我的收藏</view>
		</view>
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
	{
		id: 8,
		type: 'video',
		url: 'https://vjs.zencdn.net/v/oceans.mp4'  //在线视频链接
	},
])




// onMounted生命周期
onMounted(() => {
	
	
})

function search(){
	
}

</script>

<style scoped>
	.grid-item-box {
		flex:1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding:10px 0px;
	}
	    
</style>
