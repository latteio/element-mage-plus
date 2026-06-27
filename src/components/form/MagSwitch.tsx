import {defineComponent} from "vue";
import {ElSwitch} from "element-plus";
import MagFlexComponent from "@/components/basic/MagFlexComponent.vue";
import BasicFormComponent from "@/components/core/BasicFormComponent.ts";

const MagSwitch = defineComponent({
  extends: BasicFormComponent,
  name: "MagSwitch",
  props: {
    type: {type: String, required: false, default: () => "switch"},
    activeValue: {type: [Boolean, String, Number], required: false, default: () => 1},
    activeText: {type: String, required: false, default: () => "是"},
    inactiveValue: {type: [Boolean, String, Number], required: false, default: () => 0},
    inactiveText: {type: String, required: false, default: () => "否"}
  },
  setup(props, {attrs}) {
    /**
     * 定义返回模板
     */
    return () => {
      if (props.formType) {
        return <ElSwitch {...props}
                         {...attrs}
                         inline-prompt
                         v-model={props.model[props.prop]}
        />
      }

      return <MagFlexComponent {...props} {...attrs}>
        <ElSwitch {...props}
                  {...attrs}
                  inline-prompt
                  v-model={props.model[props.prop]}
        />
      </MagFlexComponent>
    }
  }
});

export default MagSwitch;
