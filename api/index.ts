export const api = {
    allProducts: async()=>{
        const { $api } = useNuxtApp()
        return await $api("GET", "https://vue-course-api.hexschool.io/api/lucy104/products/all","")
    },
    getSingleProduct: async(singleProductId:string)=>{
        const { $api } = useNuxtApp()
        return await $api("GET", `https://vue-course-api.hexschool.io/api/lucy104/product/${singleProductId}`, "")
    },
    addToCart: async(cartModel:any)=>{
        const { $api } = useNuxtApp()
        return await $api("POST", "https://vue-course-api.hexschool.io/api/lucy104/cart", cartModel)
    },
    getOrders: async(getOrderId:string)=>{
        const { $api } = useNuxtApp()
        return await $api("GET", `https://vue-course-api.hexschool.io/api/lucy104/order/${getOrderId}`, "")
    },
    payOrders: async(payOrderId:string)=>{
        const { $api } = useNuxtApp()
        return await $api("POST", `https://vue-course-api.hexschool.io/api/lucy104/pay/${payOrderId}`, "")
    },
    getCart: async()=>{
        const { $api } = useNuxtApp()
        return await $api("GET", "https://vue-course-api.hexschool.io/api/lucy104/cart", "")
    },
    deleteCart: async(id:string)=>{
        const { $api } = useNuxtApp()
        return await $api("DELETE", `https://vue-course-api.hexschool.io/api/lucy104/cart/${id}`, "")
    },
    adminGetProducts: async(page:number)=>{
        const { $api } = useNuxtApp()
        return await $api("GET", `https://vue-course-api.hexschool.io/api/lucy104/admin/products?page=${page}`, "")
    },
    adminLogin: async(loginData:{username: string,password: string })=>{
        const { $api } = useNuxtApp()
        return await $api("POST", "https://vue-course-api.hexschool.io/admin/signin", loginData)
    },
    adminLogout: async()=>{
        const { $api } = useNuxtApp()
        return await $api("POST", "https://vue-course-api.hexschool.io/logout", "")
    },
    uploadImage: async(formData:FormData)=>{
        const { $api } = useNuxtApp()
        return await $api("POST", "https://vue-course-api.hexschool.io/api/lucy104/admin/upload", formData)
    },
    confirmEditProduct: async(id:string,productRequestModel:any)=>{
        const { $api } = useNuxtApp()
        return await $api("PUT", `https://vue-course-api.hexschool.io/api/lucy104/admin/product/${id}`, productRequestModel)
    },
    confirmAddProduct: async(productRequestModel:any)=>{
        const { $api } = useNuxtApp()
        return await $api("POST", "https://vue-course-api.hexschool.io/api/lucy104/admin/product", productRequestModel)
    },
    deleteProduct: async(id:string)=>{
        const { $api } = useNuxtApp()
        return await $api("DELETE", `https://vue-course-api.hexschool.io/api/lucy104/admin/product/${id}`, "")
    },
}











