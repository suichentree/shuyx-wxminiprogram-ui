// 引入 request 文件
import request from './request.js'

// 创建资源访问对象
const APIResources = {
	//创建订单
	createOrder(params) {
		return request({
			url: '/api/order/createOrder',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//获取订单详情
	getOrderDetail(params) {
		return request({
			url: '/api/order/getOrderDetail',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//获取用户订单
	getUserOrders(params) {
		return request({
			url: '/api/order/getUserOrders',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//取消订单
	cancelOrder(params) {
		return request({
			url: '/api/order/cancelOrder',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//确认订单支付
	confirmOrderPayment(params) {
		return request({
			url: '/api/order/confirmOrderPayment',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	}
}
 
export default APIResources
