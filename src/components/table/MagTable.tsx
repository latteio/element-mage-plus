import {defineComponent, nextTick, onMounted, PropType, provide, reactive, ref} from "vue";
import {uuid} from "vue3-uuid";
import {ElCollapseTransition, ElContainer, ElHeader, ElIcon, ElMain, ElTable, ElTableColumn} from "element-plus";
import {AxiosResponse} from "axios";
import {ArrowRight} from "@element-plus/icons-vue";
import {MagTableColumnSortType, MagTableData} from "@/types/element-mage-plus-types.ts";
import MagTableBar from "@/components/table/MagTableBar";
import MagTableColumn from "@/components/table/MagTableColumn";
import MagTablePagination from "@/components/table/MagTablePagination";
import BasicViewComponent from "@/components/core/BasicViewComponent.ts";
import {useSlots} from "@/composables/ComposableUseProvider.ts";
import Objects from "@/utils/Objects";

const MagTable = defineComponent({
  extends: BasicViewComponent,
  name: "MagTable",
  props: {
    /* 表格基础属性 */
    region: {type: String, required: false, default: () => "center"},
    header: {type: String, required: false, default: () => ""},
    rowCheckbox: {type: Boolean, required: false, default: () => false},
    rowIndex: {type: Boolean, required: false, default: () => false},
    rowKey: {type: String, required: false, default: () => "id"},
    rowCheckedKeys: {type: Array as PropType<any[]>, required: false, default: () => []},
    autoLoad: {type: Boolean, required: false, default: () => true},
    data: {type: Array as PropType<any[]>, required: false, default: () => []},
    dataLoader: {type: Function as PropType<(params: any) => Promise<AxiosResponse<any>>>, required: false, default: () => null},
    dataParams: {type: Object, required: false, default: () => null},
    /* 分页相关属性 */
    usePage: {type: Boolean, required: false, default: () => true},
    pageAlign: {type: String, required: false, default: () => "left"},
    pageLayout: {type: String, required: false, default: () => "total, sizes, prev, pager, next, jumper, slot"},
    pageBars: {type: Array as PropType<string[]>, required: false, default: () => ["search"]},
    pageSizes: {type: Array as PropType<number[]>, required: false, default: () => [10, 20, 30, 50, 100, 200, 300, 500]},
    pageNum: {type: Number, required: false, default: () => 1},
    pageSize: {type: Number, required: false, default: () => 20},
    total: {type: Number, required: false, default: () => 0},
    /* 事件 */
    selectableHandler: {type: Function as PropType<(row: any, index: number) => boolean>, required: false, default: () => true}
  },
  emits: ["data-filter"],
  setup(props, {attrs, slots, emit, expose}) {
    const componentVisible = ref(props.visible);
    const componentExpanded = ref(props.expanded);
    const loadingStatus = ref(false);

    /**
     * 表格内置属性集: 用于跨组件传递
     */
    provide("mag_table__default_properties", {
      filterModel: reactive({}),
      filterHandler: (event: string, prop: string, val: any) => {
        emit("data-filter", {event, prop, val});
      }
    });

    /**
     * 可编辑表格内置属性集: 用于跨组件传递
     */
    const editableTableProperties = reactive({
      editableTable: false,
      editableTableColumns: {} as any,
      editableTableEvents: {},
      editableTableRowKey: props.rowKey,
      editableTableModifiedRowData: {} as any,
      editableTableRowBtnStatus: {MagEditButton: '', MagDeleteButton: ''},
      editableTableRowBtnRefs: {} as any
    });
    provide("mag_table__editable_properties", editableTableProperties);

    /**
     * 定义表格内置模型变量
     */
    const tableModel = reactive({
      rowData: props.data,
      rowTotal: (props.data && props.data.length) || props.total || 0,
      pageNum: props.pageNum,
      pageSize: props.pageSize,
      pageChanged: false,
      /* 获取(过滤)数据的参数 */
      pageBaseParams: {keywords: '', ...props.dataParams},
      cachedQueryParams: {},
      cachedBeforeLoader: [] as Array<Function | undefined>
    });

    /**
     * 内部方法: 定义切换当前页处理事件
     * @param val
     */
    const onCurrentChangeFunc = (val: number) => {
      tableModel.pageChanged = true;
      tableModel.pageNum = val;
      loadDataAsyncFunc(tableModel.cachedQueryParams,
          tableModel.cachedBeforeLoader && tableModel.cachedBeforeLoader[0]
              ? tableModel.cachedBeforeLoader[0]
              : undefined);
    }

    /**
     * 内部方法: 定义切换每页显示条数处理事件
     * @param val
     */
    const onSizeChangeFunc = (val: number) => {
      tableModel.pageChanged = true;
      tableModel.pageNum = 1;
      tableModel.pageSize = val;
      loadDataAsyncFunc(tableModel.cachedQueryParams,
          tableModel.cachedBeforeLoader && tableModel.cachedBeforeLoader[0]
              ? tableModel.cachedBeforeLoader[0]
              : undefined);
    }

    /**
     * 定义分页栏搜索事件
     */
    const onSearchFunc = (keywords: string) => {
      tableModel.pageBaseParams.keywords = keywords;
      loadDataAsyncFunc(tableModel.cachedQueryParams,
          tableModel.cachedBeforeLoader && tableModel.cachedBeforeLoader[0]
              ? tableModel.cachedBeforeLoader[0]
              : undefined);
    }

    /**
     * 内部方法: 加载数据
     * @param data
     */
    const loadDataFunc = (data: MagTableData | any) => {
      const lastPageRowData = tableModel.rowData;
      if (data) {
        if (data.pageNum !== undefined && data.pageSize !== undefined) {
          tableModel.rowData = data?.records;
          tableModel.rowTotal = data?.total;
        } else {
          tableModel.rowData = data;
          tableModel.rowTotal = data?.length;
        }
      }

      if (editableTableProperties.editableTable) {
        if (tableModel.pageChanged) {
          const keys = lastPageRowData.map((row: any) => row[editableTableProperties.editableTableRowKey]);
          onRemoveRowBtnRefsInternalFunc(keys, tableModel.pageChanged);
          tableModel.pageChanged = false;
        }
        onCancelEditRowDataFunc(null, true);
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
        tableModel.cachedQueryParams = Object.assign({}, params);
        tableModel.cachedBeforeLoader = beforeLoader || [] as Array<Function | undefined>;
        props.dataLoader({
          pageNum: tableModel.pageNum,
          pageSize: tableModel.pageSize,
          ...tableModel.pageBaseParams,
          ...tableModel.cachedQueryParams
        }).then(({data}: any) => {
          let handledData = (beforeLoader && beforeLoader[0]) ? beforeLoader[0](data) : data;
          loadDataFunc(handledData);
        }).catch((e: any) => {
          console.log('loadDataAsyncFunc(): An exception occurred while requesting data: ', e)
        }).finally(() => {
          loadingStatus.value = false;
        });
      }
    }

    /**
     * 内部方法: 定义动态插入数据行事件处理方法(默认插入到首行)
     * @param rowData
     */
    const onAddRowDataFunc = (rowData: any) => {
      /* 新增行时: 默认编辑按钮处于打开编辑状态 */
      editableTableProperties.editableTableRowBtnStatus["MagEditButton"] = "editing";

      const key: string = uuid.v4();
      rowData[editableTableProperties.editableTableRowKey] = key;
      tableModel.rowData.splice(0, 0, rowData);
      editableTableProperties.editableTableModifiedRowData [key] = {
        type: "insert",
        data: rowData,
        modified: false
      }

      nextTick(() => {
        editableTableProperties.editableTableRowBtnStatus["MagEditButton"] = "";
      }).then(() => {
      })
    }

    const onEditRowDataInternalFunc = (rowData: any) => {
      const key = rowData[editableTableProperties.editableTableRowKey];
      if (key && !editableTableProperties.editableTableModifiedRowData [key]) {
        if (editableTableProperties.editableTableRowBtnRefs[key] && editableTableProperties.editableTableRowBtnRefs[key]["MagEditButton"]) {
          editableTableProperties.editableTableRowBtnRefs[key]["MagEditButton"].setButtonStatus("editing")
        }

        editableTableProperties.editableTableModifiedRowData [key] = {
          type: "update",
          data: rowData,
          modified: false
        }
      }
    }

    /**
     * 内部方法: 定义动态编辑数据行事件处理方法
     * @param rowData 编辑行对象
     * @param isCurrentPage 是否编辑当前页
     */
    const onEditRowDataFunc = (rowData: any, isCurrentPage: boolean) => {
      if (isCurrentPage) {
        for (let i = 0; i < tableModel.rowData.length; i++) {
          onEditRowDataInternalFunc(tableModel.rowData[i]);
        }
        return;
      }

      if (rowData) {
        onEditRowDataInternalFunc(rowData);
      }
    }

    /**
     * 内部方法: 定义动态删除数据行事件处理方法
     * @param rowData
     */
    const onDelRowDataFunc = (rowData: any) => {
      const key: string = rowData[editableTableProperties.editableTableRowKey];
      if (key) {
        if (editableTableProperties.editableTableModifiedRowData [key]) {
          delete editableTableProperties.editableTableModifiedRowData [key];
        }

        let tmpKey, tmpIndex = -1;
        for (let i = 0; i < tableModel.rowData.length; i++) {
          tmpKey = tableModel.rowData[i][editableTableProperties.editableTableRowKey];
          if (tmpKey == key) {
            editableTableProperties.editableTableModifiedRowData [key] = {
              type: "delete",
              data: tableModel.rowData[i],
              modified: true
            }
            tmpIndex = i;
            break;
          }
        }

        if (tmpIndex > -1) {
          tableModel.rowData.splice(tmpIndex, 1)
        }
      }
    }

    const onRemoveRowBtnRefsInternalFunc = (keys: Array<string>, removable: boolean) => {
      if (removable) {
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] && editableTableProperties.editableTableRowBtnRefs[keys[i]]) {
            delete editableTableProperties.editableTableRowBtnRefs[keys[i]];
          }
        }
      }
    }

    const onCancelEditRowDataInternalFunc = (key: string) => {
      if (key && editableTableProperties.editableTableModifiedRowData[key]) {
        if (editableTableProperties.editableTableModifiedRowData[key]["type"] == "delete") {
          onRemoveRowBtnRefsInternalFunc([key], true)
        } else if (editableTableProperties.editableTableRowBtnRefs[key] && editableTableProperties.editableTableRowBtnRefs[key]["MagEditButton"]) {
          editableTableProperties.editableTableRowBtnRefs[key]["MagEditButton"].setButtonStatus("edit")
        }
        delete editableTableProperties.editableTableModifiedRowData[key]
      }
    }

    /**
     * 内部方法: 定义动态取消编辑数据行事件处理方法
     * @param rowData 编辑行对象
     * @param isCurrentPage 是否取消编辑当前页
     */
    const onCancelEditRowDataFunc = (rowData: any, isCurrentPage: boolean) => {
      if (isCurrentPage) {
        for (let key in editableTableProperties.editableTableModifiedRowData) {
          onCancelEditRowDataInternalFunc(key)
        }
        return;
      }

      if (rowData) {
        const key = rowData[editableTableProperties.editableTableRowKey];
        onCancelEditRowDataInternalFunc(key)
      }
    }

    /**
     * 返回可编辑表格模式下的已编辑行
     */
    const getModifiedRowDataFunc = () => {
      let modifiedRows = {
        insertEntities: [] as Array<any>,
        updateEntities: [] as Array<any>,
        deleteEntities: [] as Array<any>
      };

      let row;
      for (let key in editableTableProperties.editableTableModifiedRowData) {
        row = editableTableProperties.editableTableModifiedRowData[key];
        let {type, modified} = row;
        let data: any;
        if (modified) {
          data = {...row.data};
          if (type == 'insert') {
            /* 如果是新增数据行: 数据组织前先删除该主键值 */
            data[editableTableProperties.editableTableRowKey] = null;
            modifiedRows.insertEntities.push(data)
          } else if (type == 'update') {
            modifiedRows.updateEntities.push(data)
          } else if (type == 'delete') {
            modifiedRows.deleteEntities.push(data)
          }
        }
      }

      return modifiedRows;
    }

    /**
     * 设置组件展开 / 收缩
     */
    const setExpandedInternalFunc = () => {
      setExpandedFunc(!componentExpanded.value);
    }
    const setExpandedFunc = (paramExpanded: boolean) => {
      componentExpanded.value = paramExpanded;
    }

    /**
     * 定义组件外部方法
     */
    expose({
      datasourceProperties() {
        return {
          pageBaseParams: tableModel.pageBaseParams,
          pageNum: tableModel.pageNum,
          pageSize: tableModel.pageSize
        }
      },
      setVisible: (visible: boolean) => {
        componentVisible.value = visible;
      },
      setExpanded: setExpandedFunc,
      load: loadDataAsyncFunc,
      loadData: loadDataFunc,
      addRow: onAddRowDataFunc,
      delRow: onDelRowDataFunc,
      editRow: onEditRowDataFunc,
      editRows: () => {
        onEditRowDataFunc(null, true)
      },
      cancelEdit: () => {
        onCancelEditRowDataFunc(null, true)
      },
      getModifiedRows: getModifiedRowDataFunc
    });

    /**
     * 定义页面准备好后执行事件
     */
    onMounted(() => {
      editableTableProperties.editableTableEvents = {
        editRow: onEditRowDataFunc,
        delRow: onDelRowDataFunc,
        cancelEdit: onCancelEditRowDataFunc
      }

      nextTick(() => {
        if (props.autoLoad && Objects.isEmpty(tableModel.rowData)) {
          loadDataAsyncFunc({});
        }
      }).then(() => {
      });
    });

    /**
     * Table的头部定义
     */
    const createTableHeader = () => {
      if (props.header) {
        return <ElHeader onclick={setExpandedInternalFunc}
                         class={{
                           "mag-view__header": true,
                           "is-expanded": componentExpanded.value,
                           "is-collapsed": !componentExpanded.value,
                         }}>
          <div class="mag-view__header-text">{props.header}</div>
          <div class="mag-view__header-icon">
            {
              componentExpanded.value
                  ? (<ElIcon class="is-expanded"><ArrowRight/></ElIcon>)
                  : (<ElIcon><ArrowRight/></ElIcon>)
            }
          </div>
        </ElHeader>
      } else {
        return <ElHeader class="mag-view__header-empty">
        </ElHeader>
      }
    }

    /**
     * Table的工具栏定义
     */
    const createTableTopBars = (tableBar: any) => {
      const itemsAlign = tableBar?.props?.align || "left";
      return tableBar && (
          <div class={{
            "mag-view__view-bars mag-table__table-bars": true,
            "is-left-alignment": itemsAlign === "left",
            "is-right-alignment": itemsAlign === "right",
            "is-center-alignment": itemsAlign === "center"
          }}>
            <MagTableBar {...tableBar?.props} {...tableBar?.attrs} size={props.size}>
              {tableBar?.children?.default?.()}
            </MagTableBar>
          </div>
      )
    }

    /**
     * Table的分页节点定义
     */
    const createTablePaginationBar = () => {
      const itemsAlign = props?.pageAlign || "left";
      return props.usePage && (
          <div class={{
            "mag-table__table-page-bars": true,
            "is-left-alignment": itemsAlign === "left",
            "is-right-alignment": itemsAlign === "right",
            "is-center-alignment": itemsAlign === "center"
          }}>
            <MagTablePagination layout={props.pageLayout}
                                size={props.size === "large" ? props.size : "default"}
                                page-sizes={props.pageSizes}
                                total={tableModel.rowTotal}
                                page-bars={props.pageBars}
                                v-model:current-page={tableModel.pageNum}
                                v-model:page-size={tableModel.pageSize}
                                onCurrentChange={onCurrentChangeFunc}
                                onSizeChange={onSizeChangeFunc}
                                onSearch={onSearchFunc}
                                background/>
          </div>
      )
    }

    /**
     * 计算表格高度
     *
     * @param existsTbar
     * @param existsPaginationBar
     */
    const calculateTableHeightFunc = (existsTbar: boolean, existsPaginationBar: boolean) => {
      let height = "100%";

      if (existsTbar) {
        height += ' - 40px';
      }

      if (existsPaginationBar) {
        height += ' - 40px';
      }

      return `calc(${height})`;
    }

    /**
     * 定义返回模板
     */
    return () => {
      let childNodes: any = useSlots(slots);
      let tableBar: any = null, tabCols: any = [];
      editableTableProperties.editableTableColumns = {};

      if (props.rowCheckbox) {
        tabCols.push(<ElTableColumn type="selection" prop="rowCheckbox" label=" " width={60} selectable={props.selectableHandler}/>);
      }

      if (props.rowIndex) {
        tabCols.push(<ElTableColumn type="index" prop="rowIndex" label="序号" width={60} fixed={true}/>);
      }

      childNodes.sort((c1: any, c2: any) => {
        const c1SortProps: MagTableColumnSortType = c1.props?.['sort-props'] ?? c1.props?.sortProps;
        const c2SortProps: MagTableColumnSortType = c2.props?.['sort-props'] ?? c2.props?.sortProps;
        return c1SortProps && c2SortProps ? c1SortProps.sortNo - c2SortProps.sortNo : 0;
      });

      childNodes.map((node: any) => {
        if (node?.type?.name && node?.type?.name === MagTableBar.name) {
          tableBar = node;
        } else if (node?.type?.name && node?.type?.name.startsWith(MagTableColumn.name)) {
          tabCols.push(node);
          node?.props?.editable
          && (editableTableProperties.editableTable = true)
          && (editableTableProperties.editableTableColumns[node?.props?.prop] = {
            prop: node?.props?.prop,
            node: node?.children?.default?.()[0]
          })
        }
      });

      return <ElContainer v-show={componentVisible.value}
                          class={{
                            "mag-view-card-layout": true,
                            "is-shadow-layout": props.shadow,
                            "is-expanded": componentExpanded.value,
                            "is-collapsed": !componentExpanded.value
                          }}
                          v-loading={loadingStatus.value}>
        {createTableHeader()}
        <ElCollapseTransition>
          <ElMain class="mag-table__main" v-show={componentExpanded.value}>
            {createTableTopBars(tableBar)}
            <ElTable {...props}
                     {...attrs}
                     data={tableModel.rowData}
                     class={{
                       "mag-table__table": true,
                       "mag-table__exist-table-bars": !attrs.border && null !== tableBar,
                       "mag-table__empty-table-bars": !attrs.border && null === tableBar
                     }}
                     height={calculateTableHeightFunc(null != tableBar, props.usePage)}
                     show-overflow-tooltip
                     stripe>
              {tabCols}
            </ElTable>
            {createTablePaginationBar()}
          </ElMain>
        </ElCollapseTransition>
      </ElContainer>
    }
  }
});

export default MagTable;
