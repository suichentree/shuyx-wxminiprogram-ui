//API_BASE_URL 首域名
const API_BASE_URL = "http://localhost:39666";
// const API_BASE_URL = "https://www.suichen.xyz:9090";

// 请求超出时间
const timeout = 5000

//封装request请求方法
const request = (obj) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: API_BASE_URL + obj.url,
			method: obj.method,
			data: obj.data,
			timeout,
			header: {...obj.header},
			success(response) {
				// 根据返回的状态码做出对应的操作
				if (response.statusCode == 200) {
					//获取响应信息中的data数据，并放行
					resolve(response.data);
				} else {
					switch (response.statusCode) {
						case 401:
							uni.showModal({
								title: "提示",
								content: "请登录",
								showCancel: false,
								success() {
									//2秒跳转到首页
									setTimeout(() => {
										uni.navigateTo({
											url: "/pages/index/index",
										})
									}, 2000);
								},
							});
							break;
						case 404:
							uni.showToast({
								title: '请求地址不存在...',
								duration: 2000,
							})
							break;
						default:
							uni.showToast({
								title: '请重试...',
								duration: 2000,
							})
							break;
					}
				}
			},
			fail(error) {
				// 请求失败后的逻辑
				console.log(err)

				uni.showToast({
					title: '未知异常,请求失败',
					icon: "error",
					duration: 2000
				})
				//放行
				reject(error)
			},
			complete() {
				// 不管成功还是失败都会执行

				//隐藏加载框和消息提示框
				uni.hideLoading();
				uni.hideToast();
			}
		})
	}).catch(() => {});
}

//导出 
export default request;