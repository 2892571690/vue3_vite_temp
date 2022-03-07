import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入全局router监听
import '@/config/permission.js'

// 引入国际语言
import i18n from '@/lang'


const app = createApp(App)

// layout components
import layoutComp from '@/layouts/components/export';
layoutComp(app);

// 注册字节跳动图标
import iconPark from './utils/icon-park';
iconPark(app);

app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(i18n)
app.mount('#app')
