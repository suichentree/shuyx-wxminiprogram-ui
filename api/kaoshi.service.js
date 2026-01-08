// 引入 request 文件
import request from './request.js'

// 创建资源访问对象
const APIResources = {
	//开始/继续模拟考试 
	start(params) {
		return request({
			url: '/mp/exam/kaoshi/start',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//获取模拟考试记录
	history(params) {
		return request({
			url: '/mp/exam/kaoshi/history',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//交卷
	submitAnswerMap(params){
		return request({
			url: '/mp/exam/submitAnswerMap',
			method: 'POST',
			data: params,
		    header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	}
}
 
export default APIResources
