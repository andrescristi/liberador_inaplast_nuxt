export default defineAppConfig({
  ui: {
    primary: 'indigo',
    gray: 'slate',
    notifications: {
      position: 'top-0 bottom-auto'
    },
    tooltip: {
      default: {
        openDelay: 500
      }
    }
  },
  domain: {
    production: 'https://liberador-inaplast-nuxt.vercel.app'
  }
})