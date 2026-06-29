import {defineComponent} from "vue";
import {ElInput} from "element-plus";
import BasicFormComponent from "@/components/core/BasicFormComponent.ts";
import MagFlexComponent from "@/components/basic/MagFlexComponent.vue";

const MagInput = defineComponent({
  extends: BasicFormComponent,
  name: "MagInput",
  props: {
    type: {type: String, required: false, default: () => "text"}
  },
  setup(props, {attrs}) {
    /**
     * 定义返回模板
     */
    return () => {
      if (props.formType) {
        return <ElInput {...props} {...attrs} v-model={props.model[props.prop]}/>
      }

      return <MagFlexComponent {...props} {...attrs}>
        <ElInput {...props} {...attrs} v-model={props.model[props.prop]}/>
      </MagFlexComponent>
    }
  }
});

export default MagInput;
