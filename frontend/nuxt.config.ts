// https://nuxt.com/docs/api/configuration/nuxt-config
const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:9001'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:9001",
    },
  },
  nitro: {
    routeRules: {
      '/auth/**': { proxy: `${process.env.NUXT_PUBLIC_API_BASE}/auth/**` },
      '/resume/**': { proxy: `${process.env.NUXT_PUBLIC_API_BASE}/resume/**` },
      '/my-app-items/**': { proxy: `${process.env.NUXT_PUBLIC_API_BASE}/my-app-items/**` },
    },
  },
})
