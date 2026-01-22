// 引入 request 文件
import request from './request.js'

// 创建资源访问对象
const APIResources = {
	//获取测试列表
	getExamList (params) {
		return request({
			url: '/mp/exam/getExamList',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//获取问题列表
	getKaoshiQuestionList (params) {
		return request({
			url: '/mp/exam/kaoshi/getQuestionList',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//获取模拟考试记录
	getKaoshiQuestionList (params) {
		return request({
			url: '/mp/exam/kaoshi/getQuestionList',
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
