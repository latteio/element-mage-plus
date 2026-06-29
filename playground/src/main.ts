import {createApp} from 'vue';
import ElementMage from '@element-mage-plus/components';
import {appConfig} from "./appconfig";
import router from './router';
import App from '@/App.vue';

const app = createApp(App);

/* 加载组件 */
app.use(ElementMage, appConfig);

/* 加载路由 */
app.use(router);

/* 挂载app */
app.mount('#app');
