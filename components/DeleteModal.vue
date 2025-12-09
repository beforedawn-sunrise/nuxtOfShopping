<template>
    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
    <div class="fixed top-[0px] left-[0px] w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white w-[350px] h-[160px] rounded-[10px]">
            <div class="w-full h-[45px] bg-red-600 rounded-t-[10px] pl-[15px] mb-[20px] flex items-center">
                <p class="text-xl text-white font-black">刪除產品</p>
            </div>
            <div class="w-full h-[calc(100%-45px)]">
                <p class="text-xl font-black text-center mb-[20px]">是否要刪除 {{ props.deleteProductName }}?</p>
                <div class="flex items-center justify-end">
                    <button type="button" class="outline-none border-none py-[5px] px-[20px] bg-gray-600 text-white mr-[10px] rounded-[5px] cursor-pointer" @click="closeDeleteModal()">取消</button>
                    <button type="button" class="outline-none border-none py-[5px] px-[20px] bg-red-600 text-white mr-[10px] rounded-[5px] cursor-pointer" @click="deleteProduct()">刪除</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { api } from '../api/index'
const props = defineProps(
    {
        closeDeleteModal: {
            type: Function,
            required: true
        },
        deleteProductId: {
            type: String,
            required: true
        },
        deleteProductName: {
            type: String,
            required: true
        },
        adminGetProducts: {
            type: Function,
            required: true
        }
    }
);

const isLoading = ref(false);


const deleteProduct = async () => {
    isLoading.value = true;
    try {
        const response = await api.deleteProduct(props.deleteProductId);
        if(response.data.success){
            props.closeDeleteModal();
            props.adminGetProducts();
        }
    } catch (error:any) {
        alert(`產品刪除失敗，${error.data.message}`);
    } finally {
        isLoading.value = false;
    }
};

</script>