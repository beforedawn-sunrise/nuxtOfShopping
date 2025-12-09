<template>
    <div>
        <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
        <div class="w-full min-h-[calc(100vh-68px)] pb-[20px] bg-rose-500 flex items-center flex-col">
            <p class="text-[35px] text-center text-white font-black">我的訂單</p>
            <p class="mt-[20px] text-[35px] text-center text-white font-black" v-if="myOrder.length == 0">您目前沒有訂單</p>
            <template v-if="myOrder.length > 0">
                <div class="mt-[30px] w-[95%] sm:w-[90%] bg-rose-700 rounded-[20px]" v-for="(item, index) in myOrder" :key="index">
                    <p class="text-xl text-center text-white font-black">訂單 {{ index + 1 }}</p>
                    <table class="w-full border-collapse border-spacing-0 relative overflow-x-scroll">
                        <thead>
                            <tr>
                                <th class="w-100px h-[45px] bg-rose-700 text-white text-base whitespace-nowrap border-b-2 border-white">品名</th>
                                <th class="w-100px h-[45px] bg-rose-700 text-white text-base whitespace-nowrap border-b-2 border-white">數量</th>
                                <th class="w-100px h-[45px] bg-rose-700 text-white text-base whitespace-nowrap border-b-2 border-white">總價</th>
                                <th class="w-100px h-[45px] bg-rose-700 text-white text-base whitespace-nowrap border-b-2 border-white">送貨地址</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white text-black even:bg-rose-200 text-black hover:bg-rose-300 text-black" v-for="product in item.products" :key="item.id">
                                <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500">{{ product.product.title }}</td>
                                <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500">{{ product.qty }}</td>
                                <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500">{{ product.final_total }}</td>
                                <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500">{{ item.user.address }}</td>
                            </tr>
                            <tr class="bg-white text-black even:bg-rose-200 text-black hover:bg-rose-300 text-black">
                                <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500">總計:</td>
                                <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500"></td>
                                <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500">{{ item.finalTotal }}</td>
                                <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500" v-if="item.isPaid == false">
                                    <button type="button" class="text-sm py-[3px] px-[10px] bg-rose-500 text-white border-none outline-none rounded-[5px] cursor-pointer"
                                        @click="updatePaidStatus(item)">確認付款</button>
                                </td>
                                <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500" v-if="item.isPaid">
                                    <p class="text-base text-green-800 font-black whitespace-nowrap">付款完成</p>
                                </td>
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
    layout: 'default', // 使用 default 布局
    key: route => route.fullPath
});
import { ref, onMounted, nextTick, toRaw } from 'vue';
import type { orderModel } from '../interface/productManageModel'
import _ from 'lodash';
import { openDB, cursorGetData, updateDB } from '../utils/indexedDB'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

const isLoading = ref(false);

const myOrder = ref([] as orderModel[])
const googleInfo = ref({
    name: "",
    picture: "",
    email: "",
    tel: "",
    address: ""
});
onMounted(async() => {
    let database;
    isLoading.value = true;
    await openDB('orderDB', 2).then(async (db: any) => {
    database = db;
    const orderData = await cursorGetData(database, 'orders');
    const sessionGoogleInfo = sessionStorage.getItem('sessionGoogleInfo');
    if (sessionGoogleInfo == null) {
        myOrder.value = [];
        isLoading.value = false;
    }
    if (sessionGoogleInfo !== null) {
        myOrder.value.push(...orderData);
        googleInfo.value = JSON.parse(sessionGoogleInfo);
        myOrder.value = myOrder.value.filter(item => item.user.email == googleInfo.value.email);
        }
        isLoading.value = false;
    });
})


const updatePaidStatus = async (item: orderModel) => {
    let database;
    const db = await openDB('orderDB', 2);  // 等待數據庫打開
    database = db;
    const rawItem = toRaw(item);
    rawItem.isPaid = true;
    await updateDB(database, 'orders', rawItem);  // 確保數據存入
    const orderData = await cursorGetData(database, 'orders');
    myOrder.value = [];
    myOrder.value.push(...orderData); // 展開陣列
    myOrder.value = myOrder.value.filter((item:any) => item.user.email == googleInfo.value.email);

}
</script>