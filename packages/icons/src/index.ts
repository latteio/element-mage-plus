/* element-plus 图标组件 */
import * as ElIcons from "@element-plus/icons-vue";

/* 自定义组件: 自定义图标, 图标组件 */
import "@/styles/element-mage-icons.scss";
import * as MagIcons from "@/components/components";
import MagIcon from "@/components/core/MagIcon";
import MagIconDialog from "@/components/core/MagIconDialog";

/**
 * 组件注册方法
 * @param app
 */
const install = function (app: any) {
  /* 注册全局图标 */
  /* 注册全局图标: 注册el-icon图标 */
  let elIconObjects: any = ElIcons;
  for (let icon in elIconObjects) {
    app.component(`ElIcon${icon}`, elIconObjects[icon])
  }

  /* 注册全局图标: 注册扩展图标 */
  app.component("MagIcon", MagIcon);
  app.component("MagIconDialog", MagIconDialog);

  let magIconObjects: any = MagIcons;
  for (let icon in magIconObjects) {
    app.component(`MagIcon${icon}`, magIconObjects[icon])
  }
}

export default {
  install,
  ...MagIcons
}
