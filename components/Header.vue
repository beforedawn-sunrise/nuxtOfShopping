<template>
    <nav class="w-full h-[68px] bg-rose-100 p-[15px] flex justify-between items-center z-10">
        <ul class="flex justify-start items-center gap-[20px]">
            <li>
                <NuxtLink to="/" class="text-3xl text-rose-500 font-black">雲購物</NuxtLink>
            </li>
        </ul>
        <ul class="flex flex-col-reverse md:flex-row fixed md:static top-[68px] md:top-[0px] p-[20px] w-[65%] md:w-auto h-[calc(100vh-68px)] md:h-[68px] justify-end md:justify-end items-center gap-x-[20px] flex-col md:flex-row bg-rose-100 z-20 transition-all duration-1000 ease-in-out md:transition-none" :class="{'right-[0px]':isSlide,'right-[-120%]':!isSlide}">
            <li class="mt-[20px] md:mt-0 cursor-pointer w-full md:w-auto">
                <button type="button" class="md:hidden block ml-[5px] py-[5px] px-[15px] rounded-lg bg-rose-500 text-white text-lg font-black" @click="logout" v-if="sessionIsLogin">登出</button>
            </li>
            <li class="mt-[20px] md:mt-0 cursor-pointer w-full md:w-auto">
                <NuxtLink to="/myOrder" class="flex items-center flex-start" @click="isSlide = false">
                    <DocumentDuplicateIcon class="w-[28px] h-[28px] text-rose-500 mr-[5px]"/>
                    <span class="ml-[5px] text-rose-500 text-lg">我的訂單</span>
                </NuxtLink>
            </li>
            <li class="mt-[20px] md:mt-0 cursor-pointer w-full md:w-auto">
                <NuxtLink to="/wishlist" class="flex items-center flex-start"   @click="isSlide = false">
                    <HeartIcon class="w-[28px] h-[28px] text-rose-500 mr-[5px]" />
                    <span class="ml-[5px] text-rose-500 text-lg">願望清單</span>
                </NuxtLink>
            </li>
            <li class="mt-[20px] md:mt-0 cursor-pointer w-full md:w-auto">
                <NuxtLink to="/cart" class="flex items-center flex-start"  @click="isSlide = false">
                    <ShoppingBagIcon  class="w-[28px] h-[28px] text-rose-500 mr-[5px]"/>
                    <span class="ml-[5px] text-rose-500 text-lg">購物清單</span>
                </NuxtLink>
            </li>
            <li class="mt-[20px] md:mt-0 cursor-pointer w-full md:w-auto">
                    <!-- <img :src="googleInfo.picture" class="google-picture" alt="" v-if="googleInfo.picture !== ''"
                        @click="isOpenPersonalInfo = !isOpenPersonalInfo, isSlide = false"> -->
                    <!-- <NuxtLink to="/cart" v-if="googleInfo.picture === ''"> -->
                <div class="flex items-center flex-start">
                    <UserCircleIcon class="w-[28px] h-[28px] text-rose-500 mr-[10px]" @click="isSlide = false" v-if="googleInfo.picture == ''"/>
                    <img :src="googleInfo.picture" class="w-[28px] h-[28px] rounded-[50%] mr-[12px]" alt="" v-if="googleInfo.picture !== ''"
                    @click="isSlide = false">
                    <p class="text-rose-500 text-lg font-black mr-[10px]" v-if="googleInfo.name !== ''">{{ googleInfo.name }}&nbsp;,您好</p>
                    <button type="button" class="md:block hidden ml-[5px] py-[5px] px-[15px] rounded-lg bg-rose-500 text-white text-lg font-black" @click="logout" v-if="sessionIsLogin">登出</button>
                </div>
            </li>
        </ul>
        <Bars3Icon class="w-[35px] h-[35px] text-rose-500 cursor-pointer block md:hidden" @click="isSlide = !isSlide" />
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MagnifyingGlassIcon, ShoppingBagIcon, UserCircleIcon, Bars3Icon } from "@heroicons/vue/24/solid";
import { DocumentDuplicateIcon,HeartIcon } from "@heroicons/vue/24/outline";
import { useSignInStore } from '../stores/signInStore'
import type { orderModel } from "../interface/productManageModel";


const login = useSignInStore();

const isSlide = ref(false);
const googleInfo = ref({
    name: '',
    picture: '',
    email: '',
    tel: '',
    address: ''
})
const sessionIsLogin = ref(false);

const goHome = () => {
    // router.push('/');
    isSlide.value = false;
}

function updateSession() {
    const login = sessionStorage.getItem('sessionIsLogin');
    if (login === 'true') {
        sessionIsLogin.value = true;
    }
    const info = sessionStorage.getItem('sessionGoogleInfo');
    if (info !== null) {
        googleInfo.value = JSON.parse(info);
    }
}

onMounted(() => {
    updateSession();
    window.addEventListener('sessionUpdated', updateSession);

})
onUnmounted(() => {
    window.removeEventListener('sessionUpdated', updateSession);
});

const logout = async() => {
    sessionIsLogin.value = false;
    googleInfo.value = {
        name: '',
        picture: '',
        email: '',
        tel: '',
        address: ''
    };
    sessionStorage.clear();
    localStorage.clear();
    sessionStorage.setItem('sessionIsLogin', JSON.stringify(false));
    isSlide.value = false;
    await navigateTo('/');
    window.location.reload();
    // isOpenPersonalInfo.value = false;
}
</script>
