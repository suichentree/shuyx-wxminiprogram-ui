<template>
	<view class="page-container">
		<uni-card title="基础卡片" sub-title="副标题" extra="开始练习" :thumbnail="avatar" @click="onClick">
			<text class="uni-body">这是一个带头像和双标题的基础卡片，此示例展示了一个完整的卡片。</text>
		</uni-card>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ExamAPIService from '@/api/exam.service.js'
import { onLoad } from "@dcloudio/uni-app";

//测试id
let examId = ref(undefined)

//获取上一个页面传递的参数
onLoad((option) => {
	examId.value = option.examId;
});

onMounted(()=>{
	getQuestionList()
})

let cover = ref('https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg')


// 问题选项列表
let question_option_List = ref([])
//获取题目列表信息
function getQuestionList(){
	let params = {exam_id:examId.value}
	ExamAPIService.getQuestionList(params).then((res) => {
		console.log(res)
		if (res.code == 200) {
			question_option_List.value = res.data
		}
	})
}


</script>
<style scoped>
.page-container {
	display: flex;
	flex-direction: column;
}
.container {
		overflow: hidden;
	}

	.custom-cover {
		flex: 1;
		flex-direction: row;
		position: relative;
	}

	.cover-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 40px;
		background-color: rgba($color: #000000, $alpha: 0.4);
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 15px;
		font-size: 14px;
		color: #fff;
	}

	.card-actions {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 45px;
		border-top: 1px #eee solid;
	}
	.card-actions-item {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.card-actions-item-text {
		font-size: 12px;
		color: #666;
		margin-left: 5px;
	}
	.cover-image {
		flex: 1;
		height: 150px;
	}
	.no-border {
		border-width: 0;
	}
</style>
  