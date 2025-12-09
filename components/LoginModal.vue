<template>
    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
    <form v-if="sessionIsLogin == false || sessionIsLogin == null" class="fixed inset-0 w-full h-screen flex justify-center items-center z-50 bg-white/75" @submit.prevent="backStageLogin">
        <div class=" w-[95%] sm:w-[400px]  h-[400px] bg-rose-200 border border-rose-500 p-[15px] rounded-lg shadow-lg">
            <div class="bg-orange-200  flex justify-center items-center mb-[20px] p-[5px]" v-if="warningMessage">
                <p class="text-orange-700 text-base font-black">登入失敗</p>
            </div>
            <div class="flex justify-center items-center">
                <p class="text-[22px] text-rose-500 font-black mr-[10px]">帳號:</p>
                <input type="text" v-model="loginData.username" class="w-[75%] h-[35px] bg-white rounded-lg pl-[20px] outline-0 text-base font-black text-rose-500">
            </div>
            <div class="flex justify-center items-center mt-[20px]">
                <p class="text-[22px] text-rose-500 font-black mr-[10px]">密碼:</p>
                <input type="password" v-model="loginData.password" class="w-[75%] h-[35px] bg-white rounded-lg pl-[20px] outline-0 text-base font-black text-rose-500">
            </div>
            <div class="flex justify-center items-center mt-[20px]">
                <button class="w-[80%] bg-rose-600 py-[5px] rounded-md text-white cursor-pointer" @keyup.enter="backStageLogin()"  @click="backStageLogin">登入</button>
            </div>
            <hr class="border-rose-600 mt-[20px]">
            <p class="text-xl text-center text-rose-500 font-black">一般訪客請用google登入</p>
            <div class="flex justify-center items-center mt-[20px]">
                <ClientOnly>
                    <GoogleSignInButton @success="googleLoginSuccess" @error="warningMessage = true" />
                </ClientOnly>
            </div>
        </div>
    </form>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { jwtDecode } from "jwt-decode";
import type { googleInfoModel } from "../interface/googleSignInModel";
import { useSignInStore } from "../stores/signInStore";
import { api } from "../api";
const login = useSignInStore();

const loginData = ref({
    username: '',
    password: ''
})

const isLoading = ref(false);
const warningMessage = ref(false);

const backStageLogin = async () => {
    isLoading.value = true;
    try {
        // 模擬後台登入驗證
        const response = await api.adminLogin(loginData.value);
        if(response.data.success){
            sessionStorage.setItem("userToken", JSON.stringify(response.data.token));
            sessionIsLogin.value = true;
            isLoading.value = false;
            await navigateTo('/backStage/products');
        }else{
            warningMessage.value = true;
            isLoading.value = false;
        }
    } catch (error) {
        warningMessage.value = true;
        isLoading.value = false;
    }
}
const sessionIsLogin = ref(false);

const googleLoginSuccess = async (response: any) => {
    if (response.credential) {
        const credential: googleInfoModel = jwtDecode(response.credential);
        login.googleInfo = {
            name: credential.name,
            picture: credential.picture,
            email: credential.email,
            tel: '',
            address: ''
        }
        sessionStorage.setItem('sessionIsLogin', JSON.stringify(true));
        sessionIsLogin.value = true;
        sessionStorage.setItem('sessionGoogleInfo', JSON.stringify(login.googleInfo));
        window.dispatchEvent(new Event('sessionUpdated'));
        localStorage.clear();
        login.isLogin = true;
        const route = useRoute()
        // route.path 會是 /orders 或 /orders/detail
        if (route.path.startsWith('/myOrder')) {
            navigateTo('/myOrder?refresh=' + Date.now(), { replace: true })
        }
    }
}

onMounted(() => {
    const login = sessionStorage.getItem('sessionIsLogin');
    if(login == null || login === 'false'){
        sessionIsLogin.value = false;
    }else{
        sessionIsLogin.value = true;
    }
});
</script>