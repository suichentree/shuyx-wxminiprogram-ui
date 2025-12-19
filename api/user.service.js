// 引入 request 文件
import request from './request.js'
 
// 用户微信登录
export const userWXlogin = (params) => {
	return request({
		url: '/mp/user/wxLogin',
		method: 'POST',
		data: params,
        header: {"Content-Type":"application/json;charset=UTF-8"} 
	})
}
// 获取用户信息
export const getUserInfo = (id) => {
	return request({
		url: `/mp/user/getUserInfo`,
		method: 'GET',
		data: params,
		header: {"Content-Type":"application/x-www-form-urlencoded"} 
	})
}