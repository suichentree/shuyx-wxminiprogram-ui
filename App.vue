<script>
	export default {
		//全局变量
		globalData: {
			//小程序版本号
			version:"v2.0.1",
			//用户相关信息
			userId:null,
			userName:null,
			userInfo: null,
			token:null,
		},
		// 应用启动/刷新时执行（核心：恢复 globalData）
		onLaunch: function() {
			console.log("App Launch 应用启动/刷新，开始恢复全局数据");
			
			try {
				// 1. 读取持久化数据（敏感数据可在此处解密）
				let storedToken = uni.getStorageSync("token") || "";
				let storedUserInfo = uni.getStorageSync("userInfo");
				let storedUserName = uni.getStorageSync("userName");
				let storedUserId = uni.getStorageSync("userId");
		
				// 2. 同步到 globalData
				this.globalData.token = storedToken;
				this.globalData.userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
				this.globalData.userId = storedUserId;
				this.globalData.userName = storedUserName;
		
			} catch (e) {
				console.error("恢复全局数据失败（缓存数据损坏）", e);
				// 缓存数据损坏时清空缓存，避免启动异常
				uni.clearStorageSync();
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style>
	/*此处定义的是全局样式*/
	page {
		background-color: whitesmoke;   /* 页面背景色 */
	}
</style>
