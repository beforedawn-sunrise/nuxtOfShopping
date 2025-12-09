import axios from "axios";
import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin(() => {
  const instance = axios.create();

  // ======= request 攔截器（搬 auth.ts 的邏輯）=======
  instance.interceptors.request.use((config) => {
    const userToken = sessionStorage.getItem("userToken");

    if (userToken) {
      const token = JSON.parse(userToken);
      config.headers = config.headers || {};
      config.headers["Authorization"] = token;
    }

    // 如果是 FormData，讓 axios 自動處理 Content-Type（包含 boundary）
    // 不要手動設定，否則會缺少 boundary 參數
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  });

  // ======= response 攔截器（你原本的）=======
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            console.log("你要找的頁面不存在");
            break;
          case 500:
            console.log("程式發生問題");
            break;
          default:
            console.log(error.message);
        }
      }

      if (!navigator.onLine) {
        alert("網路出了點問題，請重新連線後重整網頁");
        return;
      }

      return Promise.reject(error);
    }
  );

  function connectApi<T>(method: string, url: string, data: T) {
    method = method.toLowerCase();
    switch (method) {
      case "post": return instance.post(url, data);
      case "get": return instance.get(url, { params: data });
      case "delete": return instance.delete(url, { params: data });
      case "put": return instance.put(url, data);
      case "patch": return instance.patch(url, data);
      default:
        console.log(`未知方法: ${method}`);
        return Promise.reject();
    }
  }

  return {
    provide: { api: connectApi }
  };
});
