<template>
	<view>
		<uni-list >
			<uni-list-item title="头像" :show-extra-icon="true" :extra-icon="{color: 'green',size: '25',type: 'person'} ">
				<template v-slot:footer>
					<image class="slot-image" :src="user_default_image" mode="widthFix" style="width: 35px;"></image>
				</template>
			</uni-list-item>
			<uni-list-item title="名称" clickable  @click="toShow_inputDialog1" :show-extra-icon="true" :extra-icon="{color: 'green',size: '25',type: 'chat'} ">
				<template v-slot:footer>
					<text>{{name_value}}</text>
					<uni-icons type="compose" color="gray"></uni-icons>
				</template>
			</uni-list-item>
			<uni-list-item title="性别"  :show-extra-icon="true" :extra-icon="{color: 'gray',size: '25',type: 'wallet'}" showArrow>
				<template v-slot:footer>
					<picker mode="selector" :value="gender_index" :range="genderArray" range-key="label" @change="bindGenderChange">
						<view class="uni-input">{{genderArray[gender_index].label}}</view>
					</picker>
				</template>
			</uni-list-item>
			<uni-list-item title="年龄"  clickable  :show-extra-icon="true" :extra-icon="{color: 'purple',size: '25',type: 'compose'}" showArrow>
				<template v-slot:footer>
					<picker mode="selector" :value="age_index" :range="ageArray" @change="bindAgeChange">
						<view class="uni-input">{{ageArray[age_index]}}</view>
					</picker>
				</template>
			</uni-list-item>
			<uni-list-item title="地址" :show-extra-icon="true" :extra-icon="{color: '#009300',size: '25',type: 'pyq'} " showArrow>
				<template v-slot:footer>
					<picker mode="region" :value="address_value"  @change="bindAddressChange">
						<view class="uni-input">{{address_value[0]}} - {{address_value[1]}} - {{address_value[2]}}</view>
					</picker>
				</template>
			</uni-list-item>
			<uni-list-item title="电话" clickable  @click="toShow_inputDialog2" :show-extra-icon="true" :extra-icon="{color: '#000000',size: '25',type: 'gear-filled'}">
				<template v-slot:footer>
						<text>{{phone_value}}</text>
						<uni-icons type="compose" color="gray"></uni-icons>
				</template>
			</uni-list-item>
			<uni-list-item title="邮箱" clickable  @click="toShow_inputDialog3" :show-extra-icon="true" :extra-icon="{color: '#000000',size: '25',type: 'gear-filled'} " >
				<template v-slot:footer>
						<text>{{email_value}}</text>
						<uni-icons type="compose" color="gray"></uni-icons>
				</template>
			</uni-list-item>
		</uni-list>
	</view>
	<view>
		<button size="default" type="default" @click="toSave" style="margin: 16px;color:#ffffff;background: linear-gradient(45deg, #f43f3b, #ec008c);">保存</button>
		<button size="default" type="default" @click="toBack" style="margin: 16px;" >返回</button>
	</view>
	<view>
		<!-- 名称输入框 -->
		<uni-popup ref="inputDialog1" type="dialog">
			<uni-popup-dialog  mode="input" title="请输入名称" v-model="name_value"
				placeholder="请输入内容" @confirm="dialogInputConfirm1"></uni-popup-dialog>
		</uni-popup>
		<!-- 电话输入框 -->
		<uni-popup ref="inputDialog2" type="dialog">
			<uni-popup-dialog  mode="input" title="请输入电话" v-model="phone_value"
				placeholder="请输入内容" @confirm="dialogInputConfirm2"></uni-popup-dialog>
		</uni-popup>
		<!-- 邮箱输入框 -->
		<uni-popup ref="inputDialog3" type="dialog">
			<uni-popup-dialog  mode="input" title="请输入邮箱" v-model="email_value"
				placeholder="请输入内容" @confirm="dialogInputConfirm3"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import UserAPIService from '@/api/user.service.js'

// 用户信息
let userId = ref(getApp().globalData.userId)

// onMounted生命周期
onMounted(() => {
	//若已登录
	if (userId.value != undefined){
		let aaa = userId.value * 1
		getUserInfo(aaa)
	}else{
		uni.showToast("请先登录")
	}
	
})

// 获取用户信息
function getUserInfo(user_Id){
	UserAPIService.getUserInfo({userId:user_Id}).then((res) => {
		console.log(res)
		if (res.code == 200) {
			name_value.value = res.data.name
			email_value.value = res.data.email
			phone_value.value = res.data.phone
			gender_index.value = res.data.gender
			age_index.value = res.data.age
			address_value.value = res.data.address
		} else {
			uni.showToast("获取用户信息失败")
		}
	})
}

// 用户默认头像
let user_default_image = ref("/static/default_user_head.jpg")

//名称输入框
let name_value = ref(undefined)
let inputDialog1 = ref()
function toShow_inputDialog1(){
	inputDialog1.value.open()
}
function dialogInputConfirm1(val) {
	name_value.value = val
}

//性别选择器
let gender_index = ref(0)
let genderArray = ref([{"label":"暂无","value":0},{"label":"男","value":1},{"label":"女","value":2}])
function bindGenderChange(e){
	console.log('picker发送选择改变，携带值为', e.detail.value)
	gender_index.value = e.detail.value
}

//年龄选择器
let age_index = ref(0)
let ageArray = ref([10,15,20,25,30,35,40,45,50,55,60,65,70])
function bindAgeChange(e) {
	age_index.value = e.detail.value
}

//地址选择器
let address_value = ref(['北京市', '北京市', '东城区'])
function bindAddressChange(e){
	console.log(e.detail.value)
	address_value.value = e.detail.value
}

//电话输入框
let phone_value = ref(undefined)
let inputDialog2 = ref()
function toShow_inputDialog2(){
	inputDialog2.value.open()
}
function dialogInputConfirm2(val) {
	phone_value.value = val
}

//邮箱输入框
let email_value = ref(undefined)
let inputDialog3 = ref()
function toShow_inputDialog3(){
	inputDialog3.value.open()
}
function dialogInputConfirm3(val) {
	email_value.value = val
}


function toSave(){
	UserAPIService.saveUserInfo({
		id: userId.value,
		nick_name: name_value.value,
		phone: phone_value.value,
		email: email_value.value
	}).then((res) => {
		console.log(res)
		if (res.code == 200) {
			uni.showToast("保存成功")
		}else{
			uni.showToast("保存失败")
		}
	})
}

function toBack(){
	uni.switchTab({
		url: '/pages/me/me'
	})
}

</script>

<style>
	       
</style>
