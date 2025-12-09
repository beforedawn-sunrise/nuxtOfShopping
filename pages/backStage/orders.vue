<template>
    <div>
        <h1 class="text-[32px] text-center font-black">所有訂單</h1>
        <h1 class="text-[32px] text-center font-black" v-if="order.length == 0">您目前沒有訂單</h1>

        <div class="w-full flex flex-col md:flex-row items-end md:items-center justify-end m-[10px]">
            <p class="text-base font-black mr-[5px]">下訂單者姓名搜尋:</p>
            <input type="text" class="h-[30px] pl-[10px] mr-[20px] font-black outline-none border border-black rounded-[5px]" placeholder="請輸入下訂單者姓名" v-model="nameSearch">
        </div>
        <div class="w-full flex items-center flex-col">
            <template v-if="order.length > 0">
                <div class="mt-[30px] w-[90%] rounded-[20px]" v-for="(item, index) in filterOrder" :key="index">
                    <p class="text-xl font-black text-center">訂單 {{ index + 1 }}</p>
                    <table class="w-full border-separate border-spacing-[0px] relative overflow-x-scroll">
                        <thead>
                            <tr>
                                <th class="bg-sky-500 text-white border-b-2 border-white h-[45px] whitespace-nowrap text-base">姓名</th>
                                <th class="bg-sky-500 text-white border-b-2 border-white h-[45px] text-base w-[100px] sm:w-auto break-all">email</th>
                                <th class="bg-sky-500 text-white border-b-2 border-white h-[45px] whitespace-nowrap text-base w-[80px] sm:w-auto break-all">電話</th>
                                <th class="bg-sky-500 text-white border-b-2 border-white h-[45px] whitespace-nowrap text-base">地址</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white even:bg-sky-200 hover:bg-sky-100 text-black">
                                <td class="py-[10px] font-black text-center text-base border-b border-dotted border-sky-500">{{ item.user.name }}</td>
                                <td class="py-[10px] font-black text-center text-base border-b border-dotted border-sky-500 w-[80px] sm:w-auto break-all">{{ item.user.email }}</td>
                                <td class="py-[10px] font-black text-center text-base border-b border-dotted border-sky-500 w-[80px] sm:w-auto break-all">{{ item.user.tel }}</td>
                                <td class="py-[10px] font-black text-center text-base border-b border-dotted border-sky-500">{{ item.user.address }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="w-full border-separate border-spacing-[0px] relative overflow-x-scroll">
                        <thead>
                            <tr>
                                <th class="bg-sky-500 text-white border-b-2 border-white w-[100px] h-[45px] whitespace-nowrap text-base">品名</th>
                                <th class="bg-sky-500 text-white border-b-2 border-white w-[100px] h-[45px] whitespace-nowrap text-base">數量</th>
                                <th class="bg-sky-500 text-white border-b-2 border-white w-[100px] h-[45px] whitespace-nowrap text-base">總價</th>
                                <th class="bg-sky-500 text-white border-b-2 border-white w-[100px] h-[45px] whitespace-nowrap text-base">送貨地址</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white even:bg-sky-200 hover:bg-sky-100 text-black" v-for="product in item.products" :key="item.id">
                                <td class="py-[10px] font-black text-center text-base border-b border-dotted border-sky-500">{{ product.product.title }}</td>
                                <td class="py-[10px] font-black text-center text-base border-b border-dotted border-sky-500">{{ product.qty }}</td>
                                <td class="py-[10px] font-black text-center text-base border-b border-dotted border-sky-500">{{ product.final_total }}</td>
                                <td class="py-[10px] font-black text-center text-base border-b border-dotted border-sky-500">{{ item.user.address }}</td>
                            </tr>
                            <tr class="bg-white even:bg-sky-200 hover:bg-sky-100 text-black">
                                <td class="py-[10px] font-black text-center text-base border-b border-dotted border-sky-500">總計:</td>
                                <td class="py-[10px] font-black text-center text-base border-b border-dotted border-sky-500"></td>
                                <td class="py-[10px] font-black text-center text-base border-b border-dotted border-sky-500">{{ item.finalTotal }}</td>
                                <td class="py-[10px] font-black text-green-600 text-center text-base border-b border-dotted border-sky-500" v-if="item.isPaid">已付款完成</td>
                                <td class="py-[10px] font-black text-red-600 text-center text-base border-b border-dotted border-sky-500" v-if="!item.isPaid">未付款</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'back-stage-layout' // 使用 back-stage-layout 布局
})
import { ref, onMounted ,nextTick,computed } from 'vue';
import { openDB, cursorGetData, cursorGetDataByIndex, updateDB } from '../../utils/indexedDB'
import type { orderModel } from '../../interface/productManageModel'

const order = ref([] as orderModel[]);
const nameSearch = ref('');
onMounted(() => {
    nextTick(async () => {
        let database;

        // const db = await openDB('order', 1);
        // if (cursorGetData(db, 'order') != null) {
        //     const orderData = await cursorGetData(db, 'order');
        //     myOrder.value.push(...orderData);
        // }
        await openDB('orderDB', 2).then(async (db: any) => {
            database = db;
            const orderData = await cursorGetData(database, 'orders');
            order.value.push(...orderData); // 展開陣列
        });
    });
})


const filterOrder = computed(() => {
    const filter = order.value.filter(item => item.user.name.includes(nameSearch.value));
    return filter;
});
</script>