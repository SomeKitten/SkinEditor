// vite.config.js
/**
 * @type {import('vite').UserConfig}
 */
export default {
  // config options
  build: {
    outDir: 'docs',
  },
  server: {
    port: 3000,
  },
  assetsInclude: ['**/*.png'],
  base: './',
}
