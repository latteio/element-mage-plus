import {defineComponent} from "vue";
import {ElTimePicker} from "element-plus";
import BasicFormComponent from "@/components/core/BasicFormComponent.ts";
import MagFlexComponent from "@/components/basic/MagFlexComponent.vue";

const MagSelectTime = defineComponent({
  extends: BasicFormComponent,
  name: "MagSelectTime",
  props: {
    type: {type: String, required: false, default: () => "time"},
    fit: {type: Boolean, required: false, default: () => true}
  },
  setup(props, {attrs}) {
    /**
     * 定义返回模板
     */
    return () => {
      if (props.formType) {
        return <ElTimePicker {...props}
                             {...attrs}
                             type={props.type}
                             v-model={props.model[props.prop]}
                             value-format="HH:mm:ss"
                             is-range={props.type === 'timerange'}/>
      }

      return <MagFlexComponent {...props} {...attrs}>
        <ElTimePicker {...props}
                      {...attrs}
                      type={props.type}
                      v-model={props.model[props.prop]}
                      value-format="HH:mm:ss"
                      is-range={props.type === 'timerange'}/>
      </MagFlexComponent>
    }
  }
});

export default MagSelectTime;
