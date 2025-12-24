<template>
	<view style="margin: 10px;">
		<view style="background-color: white;">
			<view style="display: flex;flex-direction: row;align-items: center;padding:12px;gap: 5px;">
					<view style="width: 10px;height: 12px;background-color: #2979ff;">
					</view>
					<view style="font-size: 14px;color: rgb(51, 51, 51);">
						1.[判断题]在拉拽触电者脱离电源的过程中,救护人用双手操作,这样对救护人比较安全。
					</view>
			</view>
			<view>
				<uni-data-checkbox v-model="radio1" :localdata="sex" mode="list"></uni-data-checkbox>
			</view>
		</view>
	</view>
	<uni-section class="mb-10" title="基础用法" sub-title="副标题"></uni-section>
</template>

<script setup>
import { ref } from 'vue';

	
	
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
</script>

<style>
	       
</style>
