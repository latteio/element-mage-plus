import {defineComponent, ref} from "vue";
import {ElCollapseTransition, ElContainer, ElHeader, ElIcon, ElMain, ElTabs} from "element-plus";
import {ArrowRight} from "@element-plus/icons-vue";
import BasicViewComponent from "@/components/core/BasicViewComponent.ts";
import {useInvoke, useSlots} from "@/composables/ComposableUseProvider.ts";

const MagTabGroup = defineComponent({
  extends: BasicViewComponent,
  name: "MagTabGroup",
  props: {
    type: {type: String, required: false, default: () => "border-card"},
    region: {type: String, required: false, default: () => "center"},
    header: {type: String, required: false, default: () => ""},
    active: {type: String, required: true, default: () => "0"},
    stretch: {type: Boolean, required: false, default: () => false}
  },
  setup(props, {attrs, slots, expose}) {
    const componentRef = ref();
    const componentVisible = ref(props.visible);
    const componentExpanded = ref(props.expanded);
    const currentTab = ref(props.active);

    /**
     * 设置组件展开 / 收缩
     */
    const setExpandedInternalFunc = () => {
      setExpandedFunc(!componentExpanded.value);
    }
    const setExpandedFunc = (paramExpanded: boolean) => {
      componentExpanded.value = paramExpanded;
    }

    /**
     * 定义组件外部方法
     */
    expose({
      setVisible: (visible: boolean) => {
        componentVisible.value = visible;
      },
      setExpanded: setExpandedFunc,
      invoke: function (methodName: string, ...args: any[]) {
        return useInvoke(componentRef, methodName, args);
      }
    });

    /**
     * TabGroup的头部定义
     */
    const createTabGroupHeader = () => {
      if (props.header) {
        return <ElHeader onClick={setExpandedInternalFunc}
                         class={{
                           "mag-view__header": true,
                           "is-expanded": componentExpanded.value,
                           "is-collapsed": !componentExpanded.value,
                         }}>
          <div class="mag-view__header-text">{props.header}</div>
          <div class="mag-view__header-icon">
            {
              componentExpanded.value
                  ? (<ElIcon class="is-expanded"><ArrowRight/></ElIcon>)
                  : (<ElIcon><ArrowRight/></ElIcon>)
            }
          </div>
        </ElHeader>
      } else {
        return <ElHeader class="mag-view__header-empty">
        </ElHeader>
      }
    }

    /**
     * 定义返回模板
     */
    return () => (
        <ElContainer v-show={componentVisible.value}
                     class={{
                       "mag-view-card-layout": true,
                       "is-shadow-layout": props.shadow,
                       "is-expanded": componentExpanded.value,
                       "is-collapsed": !componentExpanded.value
                     }}>
          {createTabGroupHeader()}
          <ElCollapseTransition>
            <ElMain class="mag-tabgroup__main" v-show={componentExpanded.value}>
              <ElTabs  {...props} {...attrs} ref={componentRef} v-model={currentTab.value}
                       class="mag-view-card-layout is-borderless-layout">
                {useSlots(slots)}
              </ElTabs>
            </ElMain>
          </ElCollapseTransition>
        </ElContainer>
    )
  }
});

export default MagTabGroup;
