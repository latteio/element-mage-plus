import {defineComponent} from "vue";
import {ElButton, ElInput} from "element-plus";
import {Upload} from "@element-plus/icons-vue";
import BasicFormComponent from "@/components/core/BasicFormComponent.ts";
import MagFlexComponent from "@/components/basic/MagFlexComponent.vue";

const MagUpload = defineComponent({
  extends: BasicFormComponent,
  name: "MagUpload",
  props: {
    type: {type: String, required: false, default: () => "input-upload"},
    icon: {type: [String, Object], required: false, default: () => ""}
  },
  emits: ["click"],
  setup(props, {attrs, emit}) {
    /**
     * 定义附件按钮事件
     */
    const onClickAppendBtnFunc = (event: MouseEvent) => {
      emit("click", event, props.dataScope);
    }

    /**
     * 定义附件按钮
     */
    const createAppendBtn = () => {
      return <ElButton icon={props.icon || Upload} onClick={onClickAppendBtnFunc}/>
    }

    /**
     * 定义返回模板
     */
    return () => {
      if (props.formType) {
        return <ElInput {...props} {...attrs} v-model={props.model[props.prop]}
                        v-slots={{append: () => createAppendBtn()}}
        />
      }

      return <MagFlexComponent {...props} {...attrs}>
        <ElInput {...props} {...attrs} v-model={props.model[props.prop]}
                 v-slots={{append: () => createAppendBtn()}}
        />
      </MagFlexComponent>
    }
  }
});

export default MagUpload;
