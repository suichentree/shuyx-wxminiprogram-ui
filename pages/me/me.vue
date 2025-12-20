<template>
	<view class="user_head_container">
		<!-- 头像 -->
		<image style="width: 100px; height: 100px;border-radius: 50%;" mode="scaleToFill" :src="user_default_image"></image>
		<!-- 动图 -->
		<image src="/static/aaa.gif" mode="scaleToFill" class="gif_wave"></image>
	</view>
	<!-- 信息宫格 -->
	<view class="my_grid_container">
		<view class="my_grid_item">
			<text style="font-size: 25px;color: #39b54a;">99</text>
			<uni-icons type="camera" size="18"  color="#39b54a">阅读</uni-icons>
		</view>
		<view class="my_grid_item">
			<text style="font-size: 25px;color: #0081ff;">100</text>
			<uni-icons type="videocam" size="18" color='#0081ff'>点赞</uni-icons>
		</view>
		<view class="my_grid_item">
			<text style="font-size: 25px;color: #f37b1d;">200</text>
			<uni-icons type="map" size="18" color='#f37b1d'>收藏</uni-icons>
		</view>
	</view>
	<!-- 列表 -->
	<view style="padding:26px 16px;">
		<uni-list >
			<uni-list-item title="微信登录" :show-extra-icon="true" :extra-icon="{color: 'red',size: '25',type: 'star'} ">
				<template v-slot:footer>
					<button type="primary" size="mini" style="background-image: linear-gradient(45deg, #39b54a, #8dc63f);box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);">点击登录</button>
				</template>
			</uni-list-item>
			<uni-list-item title="个人信息" :show-extra-icon="true" :extra-icon="{color: 'orange',size: '25',type: 'contact'} " showArrow/>
			<uni-list-item title="消息" :show-extra-icon="true" :extra-icon="{color: 'green',size: '25',type: 'chat'} " showArrow/>
			<uni-list-item title="测试记录" :show-extra-icon="true" :extra-icon="{color: 'gray',size: '25',type: 'wallet'} " showArrow/>
			<uni-list-item title="意见反馈" :show-extra-icon="true" :extra-icon="{color: 'purple',size: '25',type: 'compose'} " showArrow/>
			<uni-list-item title="二维码" :show-extra-icon="true" :extra-icon="{color: '#009300',size: '25',type: 'pyq'} " showArrow/>
			<uni-list-item title="设置" :show-extra-icon="true" :extra-icon="{color: '#000000',size: '25',type: 'gear'} " showArrow/>
			<uni-list-item title="版本号" :show-extra-icon="true" :extra-icon="{color: '#bf0000',size: '25',type: 'info'} " :rightText="version_text"/>
		</uni-list>
	</view>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'

// 用户默认头像
let user_default_image = ref("/static/default_user_head.jpg")
// 版本信息
let version_text = ref(getApp().globalData.version)


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
		background-color: white;
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
		flex-grow:1;     /* flex-grow属性用来定义子元素等分剩余空间的比例。 */
	}
</style>
