import {createApp} from 'vue';
import ElementMagePlus from './element-mage-plus';
import {appConfig} from "./appconfig";
import router from './router';
import App from '@/App.vue';

const app = createApp(App);

/* 加载组件 */
app.use(ElementMagePlus, appConfig);

/* 加载路由 */
app.use(router);

/* 挂载app */
app.mount('#app');
