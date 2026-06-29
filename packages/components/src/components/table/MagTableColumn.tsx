import {defineComponent, h, inject, PropType, ref} from "vue";
import {ElIcon, ElPopover, ElTableColumn} from "element-plus";
import {Filter, Refresh, Search} from "@element-plus/icons-vue";
import {MagTableColumnSortType} from "@/types";
import MagInput from "@/components/form/MagInput";
import MagInputNumber from "@/components/form/MagInputNumber";
import MagInputTag from "@/components/form/MagInputTag";
import MagInputButton from "@/components/form/MagInputButton";
import MagSelect from "@/components/form/MagSelect";
import MagSelectDate from "@/components/form/MagSelectDate";
import MagSelectTime from "@/components/form/MagSelectTime";
import MagSelectTable from "@/components/form/MagSelectTable";
import MagSelectTree from "@/components/form/MagSelectTree";
import MagSwitch from "@/components/form/MagSwitch";
import MagButton from "@/components/basic/MagButton.vue";
import {useSlots} from "@/composables/ComposableUseProvider.ts";

const MagTableColumn = defineComponent({
  name: "MagTableColumn",
  props: {
    prop: {type: String, required: true, default: () => ""},
    label: {type: String, required: true, default: () => ""},
    sortProps: {type: Object as PropType<MagTableColumnSortType>, required: false, default: () => null},
    editable: {type: Boolean as PropType<boolean>, required: false, default: () => false},
    filterable: {type: Boolean as PropType<boolean>, required: false, default: () => false}
  },
  setup(props, {attrs, slots}) {
    const tableDefaultProperties: any = inject("mag_table__default_properties");
    const editableTableProperties: any = inject("mag_table__editable_properties");
    const filterComponent = ref();
    const filterComponentModel = ref();
    const filterComponentProp = ref();

    /**
     * 定义组件值被改变事件
     * @param scope
     * @param _
     */
    const onComponentChangeFunc = (scope: any, _: any) => {
      const row = scope.row;
      const key = row[editableTableProperties.editableTableRowKey];
      if (editableTableProperties.editableTableModifiedRowData [key]) {
        editableTableProperties.editableTableModifiedRowData [key]["modified"] = true;
      }
    }

    /**
     * 渲染表格单元格
     * @param scope
     * @param column
     */
    const createTableColumnCell = (scope: any, column: any) => {
      const row = scope.row;
      const prop = column.prop;
      if (editableTableProperties.editableTable) {
        const key = row[editableTableProperties.editableTableRowKey];
        if (!key
            || !editableTableProperties.editableTableColumns[prop]
            || !editableTableProperties.editableTableModifiedRowData[key]) {
          return;
        }

        let vNode = editableTableProperties.editableTableColumns[prop]["node"];
        switch (vNode?.type?.name) {
          case MagInput.name:
            return <MagInput
                {...vNode?.props}
                {...vNode?.attrs}
                formType={true}
                model={editableTableProperties.editableTableModifiedRowData[key]["data"]}
                prop={prop}
                onChange={function () {
                  onComponentChangeFunc(scope, column)
                }}>
              {vNode?.default?.()}
            </MagInput>
          case MagInputNumber.name:
            return <MagInputNumber
                {...vNode?.props}
                {...vNode?.attrs}
                formType={true}
                model={editableTableProperties.editableTableModifiedRowData[key]["data"]}
                prop={prop}
                onChange={function () {
                  onComponentChangeFunc(scope, column)
                }}>
              {vNode?.default?.()}
            </MagInputNumber>
          case MagInputTag.name:
            return <MagInputTag
                {...vNode?.props}
                {...vNode?.attrs}
                formType={true}
                model={editableTableProperties.editableTableModifiedRowData[key]["data"]}
                prop={prop}
                onChange={function () {
                  onComponentChangeFunc(scope, column)
                }}>
              {vNode?.default?.()}
            </MagInputTag>
          case MagInputButton.name:
            return <MagInputButton
                {...vNode?.props}
                {...vNode?.attrs}
                formType={true}
                model={editableTableProperties.editableTableModifiedRowData[key]["data"]}
                prop={prop}
                onChange={function () {
                  onComponentChangeFunc(scope, column)
                }}>
              {vNode?.default?.()}
            </MagInputButton>
          case MagSelect.name:
            return <MagSelect
                {...vNode?.props}
                {...vNode?.attrs}
                formType={true}
                model={editableTableProperties.editableTableModifiedRowData[key]["data"]}
                prop={prop}
                onChange={function () {
                  onComponentChangeFunc(scope, column)
                }}>
              {vNode?.default?.()}
            </MagSelect>
          case MagSelectDate.name:
            return <MagSelectDate
                {...vNode?.props}
                {...vNode?.attrs}
                fit={true}
                formType={true}
                model={editableTableProperties.editableTableModifiedRowData[key]["data"]}
                prop={prop}
                onChange={function () {
                  onComponentChangeFunc(scope, column)
                }}>
              {vNode?.default?.()}
            </MagSelectDate>
          case MagSelectTime.name:
            return <MagSelectTime
                {...vNode?.props}
                {...vNode?.attrs}
                fit={true}
                formType={true}
                model={editableTableProperties.editableTableModifiedRowData[key]["data"]}
                prop={prop}
                onChange={function () {
                  onComponentChangeFunc(scope, column)
                }}>
              {vNode?.default?.()}
            </MagSelectTime>
          case MagSelectTable.name:
            return <MagSelectTable
                {...vNode?.props}
                {...vNode?.attrs}
                formType={true}
                model={editableTableProperties.editableTableModifiedRowData[key]["data"]}
                prop={prop}
                onChange={function () {
                  onComponentChangeFunc(scope, column)
                }}>
              {vNode?.children?.default?.()}
            </MagSelectTable>
          case MagSelectTree.name:
            return <MagSelectTree
                {...vNode?.props}
                {...vNode?.attrs}
                formType={true}
                model={editableTableProperties.editableTableModifiedRowData[key]["data"]}
                prop={prop}
                onChange={function () {
                  onComponentChangeFunc(scope, column)
                }}>
              {vNode?.default?.()}
            </MagSelectTree>
          case MagSwitch.name:
            return <MagSwitch
                {...vNode?.props}
                {...vNode?.attrs}
                formType={true}
                model={editableTableProperties.editableTableModifiedRowData[key]["data"]}
                prop={prop}
                onChange={function () {
                  onComponentChangeFunc(scope, column)
                }}>
              {vNode?.default?.()}
            </MagSwitch>
          default:
            return <span>{row[column.prop]}</span>
        }
      } else {
        return <span>{row[column.prop]}</span>
      }
    }

    /**
     * 列过滤提交
     */
    const onColumnFilterSubmitFunc = () => {
      if (tableDefaultProperties.filterHandler) {
        filterComponent.value.props.model[filterComponentProp.value] = filterComponentModel.value[filterComponentProp.value];
        tableDefaultProperties.filterHandler('submit ', filterComponentProp.value, filterComponentModel.value[filterComponentProp.value]);
      }
    }

    /**
     * 列过滤重置
     */
    const onColumnFilterResetFunc = () => {
      if (tableDefaultProperties.filterHandler) {
        filterComponent.value.props.model[filterComponentProp.value] = null;
        filterComponentModel.value[filterComponentProp.value] = null;
        tableDefaultProperties.filterHandler('reset', filterComponentProp.value, null);
      }
    }

    /**
     * 创建头部过滤组件
     */
    const createHeaderFilter = () => {
      if (props.filterable) {
        const vNodes = useSlots(slots);
        if (vNodes && vNodes.length > 0) {
          const vNode = vNodes[0];
          filterComponent.value = vNode;
          filterComponentModel.value = vNode?.props?.model || tableDefaultProperties.filterModel;
          filterComponentProp.value = vNode?.props?.prop;

          return <ElPopover popper-class="mag-table__table-header-filter"
                            placement="bottom"
                            trigger="click"
                            v-slots={{
                              reference: () =>
                                  <ElIcon class={{
                                    "mag-table__table-header-filter-icon": true,
                                    "has-filtered": undefined !== filterComponentModel.value[filterComponentProp.value] && null !== filterComponentModel.value[filterComponentProp.value],
                                    "not-filtered": undefined === filterComponentModel.value[filterComponentProp.value] || null === filterComponentModel.value[filterComponentProp.value]
                                  }}>
                                    <Filter/>
                                  </ElIcon>
                            }}>
            <div class="mag-table__table-header-filter-component">
              {h(vNode, {model: filterComponentModel.value, teleported: false, onClear: () => onColumnFilterResetFunc()}, vNode?.children ?? undefined)}
            </div>

            <div class="mag-table__table-header-filter-buttons">
              <MagButton icon={Search} type="primary" onClick={onColumnFilterSubmitFunc}>查询</MagButton>
              <MagButton icon={Refresh} onClick={onColumnFilterResetFunc}>重置</MagButton>
            </div>
          </ElPopover>
        } else {
          return <></>;
        }
      }

      return <></>;
    }

    /**
     * 定义返回模板
     */
    return () => {
      return <ElTableColumn {...props} {...attrs}
                            v-slots={{
                              header: () => {
                                return <div class="mag-table__table-header">
                                  <div>{props.label}</div>
                                  {createHeaderFilter()}
                                </div>
                              },
                              default: (scope: any) =>
                                  createTableColumnCell(scope, props)
                            }}/>
    }
  }
});

export default MagTableColumn;
