import {defineComponent, ref} from "vue";
import {ElCollapseTransition, ElContainer, ElHeader, ElIcon, ElMain} from "element-plus";
import {ArrowRight} from "@element-plus/icons-vue";
import BasicViewComponent from "@/components/core/BasicViewComponent.ts";
import {useSlots} from "@/composables/ComposableUseProvider.ts";

const MagPane = defineComponent({
  extends: BasicViewComponent,
  name: "MagPane",
  props: {
    region: {type: String, required: false, default: () => "center"},
    header: {type: String, required: false, default: () => ""},
  },
  setup(props, {attrs, slots, expose}) {
    const componentVisible = ref(props.visible);
    const componentExpanded = ref(props.expanded);

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
      setExpanded: setExpandedFunc
    });

    const createPaneHeader = () => {
      if (props.header) {
        return <ElHeader onclick={setExpandedInternalFunc}
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

    return () => {
      return <ElContainer {...props}
                          {...attrs}
                          v-show={componentVisible.value}
                          class={{
                            "mag-view-card-layout": true,
                            "is-shadow-layout": props.shadow,
                            "is-expanded": componentExpanded.value,
                            "is-collapsed": !componentExpanded.value
                          }}>
        {createPaneHeader()}
        <ElCollapseTransition>
          <ElMain class="mag-view__main" v-show={componentExpanded.value}>
            {useSlots(slots)}
          </ElMain>
        </ElCollapseTransition>
      </ElContainer>
    }
  }
});

export default MagPane;
