<template>
	<view class="page-container">
		<uni-section title="模拟考试介绍页面" type="line">
			<uni-list :border="false">
				<uni-list-item title="XXXXXX考试" clickable  rightText="开始考试" @click="toKaoshi"/>
			</uni-list>
		</uni-section>
		<uni-section title="历史记录" type="line">
			<uni-list :border="false">
				<uni-list-item :border="false" title="列表文字" note="列表描述信息" rightText="右侧文字" />
				<uni-list-item :border="false" title="列表文字" note="列表描述信息" rightText="右侧文字" />
			</uni-list>
		</uni-section>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import kaoshiAPIService from '@/api/kaoshi.service.js'
import { onLoad } from "@dcloudio/uni-app";

//测试id
let examId = ref(undefined)

//获取上一个页面传递的参数
onLoad((option) => {
	examId.value = option.examId;
});

onMounted(()=>{
	history()
})
		

// 历史列表
let history_list = ref([])
//获取模拟考试历史记录
function history(){
	let params = {user_id:999,exam_id:examId.value}
	kaoshiAPIService.history(params).then((res) => {
		console.log(res)
		if (res.code == 200) {
			history_list.value = res.data
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
  