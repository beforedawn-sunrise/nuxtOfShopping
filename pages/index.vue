<template>
  <div>
    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
    <div>
        <Carousel v-bind="carouselConfig">
            <Slide v-for="slide in productList" :key="slide.id" class="w-full h-[500px]">
                <div class="w-full h-full bg-center bg-cover" :style="{ backgroundImage: 'url(' + slide.imageUrl + ')' }"></div>
            </Slide>

            <template #addons>
                <Navigation />
                <Pagination />
            </template>
        </Carousel>
    </div>
    <div class="w-full h-auto flex justify-center items-center pt-[20px] bg-rose-500">
      <div class="w-[95%] md:w-[90%] flex flex-wrap">
        <div class="w-full sm:w-[calc(50%-30px)] md:w-[calc(25%-30px)]  p-[5px] mr-[20px] mt-[20px] rounded-[20px] bg-rose-200 relative" v-for="item in productList" :key="item.id" :to="`/singleProduct/${item.id}`">
          <NuxtLink :to="`/singleProduct/${item.id}`">
            <div class="w-full h-[250px] mb-[10px] bg-center bg-cover rounded-[20px] cursor-pointer bg-white opacity-100 hover:opacity-50" :style="{ backgroundImage: 'url(' + item.imageUrl + ')' }"></div>
          </NuxtLink>
          <!-- <div class="product-img" :style="{ backgroundImage: 'url(' + item.imageUrl + ')' }" @click="getProductId(item.id)"></div> -->
          <button type="button" class="absolute top-0 right-0 w-[50px] h-[50px] flex justify-center items-center">
              <HeartIcon class="text-rose-500 w-[35px] h-[35px]" v-if="item.isInWishList == false" @click="joinToWishList(item.id)"/>
              <HeartSolid class="text-rose-500 w-[35px] h-[35px]" v-if="item.isInWishList == true" @click="outOfWishList(item.id)"/>
          </button>
          <p class="text-2xl text-rose-500 text-center mb-[10px]">{{ item.title }}</p>
          <p class="text-2xl text-rose-500 text-center mb-[10px]">NT${{ item.price }}元</p>
        </div>
      </div>
    </div>
</div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default' // 使用 default 布局
})
import { ref,reactive,onMounted } from 'vue';
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'; 
import type {productManageModel} from '../interface/productManageModel';
import { api } from '../api/index';
import { HeartIcon } from "@heroicons/vue/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/vue/24/solid";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
const carouselConfig = {
    itemsToShow: 1,
    wrapAround: true
}

const isLoading = ref(false);

let productList = ref([] as productManageModel[]);

const wishList = ref([] as productManageModel[]);
// 獲取所有產品資料
const getAllProducts = async () => {
  try {
    isLoading.value = true;
    const response = await api.allProducts();
    if (response.data.success) {
      isLoading.value = false;
      productList.value = response.data.products;
      for (let product of productList.value) {
        product.isInWishList = false; // 初始化願望清單狀態
      }
    }
  } catch (error) {
    console.error('獲取產品資料失敗:', error);
  }
};
// 在組件載入時獲取資料
onMounted(async() => {
  await getAllProducts();
  nextTick(()=>{
    wishList.value = JSON.parse(localStorage.getItem("wishList") || "[]");
    // 根據願望清單更新產品列表的狀態
    for (let wishItem of wishList.value) {
      const product = productList.value.find(p => p.id === wishItem.id);
      if (product) {
        product.isInWishList = true;
      }
    }
  });
});

const joinToWishList = (productId: string) => {
  // 直接找目標商品，避免索引為 -1 導致 undefined 錯誤
  const target = productList.value.find(item => item.id === productId);
  if (!target) return;
  target.isInWishList = true;
  const wishListIndex = wishList.value.findIndex(item => item.id === productId);
  if (wishListIndex === -1) {
    wishList.value.push(target);
    localStorage.setItem('wishList', JSON.stringify(wishList.value));
  }
};

const outOfWishList = (productId: string) => {
  const target = productList.value.find(item => item.id === productId);
  if (!target) return;
  target.isInWishList = false;
  const wishListIndex = wishList.value.findIndex(item => item.id === productId);
  if (wishListIndex !== -1) {
    wishList.value.splice(wishListIndex, 1);
    localStorage.setItem('wishList', JSON.stringify(wishList.value));
  }
};
</script>