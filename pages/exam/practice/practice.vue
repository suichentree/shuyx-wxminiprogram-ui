<template>
	<view>
		<view style="background-color: white;padding:10px;margin: 10px;">
			<view style="display: flex;flex-direction: row;gap: 5px;">
					<view>
						<uni-tag text="66" type="primary" size="mini" />
					</view>
					<view style="font-size: 14px;color: rgb(51, 51, 51);">
						1.[判断题]在拉拽触电者脱离电源的过程中,救护人用双手操作,这样对救护人比较安全。
						<br />
						<view style="font-size: 12px;color:gray;">
							单选题
						</view>
					</view>
			</view>
			<view>
				<uni-data-checkbox v-model="radio1" :localdata="sex" mode="list"></uni-data-checkbox>
			</view>
		</view>
		<view style="background-color: white;padding:10px;margin: 10px;">
			<view style="display: flex;flex-direction: row;gap: 5px;">
					<view>
						<uni-tag text="66" type="primary" size="mini" />
					</view>
					<view style="font-size: 14px;color: rgb(51, 51, 51);">
						1.[判断题]在拉拽触电者脱离电源的过程中,救护人用双手操作,这样对救护人比较安全。
						<br />
						<view style="font-size: 12px;color:gray;">
							多选题
						</view>
					</view>
			</view>
			<view>
				<uni-data-checkbox multiple v-model="value" :localdata="sex" @change="change" mode="list"></uni-data-checkbox>
			</view>
		</view>
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
	
let sex = ref([{
			text: '男',
			value: 0
		}, {
			text: '女',
			value: 1
		}, {
			text: '未知',
			value: 2
		}]) 
		
let value = ref([0,2])
let range = ref([{"value": 0,"text": "篮球"	},{"value": 1,"text": "足球"},{"value": 2,"text": "游泳"}])

function getQuestionList(){
	let params = {exam_id:examId.value}
	ExamAPIService.getQuestionList(params).then((res) => {
		console.log(res)
		if (res.code == 200) {
			
		}
	})
}

</script>
<style>
	       
</style>
  