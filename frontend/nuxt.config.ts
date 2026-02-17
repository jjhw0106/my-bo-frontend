// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8080',
    },
  },
  nitro: {
    routeRules: {
      '/auth/**': { proxy: 'http://localhost:8080/auth/**' },
      '/resume/**': { proxy: 'http://localhost:8080/resume/**' },
    },
  },
})
