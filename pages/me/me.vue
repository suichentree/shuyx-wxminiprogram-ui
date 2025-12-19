<template>
	<view class="user_head_container">
		<!-- 头像 -->
		<image style="width: 100px; height: 100px;border-radius: 50%;" mode="scaleToFill" :src="user_image"></image>
		<!-- 动图 -->
		<image src="/static/aaa.gif" mode="scaleToFill" class="gif_wave"></image>
	</view>
	<!-- 信息宫格 -->
	<view class="my_grid_container">
		<view class="my_grid_item">
			<text style="font-size: 25px;color: orange;">99</text>
			<uni-icons type="camera" size="18"  color="orange">阅读</uni-icons>
		</view>
		<view class="my_grid_item">
			<text style="font-size: 25px;color: royalblue;">100</text>
			<uni-icons type="videocam" size="18" color='royalblue'>点赞</uni-icons>
		</view>
		<view class="my_grid_item">
			<text style="font-size: 25px;color: green;">200</text>
			<uni-icons type="map" size="18" color='green'>收藏</uni-icons>
		</view>
	</view>
	<!-- 列表 -->
	<view style="padding: 27px 16px;background-color: whitesmoke;">
		<uni-list style="border-radius: 10%;">
			<uni-list-item title="微信登录" :show-extra-icon="true" :extra-icon="{color: 'red',size: '25',type: 'star'} " />
			<uni-list-item title="个人信息" :show-extra-icon="true" :extra-icon="{color: 'orange',size: '25',type: 'contact'} " showArrow/>
			<uni-list-item title="消息" :show-extra-icon="true" :extra-icon="{color: 'green',size: '25',type: 'chat'} " showArrow/>
			<uni-list-item title="测试记录" :show-extra-icon="true" :extra-icon="{color: 'gray',size: '25',type: 'wallet'} " showArrow/>
			<uni-list-item title="意见反馈" :show-extra-icon="true" :extra-icon="{color: 'purple',size: '25',type: 'compose'} " showArrow/>
			<uni-list-item title="二维码" :show-extra-icon="true" :extra-icon="{color: '#55aaff',size: '25',type: 'pyq'} " showArrow/>
			<uni-list-item title="设置" :show-extra-icon="true" :extra-icon="{color: '#000000',size: '25',type: 'gear'} " showArrow/>
			<uni-list-item title="版本号" :show-extra-icon="true" :extra-icon="{color: '#ffaaff',size: '25',type: 'info'} " showArrow/>
		</uni-list>
	</view>
	
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'

let user_image = ref("/static/default_user_head.jpg")

let extraIcon = ref({
	color: '#4cd964',
	size: '25',
	type: 'star'
})


// onMounted生命周期
onMounted(() => {
	
	
})

function search(){
	
}

</script>

<style scoped>
	.user_head_container{
		background-color: #FFC125;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.gif_wave{
		height: 60px;
		width: 100%;
		z-index: 999;
		mix-blend-mode: screen;   /* 重要属性，会将gif图的背景色与父元素背景色进行混合*/
	}
	.my_grid_container{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		box-shadow: 0 30rpx 20rpx rgba(0, 0, 0, 0.2);  /* 阴影效果 */
	}
	.my_grid_item{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding:10px;
	}
</style>
