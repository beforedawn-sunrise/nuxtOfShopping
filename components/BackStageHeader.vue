<template>
    <nav class="w-full h-[68px] bg-black flex justify-between items-center p-[20px]">
        <!-- sm才會出現的hamburger -->
        <Bars3Icon class="block sm:hidden text-white w-[35px] h-[35px] cursor-pointer" @click="isSlide = !isSlide" />
        <!-- sm才會出現的title -->
        <p class="block sm:hidden text-white font-black text-3xl" @click="isSlide = false">管理系統</p>
        <!-- sm才會出現的backdrop -->
        <div class="block sm:hidden fixed top-[68px] left-0 w-full min-h-screen bg-white/75 z-40" @click="isSlide = false" v-if="isSlide == true"></div>
        <ul class="flex flex-col sm:flex-row justify-start items-center sm:static fixed top-[68px] sm:top-0 left-[-55%] sm:left-[0px] sm:w-auto w-[45%] h-[calc(100vh-68px)] sm:h-auto bg-black transition-all duration-800 ease-in z-50" :class="{'left-[0px]': isSlide}">
            <!-- 大於sm才會出現的標題 -->
            <li class="mr-[20px] cursor-pointer hidden sm:block text-white text-3xl font-black" @click="isSlide = false">
                <NuxtLink to="/backStage/products">管理系統</NuxtLink>
            </li>
            <li class="mr-[0px] sm:mr-[20px] pl-[20px] cursor-pointer text-[25px] sm:text-lg text-white sm:inline-block block sm:w-auto w-full sm:mt-[0px] mt-[10px] hover:bg-gray-500" @click="isSlide = false">
                <NuxtLink to="/backStage/products">產品管理</NuxtLink>
            </li>
            <li class="mr-[0px] sm:mr-[20px] pl-[20px] cursor-pointer text-[25px] sm:text-lg text-white sm:inline-block block sm:w-auto w-full sm:mt-[0px] mt-[10px] hover:bg-gray-500" @click="isSlide = false">
                <NuxtLink to="/backStage/orders">訂單管理</NuxtLink>
            </li>
        </ul>
        <button class="bg-gray-500 text-white text-xl py-[5px] px-[10px] rounded-[5px] cursor-pointer" @click="adminLogout">登出</button>
    </nav>
</template>
<script setup lang="ts">
import { Bars3Icon } from "@heroicons/vue/24/solid";
import { api } from "../api";
import { useSignInStore } from "../stores/signInStore";

const login = useSignInStore();
const isSlide = ref(false);

const adminLogout = async () => {
    try {
        const response = await api.adminLogout();
        if(response.data.success){
            login.isLogin = true;
            sessionStorage.clear();
            localStorage.clear();
            sessionStorage.setItem('sessionIsLogin', JSON.stringify(false));
            await navigateTo('/');
        }
    } catch (error) {
        console.log(error);
    }
}

</script>