import {defineComponent, onMounted, PropType, provide, reactive, ref} from 'vue'
import {ElCheckbox, ElInput, ElPagination, ElScrollbar, ElSelect, ElTable, ElTableColumn} from 'element-plus'
import {AxiosResponse} from "axios";
import BasicFormComponent from "@/components/core/BasicFormComponent.ts";
import {MagTableData} from "@/types/element-mage-plus-types.ts";
import MagFlexComponent from "@/components/basic/MagFlexComponent.vue";
import {useSlots} from "@/composables/ComposableUseProvider.ts";
import Objects from "@/utils/Objects";

export interface TableDataType {
  [key: string]: any
}

const MagSelectTable = defineComponent({
  extends: BasicFormComponent,
  name: 'MagSelectTable',
  props: {
    type: {type: String, required: false, default: () => "select-table"},
    dropdownHeight: {type: String, required: false, default: "300px"},
    multiple: {type: Boolean, required: false, default: true},
    placeholder: {type: String, required: false, default: "请选择"},
    clearable: {type: Boolean, required: false, default: true},
    filterable: {type: Boolean, required: false, default: true},
    rowKey: {type: String, required: false, default: "id"},
    valueKey: {type: String, required: false, default: "value"},
    labelKey: {type: String, required: false, default: "label"},
    data: {type: Array as PropType<TableDataType[]>, required: false, default: () => []},
    dataLoader: {type: Function as PropType<(params: any) => Promise<AxiosResponse<any>>>, required: false, default: () => null},
    dataParams: {type: Object, required: false, default: () => null},
    autoLoad: {type: Boolean, required: false, default: () => true},
    pageLayout: {type: String, required: false, default: () => "total, sizes, prev, pager, next, jumper"},
    pageSizes: {type: Array as PropType<number[]>, required: false, default: () => [10, 20, 30, 50, 100, 200, 300, 500]},
    pageNum: {type: Number, required: false, default: () => 1},
    pageSize: {type: Number, required: false, default: () => 20},
    total: {type: Number, required: false, default: () => 0}
  },
  emits: ['filter', 'visible-change'],
  setup(props, {attrs, slots, emit}) {
    const loadingStatus = ref(false);

    /**
     * 表格变量集: 用于跨组件传递
     */
    const editableTableProperties = reactive({editableTable: false});
    provide("mag_table__editable_properties", editableTableProperties);

    const filterInputRef = ref<InstanceType<typeof ElInput> | null>(null)
    const selectTableModel = reactive({
      visible: false,
      filterText: '',
      selectedRows: [] as TableDataType[],
      isSelectAll: false,

      /* 表格数据 */
      cachedRowData: props.data as TableDataType[],
      rowData: props.data as TableDataType[],
      rowTotal: ((props.data && props.data.length) || props.total || 0) as number,
      pageNum: props.pageNum,
      pageSize: props.pageSize,
      /* 表格数据的获取参数 */
      pageBaseParams: {pageNum: props.pageNum, pageSize: props.pageSize, ...props.dataParams},
      cachedQueryParams: {},
      cachedBeforeLoader: [] as Array<Function | undefined>
    });

    /* 初始化表格数据 */
    onMounted(() => {
    })

    /* 更新选中的项 */
    const updateSelectedRowsFunc = () => {
      if (!props.model[props.prop] || (Array.isArray(props.model[props.prop]) && props.model[props.prop].length === 0)) {
        selectTableModel.selectedRows = []
        return
      }

      if (props.multiple) {
        selectTableModel.selectedRows = selectTableModel.rowData.filter(item =>
            (props.model[props.prop] as any[]).includes(item[props.valueKey]))
      } else {
        const selectedItem = selectTableModel.rowData.find(item => item[props.valueKey] === props.model[props.prop])
        selectTableModel.selectedRows = selectedItem ? [selectedItem] : []
      }

      updateSelectAllStateFunc()
    }

    /* 更新全选状态 */
    const updateSelectAllStateFunc = () => {
      if (!props.multiple) return

      const selectedCount = selectTableModel.selectedRows.length
      selectTableModel.isSelectAll = selectedCount === selectTableModel.rowData.length && selectedCount > 0
    }

    /**
     * 定义切换下拉框显示状态事件
     * @param visible
     */
    const onVisibleChangeFunc = (visible: boolean) => {
      selectTableModel.visible = visible
      selectTableModel.filterText = ''
      selectTableModel.rowData = []
      if (visible) {
        /* 延迟聚焦搜索框 */
        setTimeout(() => {
          filterInputRef.value?.focus()
        }, 100)
        loadDataAsyncFunc({}).then(() => {
          updateSelectedRowsFunc();
        }).catch((e: any) => {
          console.log('onVisibleChangeFunc(): An exception occurred while requesting data: ', e)
        });
      }

      emit('visible-change', visible)
    }

    /**
     * 定义选择行事件
     * @param row
     */
    const onSelectFunc = (row: TableDataType) => {
      if (props.multiple) {
        const values: any[] = props.model[props.prop]
            ? (Objects.isArray(props.model[props.prop]) ? props.model[props.prop] : [props.model[props.prop]])
            : []

        const index = values.findIndex(item => item === row[props.valueKey])
        if (index > -1) {
          values.splice(index, 1)
          selectTableModel.selectedRows.splice(index, 1)
        } else {
          values.push(row[props.valueKey])
          selectTableModel.selectedRows.push(row)
        }
        props.model[props.prop] = [...values]
      } else {
        selectTableModel.selectedRows = [row]
        props.model[props.prop] = row[props.valueKey]
        selectTableModel.visible = false
      }
    }

    /**
     * 定义过滤表格数据事件
     */
    const onInputFilterFunc = () => {
      if (!selectTableModel.filterText) {
        selectTableModel.rowData = [...selectTableModel.cachedRowData]
        emit('filter', '')
        return
      }

      selectTableModel.rowData = selectTableModel.cachedRowData.filter(item => {
        return Object.values(item).some(val =>
            String(val).toLowerCase().includes(selectTableModel.filterText.toLowerCase())
        )
      })

      emit('filter', selectTableModel.filterText)
    }

    /**
     * 判断是否选中
     * @param value
     */
    const isSelected = (value: any) => {
      if (props.multiple) {
        return props.model[props.prop] && (props.model[props.prop] as any[]).includes(value)
      }

      return props.model[props.prop] === value
    }

    /**
     * 定义清空选择事件
     */
    const onInputClearFunc = () => {
      selectTableModel.selectedRows = []
      selectTableModel.isSelectAll = false
    }

    /**
     * 内部方法: 定义切换当前页处理事件
     * @param val
     */
    const onCurrentChangeFunc = (val: number) => {
      selectTableModel.pageNum = val;
      selectTableModel.pageBaseParams["pageNum"] = val;
      loadDataAsyncFunc(selectTableModel.cachedQueryParams,
          selectTableModel.cachedBeforeLoader && selectTableModel.cachedBeforeLoader[0]
              ? selectTableModel.cachedBeforeLoader[0]
              : undefined);
    }

    /**
     * 内部方法: 定义切换每页显示条数处理事件
     * @param val
     */
    const onSizeChangeFunc = (val: number) => {
      selectTableModel.pageSize = val;
      selectTableModel.pageBaseParams["pageSize"] = val;
      loadDataAsyncFunc(selectTableModel.cachedQueryParams,
          selectTableModel.cachedBeforeLoader && selectTableModel.cachedBeforeLoader[0]
              ? selectTableModel.cachedBeforeLoader[0]
              : undefined);
    }

    /**
     * 内部方法: 加载数据
     * @param data
     */
    const loadDataFunc = (data: MagTableData | any) => {
      if (data) {
        if (data.pageNum && data.pageSize) {
          selectTableModel.pageNum = data?.pageNum;
          selectTableModel.pageSize = data?.pageSize;
          selectTableModel.cachedRowData = data?.records;
          selectTableModel.rowData = data?.records;
          selectTableModel.rowTotal = data?.total;
        } else {
          selectTableModel.cachedRowData = data;
          selectTableModel.rowData = data;
          selectTableModel.rowTotal = data?.length;
        }
      }
    }

    /**
     * 内部方法: 异步加载数据
     * @param params 查询参数
     * @param beforeLoader 数据加载前的处理(需要返回处理后的数据)
     */
    const loadDataAsyncFunc = (params: any, ...beforeLoader: Array<Function | undefined>) => {
      if (props.dataLoader) {
        loadingStatus.value = true;
        selectTableModel.cachedQueryParams = Object.assign({}, params);
        selectTableModel.cachedBeforeLoader = beforeLoader || [] as Array<Function | undefined>;
        return props.dataLoader({...selectTableModel.pageBaseParams, ...selectTableModel.cachedQueryParams}).then(({data}: any) => {
          let handledData = (beforeLoader && beforeLoader[0]) ? beforeLoader[0](data) : data;
          loadDataFunc(handledData);
        }).catch((e: any) => {
          console.log('loadDataAsyncFunc(): An exception occurred while requesting data: ', e)
        }).finally(() => {
          loadingStatus.value = false;
        });
      }

      return new Promise<AxiosResponse<any>>({} as any);
    }

    const createSelectComponent = () => {
      // TODO: 增加data获取以便做回显
      return <ElSelect
          {...props}
          {...attrs}
          v-model={props.model[props.prop]}
          multiple={props.multiple}
          filterable={props.filterable}
          placeholder={props.placeholder}
          clearable={props.clearable}
          onVisibleChange={onVisibleChangeFunc}
          onClear={onInputClearFunc}
          /* 禁用原生下拉菜单 */
          popper-append-to-body={false}
          popper-class="mag-select-table-popper"
          v-slots={{
            /* 自定义下拉内容 */
            header: () => (
                <div class="mag-select-table-dropdown">
                  {/* 下拉表格搜索框 */}
                  {props.filterable && (
                      <div class="mag-select-table-filter">
                        <ElInput
                            ref={filterInputRef}
                            v-model={selectTableModel.filterText}
                            size="default"
                            placeholder="请输入关键词过滤"
                            onInput={onInputFilterFunc}
                            clearable
                        />
                      </div>
                  )}

                  {/* 下拉表格 */}
                  <ElScrollbar>
                    <ElTable
                        style={{width: '100%', height: props.dropdownHeight}}
                        size="small"
                        data={selectTableModel.rowData}
                        row-key={props.rowKey}
                        onSelect={(row: TableDataType | null) => row && onSelectFunc(row)}
                    >
                      {/* 选择列 */}
                      <ElTableColumn width={50} prop="rowSelectBox" label=" " fixed="left">
                        {{
                          default: ({row}: {
                            row: TableDataType
                          }) => <ElCheckbox
                              modelValue={isSelected(row[props.valueKey])}
                              onChange={() => onSelectFunc(row)}
                          />
                        }}
                      </ElTableColumn>
                      {/* 表格列 */}
                      {useSlots(slots)}
                    </ElTable>
                    {/* 分页栏 */}
                    <ElPagination
                        class="mag-select-table-dropdown__footer"
                        layout={props.pageLayout}
                        size="small"
                        page-sizes={props.pageSizes}
                        total={selectTableModel.rowTotal}
                        v-model:current-page={selectTableModel.pageNum}
                        v-model:page-size={selectTableModel.pageSize}
                        onCurrentChange={onCurrentChangeFunc}
                        onSizeChange={onSizeChangeFunc}
                        background>
                    </ElPagination>
                  </ElScrollbar>
                </div>
            )
          }}
      />
    }

    /**
     * 定义返回模板
     */
    return () => {
      return props.formType
          ? createSelectComponent()
          : <MagFlexComponent {...props} {...attrs}>
            {createSelectComponent()}
          </MagFlexComponent>
    }
  }
})

export default MagSelectTable;