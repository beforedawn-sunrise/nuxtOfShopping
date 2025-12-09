<template>
    <div class="w-full h-auto min-h-[calc(100vh-68px)] bg-rose-500 flex flex-col justify-center items-center pt-[20px] pb-[20px]">
        <h1 class="text-white text-center text-[30px] font-black mb-[20px]" v-if="wishList.length !== 0">我的願望清單</h1>
        <h1 class="text-white text-center text-[30px] font-black mb-[20px]" v-if="wishList.length == 0">目前願望清單為空</h1>
        <div class="w-[90%] md:w-[65%] bg-rose-200 mb-[20px] p-[20px] rounded-[10px] flex justify-start items-center" v-for="item in wishList" :key="item">
            <img :src="item.imageUrl" class="w-[100px] sm:w-[150px] h-[100px] sm:h-[150px] mr-[20px] rounded-[10px] object-cover" alt="">
            <div>
                <div>
                    <p class="text-[20px] font-black">{{ item.title }}</p>
                    <p class="text-base text-gray-400 font-black">{{ item.description }}</p>
                    <p class="text-base text-gray-500 line-through font-black">原價:NT${{ item.origin_price }}元</p>
                    <p class="text-base font-black">售價:NT${{ item.price }}元</p>
                    <p class="text-base font-black">{{ item.content }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import type { productManageModel } from '../interface/productManageModel';
definePageMeta({
  layout: 'default' // 使用 default 布局
})
const wishList = ref([] as productManageModel[]);

onMounted(()=>{
    wishList.value = JSON.parse(localStorage.getItem('wishList') || '[]');
})

</script>