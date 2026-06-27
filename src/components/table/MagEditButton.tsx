import {defineComponent, h, inject, PropType, ref} from "vue";
import {ElButton} from "element-plus";
import BasicComponent from "@/components/core/BasicComponent.ts";

const MagEditButton = defineComponent({
  extends: BasicComponent,
  name: "MagEditButton",
  props: {
    buttonStatus: {type: String as PropType<string>, required: false, default: () => "edit"}
  },
  emits: ["save"],
  setup(props, {attrs, slots, emit, expose}) {
    const editableTableProperties: any = inject("mag_table__editable_properties");
    const editableTableRowOpt = ref(props.buttonStatus || "edit");

    /**
     * 定义开始编辑事件处理方法
     * @param scope
     */
    const onClickEditBtnFunc = (scope: any) => {
      const row = scope.row;
      editableTableProperties.editableTableEvents.editRow(row, false);
      editableTableRowOpt.value = "editing";
    }

    /**
     * 定义取消编辑事件处理方法
     * @param scope
     */
    const onClickCancelBtnFunc = (scope: any) => {
      const row = scope.row;
      editableTableProperties.editableTableEvents.cancelEdit(row, false);
      editableTableRowOpt.value = "edit";
    }

    /**
     * 定义保存编辑事件处理方法
     * @param scope
     */
    const onClickSaveBtnFunc = (scope: any) => {
      const row = scope.row;
      const key = row[editableTableProperties.editableTableRowKey];
      const type = editableTableProperties.editableTableModifiedRowData [key]["type"];
      const data = {...editableTableProperties.editableTableModifiedRowData [key]["data"]};
      const modified = editableTableProperties.editableTableModifiedRowData [key]["modified"];
      delete editableTableProperties.editableTableModifiedRowData [key];
      editableTableRowOpt.value = "edit";
      modified && emit("save", scope, {type, data});
    }

    expose({
      setButtonStatus: (statusText: string) => editableTableRowOpt.value = statusText
    });

    /**
     * 定义返回模板
     */
    return () => {
      return editableTableRowOpt.value == "edit"
          ? h('div', {class: "mag-button-subgroup"},
              [
                h(ElButton,
                    {
                      ...props as any,
                      ...attrs as any,
                      type: "primary",
                      onClick: function () {
                        onClickEditBtnFunc(props.dataScope)
                      }
                    }, {
                      default: () => slots?.default?.()
                    })
              ])
          : h('div', {class: "mag-button-subgroup"},
              [
                h(ElButton,
                    {
                      ...props as any,
                      ...attrs as any,
                      onClick: function () {
                        onClickCancelBtnFunc(props.dataScope)
                      }
                    }, "取消"),
                h(ElButton,
                    {
                      ...props as any,
                      ...attrs as any,
                      type: "primary",
                      onClick: function () {
                        onClickSaveBtnFunc(props.dataScope)
                      }
                    }, "保存")
              ])
    }
  }
});

export default MagEditButton;
