/* 全局样式文件 */
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/display.css";

/* 自定义配置: ElementPlus, 国际化 */
import ElementPlus from "element-plus";
import elEn from "element-plus/es/locale/lang/en";
import elZhCn from "element-plus/es/locale/lang/zh-cn";

/* 自定义组件: 类型, 组件, 实用工具 */
import "@/styles/element-mage.scss";
import {AppConfiguration} from "@/types";
import {apiRequestInstaller} from "@/utils/ApiRequest";
import {appStorageInstaller} from "@/utils/AppStorage";
import ErrorHandler from "@/utils/ErrorHandler";
import Message from "@/utils/Message";
import Objects from "@/utils/Objects";
import Strings from "@/utils/Strings";

/* 导入自定义组件 */
import * as components from "@/components/components";

/**
 * 组件注册方法
 * @param app
 * @param options
 */
const install = function (app: any, options: AppConfiguration) {
  /* 注册全局变量 */
  app.config['mag_app__app_code'] = options?.code || "NA";

  /* 注册全局方法: 全局错误 Handler */
  app.config.errorHandler = ErrorHandler;
  const {Local, Session} = appStorageInstaller(options);
  const {ApiRequest} = apiRequestInstaller(options, Session);
  app.provide("mag_app__local", Local);
  app.provide("mag_app__session", Session);
  app.provide("mag_app__api_request", ApiRequest);

  /* 注册 ElementPlus + 国际化 */
  /* 注册国际化 */
  const lang: string = options?.lang || 'zh-cn';
  const {zh_cn = {}, en = {}} = options?.locales || {};
  const messages: any = {
    "zh-cn": {
      ...elZhCn,
      ...zh_cn
    },
    "en": {
      ...elEn,
      ...en
    }
  };
  app.use(ElementPlus, {locale: messages[lang]});

  /* 注册全局组件 */
  const componentList = Object.values(components).filter(
      (comp: any) => typeof comp === 'object' && 'name' in comp
  );
  componentList.forEach((comp: any) => {
    app.component(comp.name, comp);
  });

}

export default {
  install,
  ...components,
  methods: {
    appStorageInstaller,
    apiRequestInstaller,
    Message,
    Objects,
    Strings
  }
}
