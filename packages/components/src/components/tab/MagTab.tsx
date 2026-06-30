import {defineComponent, h, ref} from "vue";
import {ElIcon, ElTabPane} from "element-plus";
import BasicViewComponent from "@/components/core/BasicViewComponent.ts";
import {useInvoke, useSlots} from "@/composables/ComposableUseProvider.ts";

const MagTab = defineComponent({
  extends: BasicViewComponent,
  name: "MagTab",
  props: {
    header: {type: String, required: false, default: () => ""},
    icon: {type: [String, Object], required: false, default: () => null},
    name: {type: String, required: true, default: () => "0"}
  },
  setup(props, {attrs, slots, expose}) {
    const componentRef = ref();

    /**
     * 定义组件外部方法
     */
    expose({
      invoke: function (methodName: string, ...args: any[]) {
        return useInvoke(componentRef, methodName, args);
      }
    });

    /**
     * 定义 tab 的图标
     */
    const createTabIcon = () => {
      return props.icon
          ? (
              <div class="mag-view__header">
                <ElIcon>
                  {h(props.icon)}
                </ElIcon>
                <span>{props.header}</span>
              </div>
          )
          : <div class="mag-view__header">{props.header}</div>
    }

    /**
     * 定义返回模板
     */
    return () => (
        <ElTabPane {...props} {...attrs} ref={componentRef} v-slots={{
          label: () => createTabIcon()
        }}>
          {useSlots(slots)}
        </ElTabPane>
    )
  }
});

export default MagTab;
