<template>
	<view>
		<uni-list >
			<uni-list-item title="头像" :show-extra-icon="true" :extra-icon="{color: 'green',size: '25',type: 'person'} ">
				<template v-slot:footer>
					<image class="slot-image" :src="user_default_image" mode="widthFix" style="width: 35px;"></image>
				</template>
			</uni-list-item>
			<uni-list-item title="名称" rightText="王小明"  :show-extra-icon="true" :extra-icon="{color: 'green',size: '25',type: 'chat'} " />
			<uni-list-item title="性别"  :show-extra-icon="true" :extra-icon="{color: 'gray',size: '25',type: 'wallet'}" showArrow>
				<template v-slot:footer>
					<picker mode="selector" :value="gender_index" :range="genderArray" range-key="label" @change="bindGenderChange">
						<view class="uni-input">{{genderArray[gender_index].label}}</view>
					</picker>
				</template>
			</uni-list-item>
			<uni-list-item title="年龄" :show-extra-icon="true" :extra-icon="{color: 'purple',size: '25',type: 'compose'} " showArrow>
				<template v-slot:footer>
					<picker mode="selector" :value="age_index" :range="ageArray" @change="bindAgeChange" >
						<view class="uni-input">{{ageArray[age_index]}}</view>
					</picker>
				</template>
			</uni-list-item>
			<uni-list-item title="二维码" :show-extra-icon="true" :extra-icon="{color: '#009300',size: '25',type: 'pyq'} " showArrow/>
			<uni-list-item title="设置" :show-extra-icon="true" :extra-icon="{color: '#000000',size: '25',type: 'gear-filled'} " showArrow/>
		</uni-list>
	</view>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'

// 用户默认头像
let user_default_image = ref("/static/default_user_head.jpg")
let userInfo = getApp().globalData.userInfo
//性别选择器
let gender_index = ref(0)
let genderArray = ref([{"label":"暂无","value":0},{"label":"男","value":1},{"label":"女","value":2}])
//年龄选择器
let age_index = ref(0)
let ageArray = ref([10,20,30,40,50,60])


// onMounted生命周期
onMounted(() => {
	
})

function bindGenderChange(e){
	console.log('picker发送选择改变，携带值为', e.detail.value)
	gender_index.value = e.detail.value
}
function bindAgeChange(e) {
	age_index.value = e.detail.value
}

</script>

<style>
	       
</style>
