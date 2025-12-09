import { defineStore } from "pinia";
// import ConnectApi from "../api/connect";
import type { googleInfoModel } from "../interface/googleSignInModel";
// import router from "../router/index";

export const useSignInStore = defineStore("SignInStore", {
  state: () => ({
    googleInfo: {
      name: "",
      picture: "",
      email: "",
      tel: "",
      address: "",
    } as googleInfoModel,
    isLogin: false,
  }),

  getters: {},

  actions: {
  },
});
