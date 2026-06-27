import {defineComponent, ref} from "vue";
import {ElCol, ElRow} from "element-plus";
import BasicViewComponent from "@/components/core/BasicViewComponent.ts";
import {useSlots} from "@/composables/ComposableUseProvider.ts";

const MagRowLayout = defineComponent({
  extends: BasicViewComponent,
  name: "MagRowLayout",
  props: {},
  setup(props, {attrs, slots}) {
    const componentVisible = ref(props.visible);

    /**
     * 定义返回模板
     */
    return () => {
      let childNodes: any = useSlots(slots);
      return <ElRow {...props}
                    {...attrs}
                    class="mag-view-row-layout"
                    gutter={props.padding}
                    v-show={componentVisible.value}>
        {
          childNodes.map((node: any) => {
            return <ElCol span={node?.props?.span}>
              {node}
            </ElCol>
          })
        }
      </ElRow>
    }
  }
});

export default MagRowLayout;
