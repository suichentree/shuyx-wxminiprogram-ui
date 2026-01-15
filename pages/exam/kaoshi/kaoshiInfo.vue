<template>
	<view class="page-container">
		<uni-section title="介绍" type="line">
			<uni-list :border="false">
				<uni-list-item :title="exam_info.name">
					<template v-slot:footer>
						<button type="primary" size="mini" @click="toKaoshi">开始考试</button>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-section>
		<uni-section title="历史记录" type="line">
			<uni-list :border="false">
				<uni-list-item v-for="(item,index) in history_list" 
					:border="false" 
					:title="exam_info.name" 
					:note="'完成时间 '+item.finish_time" :rightText="'正确率 '+item.score"/>
			</uni-list>
		</uni-section>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import kaoshiAPIService from '@/api/kaoshi.service.js'
import { onLoad } from "@dcloudio/uni-app";

//用户id
let userId = ref(getApp().globalData.userId)
userId.value = 999

//测试id
let examId = ref(null)
//获取上一个页面传递的参数
onLoad((option) => {
	examId.value = option.examId;
});


onMounted(()=>{
	history()
})
		

// 历史列表
let history_list = ref([])
// 模拟考试信息
let exam_info = ref({
	name:null,
	id:null,
	tag:null
})

//获取模拟考试历史记录
function history(){
	let params = {user_id:999,exam_id:examId.value}
	kaoshiAPIService.history(params).then((res) => {
		console.log(res)
		if (res.code == 200) {
			history_list.value = res.data.user_exam_history
			exam_info.value = res.data.exam_info
		}
	})
}

function toKaoshi(){
	uni.navigateTo({
		url: '/pages/exam/kaoshi/kaoshi?examId='+examId.value
	})
}
</script>
<style scoped>

</style>
  