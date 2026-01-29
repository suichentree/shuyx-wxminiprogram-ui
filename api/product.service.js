// 引入 request 文件
import request from './request.js'

// 创建资源访问对象
const APIResources = {
	//获取商品列表
	getProductList(params) {
		return request({
			url: '/api/product/getProductList',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//获取商品详情
	getProductDetail(params) {
		return request({
			url: '/api/product/getProductDetail',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//获取用户商品列表
	getUserProducts(params) {
		return request({
			url: '/api/product/getUserProducts',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	},
	//检查商品权限
	checkProductAccess(params) {
		return request({
			url: '/api/product/checkProductAccess',
			method: 'POST',
			data: params,
	        header: {"Content-Type":"application/json;charset=UTF-8"} 
		})
	}
}
 
export default APIResources
