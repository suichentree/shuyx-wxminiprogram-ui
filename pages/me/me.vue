<template>
	<view class="user_head_container">
		<!-- 头像 -->
		<image style="width: 100px; height: 100px;border-radius: 50%;" mode="scaleToFill" :src="user_default_image"></image>
		<text style="font-weight: 700;">{{userName}}</text>
		<!-- 动图 -->
		<image src="/static/aaa.gif" mode="scaleToFill" class="gif_wave"></image>
	</view>
	<!-- 信息宫格 -->
	<view class="my_grid_container">
		<view class="my_grid_item">
			<text style="font-size: 25px;color: #39b54a;">99</text>
			<uni-icons type="eye-filled" size="18"  color="#39b54a">阅读</uni-icons>
		</view>
		<view class="my_grid_item">
			<text style="font-size: 25px;color: #0081ff;">100</text>
			<uni-icons type="hand-up-filled" size="18" color='#0081ff'>点赞</uni-icons>
		</view>
		<view class="my_grid_item">
			<text style="font-size: 25px;color: #f37b1d;">200</text>
			<uni-icons type="star-filled" size="18" color='#f37b1d'>收藏</uni-icons>
		</view>
	</view>
	<!-- 列表 -->
	<view style="padding:26px 16px;">
		<uni-list >
			<!-- <uni-list-item title="微信登录" :show-extra-icon="true" :extra-icon="{color: 'red',size: '25',type: 'star-filled'} ">
				<template v-slot:footer>
					<button type="primary" size="mini" v-if=" userId == null " @click="wxLogin" style="background-image: linear-gradient(45deg, #39b54a, #8dc63f);box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);">点击登录</button>
					<button type="primary" size="mini" v-else style="background-image: linear-gradient(45deg, #39b54a, #8dc63f);box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);">已登录</button>
				</template>
			</uni-list-item> -->
			<uni-list-item title="账户登录" :show-extra-icon="true" :extra-icon="{color: 'red',size: '25',type: 'star-filled'} ">
				<template v-slot:footer>
					<button type="primary" size="mini" v-if=" userId == '' " @click="toLogin" style="background-image: linear-gradient(45deg, #39b54a, #8dc63f);box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);">点击登录</button>
					<button type="primary" size="mini" v-else style="background-image: linear-gradient(45deg, #39b54a, #8dc63f);box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);">已登录</button>
				</template>
			</uni-list-item>
			<uni-list-item title="个人信息" clickable  link="navigateTo" to="/pages/userinfo/userinfo" :show-extra-icon="true" :extra-icon="{color: 'orange',size: '25',type: 'contact'} "/>
			<uni-list-item title="消息" clickable  @click="toOther()" :show-extra-icon="true" :extra-icon="{color: 'green',size: '25',type: 'chat'} " showArrow/>
			<uni-list-item title="意见反馈" clickable  @click="toOther()" :show-extra-icon="true" :extra-icon="{color: 'purple',size: '25',type: 'compose'} " showArrow/>
			<uni-list-item title="二维码" clickable  @click="toOther()" :show-extra-icon="true" :extra-icon="{color: '#009300',size: '25',type: 'pyq'} " showArrow/>
			<uni-list-item title="设置" clickable  @click="toOther()" :show-extra-icon="true" :extra-icon="{color: '#000000',size: '25',type: 'gear'} " showArrow/>
			<uni-list-item title="版本号" clickable  @click="toOther()" :show-extra-icon="true" :extra-icon="{color: '#bf0000',size: '25',type: 'info'} " :rightText="version_text"/>
			<uni-list-item title="注销" clickable  @click="toLogout()" :show-extra-icon="true" :extra-icon="{color: '#55aaff',size: '25',type: 'info'} " rightText="点击注销"/>
		</uni-list>
	</view>
</template>

<script setup>
import { ref,watch, onMounted, provide } from 'vue'
import UserAPIService from '@/api/user.service.js'
import LoginAPIService from '@/api/login.service.js'


// 用户默认头像
let user_default_image = ref("/static/default_user_head.jpg")
// 版本信息
let version_text = ref(getApp().globalData.version)
// 用户信息
let userInfo = ref(getApp().globalData.userInfo)
let userName = ref(getApp().globalData.userName)
let userId = ref(getApp().globalData.userId)

//监听userInfo
watch(userInfo,(newValue, oldValue) => {
    newValue = oldValue
},{ deep: true })

let extraIcon = ref({
	color: '#4cd964',
	size: '25',
	type: 'star'
})

// onMounted生命周期
onMounted(() => {
	
})

function toOther(){
	uni.showToast({
		title: '正在开发中，敬请期待',
		icon:"none",
	})
}

function toLogout(){
	console.log("注销....")
	LoginAPIService.Logout().then((res) => {
		if (res.code == 200) {
			//清理本地缓存
			uni.clearStorage()
			//导航到login页面
			uni.navigateTo({
				url:"/pages/login/login"
			})
		}
	}).catch(err => {
		console.error('注销失败：', err);
	})
}

function toLogin(){
	uni.navigateTo({
		url:"/pages/login/login"
	})
}

function wxLogin(){
	console.log("微信登录....")
	uni.login({
	  provider: 'weixin', //使用微信登录
	  onlyAuthorize:true,
	  success: function (loginRes) {  
	    console.log(loginRes);
		
		//微信用户登录接口
		let params = {"code":loginRes.code}
		UserAPIService.wxUserLogin(params).then((res) => {
			if (res.code == 200) {
				//本地缓存
				uni.setStorage({key:"token",data:res.data.token})
				uni.setStorage({key:"userId",data:res.data.userInfo.id})
				uni.setStorage({key:"userName",data:res.data.userInfo.name})
				uni.setStorage({key:"userInfo",data:res.data.userInfo})
				
				if (res.data.isFirstLogin == 0) {
					//不是第一次登录
					//刷新页面
					uni.reLaunch({
					    url: '/pages/me/me'
					})
				}else{
					//是第一次登录，需要跳转到个人信息页面。补全个人信息
					uni.navigateTo({
						url: '/pages/userinfo/userinfo?userId='+res.data.userInfo.id
					})
					//刷新页面
					uni.reLaunch({
					    url: '/pages/me/me'
					})
				}
			}
		})
	  },fail() {
		//获取code需要先在mainfest.json中设置微信小程序的appid
		uni.showToast({
			icon:"fail",
			title: '微信Code获取失败',
			duration: 2000
		});
	  }
	});
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
