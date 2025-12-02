import { defineConfig, ConfigEnv, UserConfig } from 'vite'
import path from 'path'
// vite.config.ts中无法使用import.meta.env 所以需要引入
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// 增加 vue文件 script name值
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
// 生产gz文件
import viteCompression from 'vite-plugin-compression'

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  return {
    /* base: '/vue-admin-simple/', */
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    },
    plugins: [
      vue(),
      vueSetupExtend(),
      /* AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }), */
      // * 使用 svg 图标
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      // gzip压缩 生产环境生成 .gz 文件
      mode === 'production' &&
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240,
          algorithm: 'gzip',
          ext: '.gz',
        }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/index.scss" as *;`,
        },
      },
    },
    // 配置别名
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        static: resolve('public/static'),
      },
      // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    //启动服务配置
    server: {
      // 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0" 也可设置成你的ip地址
      host: '0.0.0.0',
      port: 5173,
      open: true,
      https: false,
      cors: true,
      // 代理跨域（模拟示例）
      proxy: {
        '/api': {
          // target: 'http://175.178.81.113',
          target: 'http://localhost:8718/',
          // target: 'http://www.zhihuixiaoyuangm.icu:8082/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/openweathermap': {
          target: 'https://api.openweathermap.org/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/openweathermap/, ''),
        },
        '/amap': {
          target: 'https://restapi.amap.com/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/amap/, ''),
        },
      },
    },
    // 生产环境打包配置
    //去除 console debugger
    // esbuild: {
    //   pure:mode==='production' ? ["console.log", "debugger"] : []
    // },

    build: {
      outDir: 'docs',
      //   terserOptions: {
      //     compress: {
      //       drop_console: true,
      //       drop_debugger: true,
      //     },
      //   },
    },
  }
})
function AutoImport(arg0: { resolvers: any[] }): import('vite').PluginOption {
  throw new Error('Function not implemented.')
}

function Components(arg0: { resolvers: any[] }): import('vite').PluginOption {
  throw new Error('Function not implemented.')
}

function ElementPlusResolver(): any {
  throw new Error('Function not implemented.')
}
