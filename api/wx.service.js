// 引入 request 文件
import request from './request.js'

// 创建资源访问对象
const APIResources = {
	getOpenIdByWxCode (params) {
		return request({
			url: '/mp/wxservice/getOpenIdByWxCode',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	}
}
 
export default APIResources
