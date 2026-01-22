<template>
	<view class="page-container">
		<uni-section title="介绍" type="line">
			<uni-list :border="false">
				<uni-list-item :title="exam_info.name">
					<template v-slot:footer>
						<button type="primary" size="mini" @click="toStart">开始练习</button>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-section>
		<uni-section title="历史记录" type="line">
			<!-- 空状态提示 -->
			<view v-if="history_list.length === 0">
			  <text>📝 暂无练习记录，快去开始第一次练习吧～</text>
			</view>
			<view v-else>
				<uni-list :border="false">
					<uni-list-item v-for="(item,index) in history_list" 
						:key="item.id"
						:border="false" 
						:title="exam_info.name" 
						:note="'已答:'+item.answered_count+' | 未答:'+item.unanswered_count+' | 完成时间 ' + (item.finish_time || '未完成')" 
						:rightText="'正确率 ' + (item.accuracy_rate || 0) + '%'"
						@click="viewResult(item.id)"
					/>
				</uni-list>
			</view>
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
function toStart(){
	//调用接口，开始/继续顺序练习
	let params = {user_id:userId.value,exam_id:examId.value}
	practiceAPIService.start(params).then((res) => {
		console.log(res)
		if (res.code == 200) {
			userExamId.value = res.data.user_exam_id
			//跳转到练习页面
			uni.navigateTo({
				url: '/pages/exam/practice/practice?userExamId='+userExamId.value
			})
		}else{
			uni.showToast({
			  title: '请求失败',
			  icon: 'none',
			  duration: 2000
			})
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
  