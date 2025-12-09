<template>
    <div>
        <AddProductModal :closeProductModal="closeProductModal" :adminGetProducts="adminGetProducts" :isEdit="isEdit" :tempProduct="tempProduct" v-if="isOpenProductModal"></AddProductModal>
        <DeleteProductModal :adminGetProducts="adminGetProducts" :deleteProductName="deleteProductName" :closeDeleteModal="closeDeleteModal" :deleteProductId="deleteProductId" v-if="isOpenDeleteModal"></DeleteProductModal>
        <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
        <h1 class="text-center text-[32px] font-black mb-[20px] mt-[20px]">產品列表</h1>
        <div class="w-full flex flex-col md:flex-row items-end md:items-center justify-end m-[10px]">
            <div class="flex items-center md:mb-[0px] mb-[20px] sm:mt-[0px] mt-[20px]">
                <p class="text-base font-black mr-[5px]">產品名稱搜尋:</p>
                <input class="h-[30px] pl-[10px] mr-[20px] outline-none border border-black rounded-[5px]" type="text" placeholder="請輸入產品名稱" v-model="productNameSearch">
            </div>
            <div class="flex items-center md:mb-[0px] mb-[20px]">
                <p class="text-base font-black mr-[5px]">排序:</p>
                <select class="h-[35px] rounded-[5px] border border-sky-500 mr-[20px] outline-none" v-model="sort">
                    <option class="border border-sky-500" value="0">售價由高至低</option>
                    <option class="border border-sky-500" value="1">售價由低至高</option>
                    <!-- <option value="2">按產品分類排序</option> -->
                </select>
            </div>

            <button type="button" class="h-[35px] bg-sky-500 text-white font-black text-sm py-[5px] px-[20px] border-none rounded-[5px] cursor-pointer mr-[20px] flex justify-center items-center tracking-wider" @click="addProduct">新增產品</button>
        </div>
        <div class="w-full h-[auto] mt-[30px] rounded-[20px] ovrerflow-y-auto overflow-x-auto">
            <table class="w-full border-separate border-spacing-[0px] relative">
                <thead>
                    <tr>
                        <th class="bg-sky-500 text-white border-b-2 border-white w-[100px] h-[45px] whitespace-nowrap text-base">分類</th>
                        <th class="bg-sky-500 text-white border-b-2 border-white w-[100px] h-[45px] whitespace-nowrap text-base">產品名稱</th>
                        <th class="bg-sky-500 text-white border-b-2 border-white w-[100px] h-[45px] whitespace-nowrap text-base">原價</th>
                        <th class="bg-sky-500 text-white border-b-2 border-white w-[100px] h-[45px] whitespace-nowrap text-base">售價</th>
                        <th class="bg-sky-500 text-white border-b-2 border-white w-[100px] h-[45px] whitespace-nowrap text-base">編輯</th>
                        <th class="bg-sky-500 text-white border-b-2 border-white w-[100px] h-[45px] whitespace-nowrap text-base">刪除</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="bg-white even:bg-sky-200 hover:bg-sky-100 text-black" v-for="item in filterProducts" :key="item.id">
                        <td class="py-[10px] w-[100px] font-black whitespace-nowrap text-center text-base border-b border-dotted border-sky-500">{{ item.category }}</td>
                        <td class="py-[10px] w-[100px] font-black whitespace-nowrap text-center text-base border-b border-dotted border-sky-500">{{ item.title }}</td>
                        <td class="py-[10px] w-[100px] font-black whitespace-nowrap text-center text-base border-b border-dotted border-sky-500">{{ item.origin_price }}</td>
                        <td class="py-[10px] w-[100px] font-black whitespace-nowrap text-center text-base border-b border-dotted border-sky-500">{{ item.price }}</td>
                        <td class="py-[10px] w-[100px] font-black whitespace-nowrap text-center text-base border-b border-dotted border-sky-500">
                          <button type="button" class="bg-sky-500 text-base text-white py-[3px] px-[10px] rounded-[5px] border-none outline-none cursor-pointer" @click="edit(item.id)">編輯</button>
                          <!-- <button type="button" class="bg-sky-500 text-base text-white py-[3px] px-[10px] rounded-[5px] border-none outline-none cursor-pointer" @click="edit(item.id)">編輯</button> -->
                        </td>
                        <td class="py-[10px] w-[100px] font-black whitespace-nowrap text-center text-base border-b border-dotted border-sky-500">
                          <button type="button" class="bg-red-600 text-base text-white py-[3px] px-[10px] rounded-[5px] border-none outline-none cursor-pointer" @click="openDeleteModal(item.id,item.title)">刪除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full h-[50px] flex items-center justify-end">
            <button type="button" class="py-[5px] px-[20px] text-sky-500 border border-sky-500 m-[10px] cursor-pointer" v-if="pagination.has_pre"> 上一頁 </button>
            <button type="button" class="py-[5px] px-[20px] text-sky-500 border border-sky-500 m-[10px] cursor-pointer" v-for="item in pagination.total_pages" @click="adminGetProducts(item)"> {{ item }}</button>
            <button type="button" class="py-[5px] px-[20px] text-sky-500 border border-sky-500 m-[10px] cursor-pointer" v-if="pagination.has_next">下一頁</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { api } from '../../api/index';
import type { productDetailsModel } from '../../interface/productManageModel';
import AddProductModal from '~/components/AddProductModal.vue';
import DeleteProductModal from '~/components/DeleteModal.vue';
import _ from 'lodash';


definePageMeta({
  layout: 'back-stage-layout'// 使用 back-stage-layout 布局
})
const productNameSearch = ref('');
const sort = ref(0);
const products = ref([] as productDetailsModel[]);
const pagination = ref({
    category: null,
    current_page: 1,
    has_next: true,
    has_pre: false,
    total_pages: 1
});

const isOpenProductModal = ref(false);
const isOpenDeleteModal = ref(false);
const isEdit = ref(false);
const addProduct = () => {
    isOpenProductModal.value = true;
    isEdit.value = false;
}

const deleteProductId = ref('');
const deleteProductName = ref('');
const openDeleteModal = (id: string,productName:string) => {
    isOpenDeleteModal.value = true;
    deleteProductId.value = id;
    deleteProductName.value = productName;
}

const closeDeleteModal = () => {
    isOpenDeleteModal.value = false;
}
const closeProductModal = () => {
    isOpenProductModal.value = false;
}

const tempProduct = ref({} as productDetailsModel);

const edit = (id: string) => {
    isOpenProductModal.value = true;
    isEdit.value = true;
    const editProduct = products.value.find((item:productDetailsModel) => item.id === id);
    if(editProduct !== null && editProduct !== undefined) {
        tempProduct.value = _.cloneDeep(editProduct);
    }
}

const adminGetProducts = async (page = 1) => {
  try {
    isLoading.value = true;
    const response = await api.adminGetProducts(page);
    if (response.data.success) {
      products.value = response.data.products;
      pagination.value = response.data.pagination;
      isLoading.value = false;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};


onMounted(async() => {
  await adminGetProducts();
});

const filterProducts = computed(() => {
    const filter = products.value.filter(item => item.title.includes(productNameSearch.value));
    switch (Number(sort.value)) {
        case 0:
            return [...filter].sort((a: any, b: any) => b.price - a.price);
            break;
        case 1:
            return [...filter].sort((a: any, b: any) => a.price - b.price);
            break;
        // case 2:
        //     const categoryOrder = ["生活用品", "美妝", "數位"];
        //     return [...filter].sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
        //     break;
        default:
            return filter; // 預設不排序
    }

});

const isLoading = ref(false);


</script>