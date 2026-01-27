// 引入 request 文件
import request from './request.js'

// 创建资源访问对象
const APIResources = {
	//获取题目
	getQuestion(params) {
		return request({
			url: '/mp/exam/random/practice/getQuestion',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	}
}
 
export default APIResources
