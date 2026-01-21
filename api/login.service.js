// 引入 request 文件
import request from './request.js'

// 创建资源访问对象
const APIResources = {
	//获取测试列表
	Login (params) {
		return request({
			url: '/login',
			method: 'POST',
			data: params,
			header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	Logout () {
		return request({
			url: '/logout',
			method: 'POST',
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	wxUserLogin (params) {
		return request({
			url: '/wxUserLogin',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	}
}
 
export default APIResources
