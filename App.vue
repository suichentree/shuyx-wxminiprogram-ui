<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		//全局变量
		globalData: {
			//小程序版本号
			version:"v2.1.1",
			//用户相关信息
			userInfo: null,
			openId:null,
			unionId:null,
			token:null,
		}
	}
</script>

<style>
	/*此处定义的是全局样式*/
	page {
		background-color: whitesmoke;   /* 页面背景色 */
	}
</style>
