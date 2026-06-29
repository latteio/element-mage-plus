import {defineComponent, h, PropType} from "vue";
import {useSlots} from "@/composables/ComposableUseProvider.ts";

const MagFormBar = defineComponent({
  name: "MagFormBar",
  props: {
    position: {type: String, required: false, default: () => "top"},
    align: {type: String, required: false, default: () => "center"},
    size: {type: String as PropType<string>, required: false, default: () => "default"}
  },
  setup(props, {attrs, slots}) {
    /**
     * 定义返回模板
     */
    return () => {
      const childBars: any = useSlots(slots);
      return <div {...props} {...attrs}
                  class="mag-button-group">
        {childBars.map((bar: any) => h(bar, {formType: false, size: props.size}))}
      </div>
    }
  }
});

export default MagFormBar;
