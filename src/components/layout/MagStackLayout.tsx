import {defineComponent, ref} from "vue";
import {uuid} from "vue3-uuid";
import BasicViewComponent from "@/components/core/BasicViewComponent.ts";
import {useSlots} from "@/composables/ComposableUseProvider.ts";
import Objects from "@/utils/Objects";

const MagStackLayout = defineComponent({
  extends: BasicViewComponent,
  name: "MagStackLayout",
  props: {},
  setup(props, {attrs, slots}) {
    const componentVisible = ref(props.visible);
    const stackRef = ref();

    /**
     * 定义返回模板
     */
    return () => {
      let stackStyles = [];
      let propValue = Objects.parsePropertyValue(props.width);
      if (!propValue.isPercentage && !propValue.isPixel) {
        throw new Error(`width属性值无效: ${props.width}`);
      }
      if (propValue.isPercentage || propValue.isPixel) {
        stackStyles.push(`width: ${propValue.value}${propValue.unit};`);
      }

      let stackItemId;
      const stackItemNodes = useSlots(slots);
      return <div {...props}
                  {...attrs}
                  ref={stackRef}
                  v-show={componentVisible.value}
                  class={{
                    "mag-view-stack-layout": true,
                    "is-contentful": props.width === "100%"
                  }}
                  style={stackStyles.join(" ")}>
        {stackItemNodes.map((item) => {
          stackItemId = item?.props?.name || "mag-stack-item__" + uuid.v4();

          return typeof (item.type) !== 'symbol'
              && (<div class="mag-stack-item"
                       style={props.space > 0 ? `margin-top: ${props.space}px;` : ""}
                       data-stack-item-id={stackItemId}
                  >
                    {item}
                  </div>
              )
        })}
      </div>
    }
  }
});

export default MagStackLayout;
