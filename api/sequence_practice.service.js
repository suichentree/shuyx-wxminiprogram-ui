// 引入 request 文件
import request from './request.js'

// 创建资源访问对象
const APIResources = {
	//开始/继续 
	start(params) {
		return request({
			url: '/mp/exam/sequence/practice/start',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//获取题目
	getQuestion(params) {
		return request({
			url: '/mp/exam/sequence/practice/getQuestion',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//获取答题卡信息
	getAnswerCardInfo(params) {
		return request({
			url: '/mp/exam/sequence/practice/getAnswerCardInfo',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//获取历史记录
	history(params) {
		return request({
			url: '/mp/exam/sequence/practice/history',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//交卷
	submitAnswer(params){
		return request({
			url: '/mp/exam/sequence/practice/submitAnswer',
			method: 'POST',
			data: params,
		    header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//获取结果
	practiceResult(params){
		return request({
			url: '/mp/exam/sequence/practice/practiceResult',
			method: 'POST',
			data: params,
		    header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	}
}
 
export default APIResources
