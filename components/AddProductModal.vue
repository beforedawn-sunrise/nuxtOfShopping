<template>
    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
    <div class="fixed top-[0px] left-[0px] w-full min-h-screen bg-black bg-opacity-50 flex justify-start  md:justify-center  items-center z-50">
        <div class="w-[900px] h-[650px] bg-white z-60 rounded-[20px]">
            <div class="bg-blue-500 h-[45px] rounded-t-[20px] flex justify-between items-center px-[20px]">
                <p class="text-white font-black text-[22px]">建立自己的產品</p>
                <XMarkIcon class="text-white w-[25px] h-[25px] cursor-pointer" @click="closeProductModal()"></XMarkIcon>
            </div>
            <div class="h-[calc(100%-65px)] p-[10px] flex overflow-y-auto">
                <div class="w-[calc(35%-20px)] h-full mr-[20px]">
                    <p class="text-base py-[15px]">輸入圖片網址:</p>
                    <input  class="w-full h-[35px] rounded-[5px] outline-none border border-gray-500 text-xl" type="text" placeholder="請輸入圖片網址" v-model="tempProduct.imageUrl">

                    <!-- <p class="text-base py-[15px]">或上傳圖片:</p>
                    <input class="w-full h-[35px] rounded-[5px] outline-none border border-gray-500 text-xl" type="file" @change="uploadImg"> -->

                    <img class="w-full object-contain" :src="tempProduct.imageUrl" alt="">
                </div>
                <div class="w-[65%] w-full">
                    <p class="text-base py-[15px]">標題</p>
                    <input class="w-full h-[35px] rounded-[5px] outline-none border border-gray-500 text-xl" type="text" placeholder="請輸入標題" v-model="tempProduct.title">
                    <div class="flex items-center">
                        <div class="w-[calc(50%-20px)] mr-[20px]">
                            <p class="text-base py-[15px]">分類</p>
                            <input class="w-full h-[35px] rounded-[5px] outline-none border border-gray-500 text-xl" type="text" placeholder="請輸入分類" v-model="tempProduct.category">
                        </div>
                        <div class="w-[50%]">
                            <p class="text-base py-[15px]">單位</p>
                            <input class="w-full h-[35px] rounded-[5px] outline-none border border-gray-500 text-xl" type="text" placeholder="請輸入單位" v-model="tempProduct.unit">
                        </div>
                    </div>
                    <div class="flex items-center">
                        <div class="w-[calc(50%-20px)] mr-[20px]">
                            <p class="text-base py-[15px]">原價</p>
                            <input class="w-full h-[35px] rounded-[5px] outline-none border border-gray-500 text-xl" type="number" placeholder="請輸入原價" v-model="tempProduct.origin_price">
                        </div>
                        <div class="w-[50%]">
                            <p class="text-base py-[15px]">售價</p>
                            <input class="w-full h-[35px] rounded-[5px] outline-none border border-gray-500 text-xl" type="number" placeholder="請輸入售價" v-model="tempProduct.price">
                        </div>
                    </div>
                    <p class="text-base py-[15px]">產品描述</p>
                    <textarea class="w-full h-[50px] md:h-[60px] rounded-[5px] outline-none border border-gray-500 text-base md:tex1t-xl" placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
                    <p class="text-base py-[15px]">說明內容</p>
                    <textarea class="w-full h-[50px] md:h-[60px] rounded-[5px] outline-none border border-gray-500 text-base md:text-xl" placeholder="請輸入說明內容" v-model="tempProduct.content"></textarea>
                    <div class="flex justify-end items-center mt-[20px]">
                        <button type="button" class="bg-gray-600 text-white text-xl outline-none border-none mr-[20px] py-[7px] px-[20px] rounded-[5px] cursor-pointer" @click="closeProductModal()">取消</button>
                        <button type="button" class="bg-blue-500 text-white text-xl outline-none border-none py-[7px] px-[20px] rounded-[5px] cursor-pointer" @click="confirm">確認</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/solid";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import _ from 'lodash';
import type { productDetailsModel } from "~/interface/productManageModel";
import { api } from "~/api";

const props = defineProps(
    {
        tempProduct: {
            type: Object as () => productDetailsModel,
            required: true
        },
        closeProductModal: {
            type: Function,
            required: true
        },
        isEdit: {
            type: Boolean,
            required: true
        },
        adminGetProducts: {
            type: Function,
            required: true
        }
    }
);

const isLoading = ref(false);
const tempProduct = ref({
  category: '',
  description: '',
  id: '',
  imageUrl: '',
  origin_price: 0,
  price: 0,
  title: '',
  unit: '',
  content: ''
});

onMounted(() => {
    if(props.isEdit){
        tempProduct.value = _.cloneDeep(props.tempProduct);
    }else{
        tempProduct.value = {
          category: '',
          title: '',
          origin_price: 0,
          price: 0,
          description: '',
          unit: '',
          content: '',
          id: '',
          imageUrl: ''
        };
    }
});

const confirm = async() => {
    if(props.isEdit){
        try{
            isLoading.value = true;
            const requestModel = {
                data:tempProduct.value
            };
            const response = await api.confirmEditProduct(tempProduct.value.id,requestModel);
            if(response.data.success){
                isLoading.value = false;
                props.closeProductModal();
                await props.adminGetProducts();
            }else{
                isLoading.value = false;
                alert("編輯失敗");
            }

        }catch(error){
            console.log(error);
        }
    }else{
        try{
            isLoading.value = true;
            const requestModel = {
                data:tempProduct.value
            };
            const response = await api.confirmAddProduct(requestModel);
            if(response.data.success){
                isLoading.value = false;
                props.closeProductModal();
                await props.adminGetProducts();
            }else{
                isLoading.value = false;
                alert("新增失敗");
            }

        }catch(error){
            console.log(error);
        }

    }
}

const uploadImg = async(event: Event) => {
    isLoading.value = true;
    const uploadedFile = (event.target as HTMLInputElement).files?.[0];
    if (uploadedFile) {
        // 利用formData物件來模擬表單上傳
        const formData = new FormData();
        // 將圖片欄位新增進去
        formData.append('file-to-upload', uploadedFile);

        try {
            // 使用自定義的 API 進行請求
            const response = await api.uploadImage(formData);

            // 如果取得資料成功，就...
            console.log("上傳圖片");

            if (response.data.success) {
                // 取得圖片網址
                isLoading.value = false;
                tempProduct.value.imageUrl = response.data.imageUrl;
            }else{
                isLoading.value = false;
                alert("上傳失敗");
            }
        } catch (error) {
            console.error(error);
            isLoading.value = false;
            alert("上傳失敗，請檢查網路連線或稍後再試");
        }
    }
};


</script>