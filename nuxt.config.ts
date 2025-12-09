// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    preset: "github-pages"
  },
  app: {
    baseURL: "/nuxtOfShopping/",
    buildAssetsDir: "assets",
    head: {
      meta: [
        {
          name: 'title',
          content: '雲購物'
        },
        {
          name: 'keywords',
          content: '雲購物, 購物, 商品, 電商, 特價, 熱銷'
        },
        {
          name: 'description',
          content: '雲購物,這裡提供各種精選商品，立即選購！'
        }
      ]
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    'nuxt-vue3-google-signin',
    'vue3-carousel-nuxt',
    'nuxt-lodash'
  ],
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'zh-CN', file: 'zhCN.json' },
      { code: 'zh-TW', file: 'zhTW.json' }
    ],
    defaultLocale: 'zh-TW',
    langDir: '../locales'
  },
  googleSignIn: {
    clientId: '1060886382609-ijojcm74see9gffgq3mn54pa2d6701t5.apps.googleusercontent.com',
  }
})