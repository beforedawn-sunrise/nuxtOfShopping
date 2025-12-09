<template>
<div>
    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
    <div class="w-[calc(100%-10px)] md:w-[calc(100%-40px)] min-h-[calc(100%-40px)] p-[5px] md:p-[20px] flex justify-center">
        <div class="w-[95%] md:w-[90%] flex flex-col md:flex-row">
            <div class="w-full md:w-[calc(65%-20px)] h-[520px] mr-[20px] bg-center bg-cover cursor-pointer" :style="{ backgroundImage: 'url(' + singleProduct.imageUrl + ')' }"></div>
            <div class="w-full md:w-[35%] h-full">
                <p class="text-[25px] font-black mt-[20px]">{{ singleProduct.title }}</p>
                <p class="text-base text-gray-800 mt-[10px]">{{ singleProduct.description }}</p>
                <span class="text-base text-gray-800 line-through mt-[20px]">原價:{{ singleProduct.origin_price }}</span>
                <span class="text-xl font-black mt-[20px]">售價:{{ singleProduct.price }}</span>
                <p class="text-xl mt-[30px]">{{ singleProduct.content }}</p>
                <div class="flex mt-[20px]">
                    <p class="text-xl mr-[10px]">數量:</p>
                    <select calss="h-[25px] border !border-[1px] !border-solid !border-black rounded-5px bg-white text-base" v-model="quantity">
                        <option class="h-[25px] border !border-[1px] !border-solid !border-black rounded-5px bg-white text-base" v-for="item in 10" :value="item" :key="item">{{ item }}{{ singleProduct.unit }}</option>
                    </select>
                </div>
                <p class="text-xl mt-[20px]">小計 台幣: {{ singleProduct.price * quantity }} 元</p>
                <button type="button" class="w-full py-[5px] flex justify-center items-center bg-cyan-500 text-white text-base border-none rounded-[5px] cursor-pointer mt-[30px]" @click="addtoCart">加入購物車</button>
            </div>
        </div>
    </div>
</div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { api } from '../../api/index'
import type { productManageModel } from '~/interface/productManageModel';
const route = useRoute()
const id = route.params.id as string;
const isLoading = ref(false);
const singleProduct = ref({} as productManageModel);
const quantity = ref(1);

const getSingleProduct = async()=>{
    isLoading.value = true;
    const response = await api.getSingleProduct(id);
    if(response.data.success){
        isLoading.value = false;
        singleProduct.value = response.data.product;
    }
}


const addtoCart = async()=>{
    isLoading.value = true;
    const cart = {
        data:{
            product_id: singleProduct.value.id,
            qty: quantity.value
        }
    }
    const response = await api.addToCart(cart);
    if(response.data.success){
        isLoading.value = false;
        alert('已加入購物車');
    }
}

onMounted(async()=>{
    await getSingleProduct();
})

</script>