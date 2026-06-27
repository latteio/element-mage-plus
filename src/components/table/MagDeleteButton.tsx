import {defineComponent, h, inject, PropType, ref} from "vue";
import {ElButton} from "element-plus";
import BasicComponent from "@/components/core/BasicComponent.ts";

const MagDeleteButton = defineComponent({
  extends: BasicComponent,
  name: "MagDeleteButton",
  props: {
    buttonStatus: {type: String as PropType<string>, required: false, default: () => "delete"}
  },
  setup(props, {attrs, slots}) {
    const editableTableProperties: any = inject("mag_table__editable_properties");
    const editableTableRowOpt = ref(props.buttonStatus || "delete");

    /**
     * 定义删除行事件处理方法
     * @param scope
     */
    const onClickDeleteBtnFunc = (scope: any) => {
      const row = scope.row;
      editableTableProperties.editableTableEvents.delRow(row);
      editableTableRowOpt.value = "deleted";
    }

    /**
     * 定义返回模板
     */
    return () => {
      return h(ElButton,
          {
            ...props as any,
            ...attrs as any,
            type: "danger",
            onClick: function () {
              onClickDeleteBtnFunc(props.dataScope)
            }
          }, {
            default: () => slots?.default?.()
          });
    }
  }
});

export default MagDeleteButton;
