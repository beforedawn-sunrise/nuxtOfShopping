<template>
    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
    <div class="w-full min-h-[calc(100vh-68px)] bg-rose-500 flex items-center justify-center flex-col">
        <div class="w-[95%] sm:w-[90%]">
            <div class="w-full mt-[30px] rounded-[20px] overflow-y-auto">
                <table class="w-full border-collapse border-spacing-0 relative overflow-x-scroll">
                    <thead>
                        <tr>
                            <th class="w-100px h-[45px] bg-rose-700 text-white border-b-2 border-white"></th>
                            <th class="w-100px h-[45px] bg-rose-700 text-white border-b-2 border-white">品名</th>
                            <th class="w-100px h-[45px] bg-rose-700 text-white border-b-2 border-white">數量</th>
                            <th class="w-100px h-[45px] bg-rose-700 text-white border-b-2 border-white">單價</th>
                            <th class="w-100px h-[45px] bg-rose-700 text-white border-b-2 border-white">總價</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white text-black even:bg-rose-200 hover:bg-rose-300" v-for="item in cart" :key="item.id">
                            <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500">
                                <button type="button" class="bg-rose-500 text-white text-sm border-none outline-none rounded-[5px] cursor-pointer py-[5px] px-[10px]" @click="deleteCarts(item.id)">刪除</button>
                            </td>
                            <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500">{{ item.product.title }}</td>
                            <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500">{{ item.qty }}</td>
                            <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500">{{ item.product.price }}</td>
                            <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-500">{{ item.final_total }}</td>
                        </tr>
                        <tr class="bg-white text-black even:bg-rose-200 hover:bg-rose-300">
                            <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-200">總計:</td>
                            <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-200"></td>
                            <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-200"></td>
                            <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-200"></td>
                            <td class="py-[10px] w-[100px] whitespace-nowrap text-center border-b-1 border-dotted border-rose-200">{{ finalTotal }}元</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="w-[85%] sm:w-[75%] mt-[20px]">
            <p class="text-xl sm:text-[28px] text-white font-black mb-[20px]">請填寫: 訂單聯絡人資料</p>
            <p class="text-lg text-white mb-[20px]">Email :</p>
            <input type="email" class="mb-[20px] w-[calc(100%-15px)] h-[25px] text-xl border-none outline-none pl-[15px] rounded-[5px]" v-model="googleInfo.email" readonly>
            <p class="text-lg text-white mb-[20px]">收件人姓名 :</p>
            <input type="text" class="mb-[20px] w-[calc(100%-15px)] h-[25px] text-xl border-none outline-none pl-[15px] rounded-[5px]" v-model="googleInfo.name" readonly>
            <p class="text-lg text-white mb-[20px]">收件人電話 :</p>
            <input type="tel" class="mb-[20px] w-[calc(100%-15px)] h-[25px] text-xl border-none outline-none pl-[15px] rounded-[5px]" v-model="googleInfo.tel">
            <p class="text-lg text-white mb-[20px]">收件人地址 :</p>
            <input type="text" class="mb-[20px] w-[calc(100%-15px)] h-[25px] text-xl border-none outline-none pl-[15px] rounded-[5px]" v-model="googleInfo.address">
            <div class="flex items-center justify-end mt-[20px] mb-[20px]">
                <button type="button" class="bg-rose-200 text-rose-500 rounded-[5px] py-[5px] px-[10px] text-lg font-black cursor-pointer" @click="createOrder">送出</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../api/index';
import type { cartModel } from '../interface/productManageModel';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { openDB, addData, cursorGetData, cursorGetDataByIndex } from '../utils/indexedDB';
import _ from 'lodash';

const router = useRouter()
const isLoading = ref(false);
const cart = ref([] as cartModel[]);
const total = ref(0);
const finalTotal = ref(0);
const googleInfo = ref({
    name: "",
    picture: "",
    email: "",
    tel: "",
    address: ""
});


const getCarts = async () => {
    try {
        isLoading.value = true;
        const response = await api.getCart();
        cart.value = response.data.carts;
        isLoading.value = false;
        cart.value = response.data.data.carts;
        total.value = response.data.data.total;
        finalTotal.value = response.data.data.final_total;
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
};

const deleteCarts = async (id: string) => {
    try {
        isLoading.value = true;
        const response = await api.deleteCart(id);
        if(response.data.success){
            await getCarts();
            isLoading.value = false;
        }
    } catch (error) {
        console.error('Error deleting cart item:', error);
    }
};

onMounted(() => {
    nextTick(async()=>{
        sessionStorage.getItem('sessionGoogleInfo');
        if(sessionStorage.getItem('sessionGoogleInfo')){
            googleInfo.value = JSON.parse(sessionStorage.getItem('sessionGoogleInfo') as string);
        }
        await getCarts();
    })
});

const createOrder = async () => {
    // isLoading.value = true;
    const data = _.cloneDeep({
        id: Math.floor(Math.random() * 1000),
        products: cart.value,
        user: googleInfo.value,
        isPaid: false,
        finalTotal: finalTotal.value
    });
    let database;

    try {
        const db = await openDB('orderDB', 2);
        database = db;
        await addData(database, 'orders', data);
        await router.push('/myOrder');      // 確保頁面跳轉
    } catch (error) {
        console.error("Error storing data or navigating:", error);
    }

}
</script>