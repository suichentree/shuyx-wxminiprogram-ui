<template>
	<view class="page-container">
		<uni-section title="顺序练习介绍页面" type="line">
			<uni-list :border="false">
				<uni-list-item :title="exam_info.name">
					<template v-slot:footer>
						<button type="primary" size="mini" @click="toStart">开始练习</button>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-section>
		<uni-section title="顺序练习历史记录" type="line">
			<uni-list :border="false">
				<uni-list-item v-for="(item,index) in history_list" 
					:key="item.id"
					:border="false" 
					:title="exam_info.name" 
					:note="'完成时间 ' + (item.finish_time || '-')" 
					:rightText="'正确率 ' + (item.accuracy_rate || 0) + '%'"
					@click="viewResult(item.id)"
				/>
			</uni-list>
		</uni-section>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import practiceAPIService from '@/api/practice.service.js'
import { onLoad } from "@dcloudio/uni-app";

//用户id
let userId = ref(getApp().globalData.userId)
userId.value = 999

//测试id
let examId = ref(null)
//获取上一个页面传递的参数
onLoad((option) => {
	examId.value = option.examId;
	
	examId.value = 1;
});


onMounted(()=>{
	history()
})
		

// 历史列表
let history_list = ref([])
// 考试信息
let exam_info = ref({
	name:null,
	id:null,
	tag:null
})
//获取历史记录
function history(){
	let params = {user_id:999,exam_id:examId.value}
	practiceAPIService.history(params).then((res) => {
		console.log(res)
		if (res.code == 200) {
			history_list.value = res.data.user_exam_history
			exam_info.value = res.data.exam_info
		}
	})
}

let userExamId = ref(null)
let pageNo = ref(null)
function toStart(){
	//调用接口，开始/继续顺序练习
	let params = {user_id:userId.value,exam_id:examId.value}
	practiceAPIService.start(params).then((res) => {
		console.log(res)
		if (res.code == 200) {
			userExamId.value = res.data.user_exam_id
			pageNo.value = res.data.page_no
			
			//跳转到练习页面
			uni.navigateTo({
				url: '/pages/exam/practice/practice?userExamId='+userExamId.value
			})
		}else{
			
		}
	})
}

// 查看历史记录结果
function viewResult(userExamId) {
	uni.navigateTo({
		url: '/pages/exam/practice/practiceResult?userExamId=' + userExamId
	})
}
</script>
<style scoped>

</style>
  