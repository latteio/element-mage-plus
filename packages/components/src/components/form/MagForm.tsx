import {defineComponent, h, reactive, ref} from "vue";
import {ElCol, ElCollapseTransition, ElContainer, ElForm, ElFormItem, ElHeader, ElIcon, ElMain, ElRow} from "element-plus";
import {ArrowRight, Refresh, Search} from "@element-plus/icons-vue";
import BasicViewComponent from "@/components/core/BasicViewComponent.ts";
import MagFormBar from "@/components/form/MagFormBar";
import MagFlexComponent from "@/components/basic/MagFlexComponent.vue";
import MagButton from "@/components/basic/MagButton.vue";
import {useInvoke, useSlots} from "@/composables/ComposableUseProvider.ts";
import Objects from "@/utils/Objects";

const MagForm = defineComponent({
  extends: BasicViewComponent,
  name: "MagForm",
  props: {
    region: {type: String, required: false, default: () => "center"},
    header: {type: String, required: false, default: () => ""},
    labelWidth: {type: [String, Number], required: false, default: () => "auto"},
    columns: {type: Number, required: false, default: () => 4},
    columnSpace: {type: Number, required: false, default: () => 8},
    model: {type: Object, required: false, default: () => new Object()},
    useQuery: {type: Boolean, required: false, default: () => false},
    queryAlign: {type: String, required: false, default: () => "center"}
  },
  emits: ["query", "reset"],
  setup(props, {attrs, slots, emit, expose}) {
    const componentRef = ref();
    const componentVisible = ref(props.visible);
    const componentExpanded = ref(props.expanded);
    const formModelCached = reactive({...props.model});
    const minHeight = ref(2 * 50);

    /**
     * 定义表单校验
     * @param successCallBack 成功回调函数
     * @param failureCallBack 失败回调函数
     */
    const validateFormFunc = (successCallBack: Function, failureCallBack: Function) => {
      componentRef.value.validate((isValid: boolean) => {
        if (isValid) {
          successCallBack && successCallBack(props.model || {});
        } else {
          failureCallBack && failureCallBack({});
        }
      });
    }

    /**
     * 定义重置表单字段: 清空验证信息
     */
    const resetFormFunc = () => {
      componentRef.value.resetFields();
      Objects.setObjectValues(props.model, formModelCached, true);
    }

    /**
     * 定义获取表单数据
     */
    const getFormDataFunc = () => {
      return props.model || {};
    }

    /**
     * 更新表单数据(包含缓存数据)
     */
    const updateFormDataFunc = (data: any) => {
      Objects.setObjectValues(props.model, data, true);
      Objects.setObjectValues(formModelCached, data, true);
    }

    /**
     * 设置组件可见性
     * @param visible
     */
    const setVisibleFunc = (visible: boolean) => {
      componentVisible.value = visible;
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
      setVisible: setVisibleFunc,
      setExpanded: setExpandedFunc,
      validateForm: validateFormFunc,
      resetForm: resetFormFunc,
      updateFormData: updateFormDataFunc,
      getFormData: getFormDataFunc,
      invoke: function (methodName: string, ...args: any[]) {
        return useInvoke(componentRef, methodName, args);
      }
    });

    /**
     * 定义 查询 按钮事件
     */
    const onClickQueryBtnFunc = (event: any) => {
      emit("query", event, props.model);
    }

    /**
     * 定义 重置 按钮事件
     */
    const onClickResetBtnFunc = (event: any) => {
      componentRef.value.resetFields();
      Objects.setObjectValues(props.model, formModelCached, true);
      emit("reset", event, props.model);
    }

    /**
     * 定义表单头部
     */
    const createFormHeader = () => {
      if (props.header) {
        return <ElHeader onClick={setExpandedInternalFunc}
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
     * 定义底部按钮组
     */
    const createFormBarNodes = (formBar: any) => {
      const itemsAlign = formBar?.props?.align || "left";
      return <div class={{
        "mag-view__view-bars mag-form__form-bars": true,
        "is-left-alignment": itemsAlign === "left",
        "is-right-alignment": itemsAlign === "right",
        "is-center-alignment": itemsAlign === "center"
      }}>
        <MagFormBar {...formBar?.props} {...formBar?.attrs} size={props.size}>
          {formBar?.children?.default?.()}
        </MagFormBar>
      </div>
    }

    /**
     * 定义查询/重置
     */
    const createQueryBtnNodes = () => {
      const itemsAlign = props.queryAlign || "center";
      return <div class={{
        "mag-view__view-bars mag-form__form-bars": true,
        "is-left-alignment": itemsAlign === "left",
        "is-right-alignment": itemsAlign === "right",
        "is-center-alignment": itemsAlign === "center"
      }}>
        <MagButton type="primary" size={props.size} icon={Search} onClick={onClickQueryBtnFunc}>查询</MagButton>
        <MagButton style="margin-left: 4px;" size={props.size} icon={Refresh} onClick={onClickResetBtnFunc}>重置</MagButton>
      </div>
    }

    /**
     * 表单组件布局: 列
     * @param cols
     */
    const createColumns = (cols: any) => {
      return <ElCol span={cols.span}>
        {
          cols.childNodes[0].props?.label
              ? (
                  <ElFormItem label-width={props.labelWidth}
                              label={cols.childNodes[0].props?.label}
                              prop={cols.childNodes[0].props?.prop}>
                    {
                      cols.childNodes.map((node: any) => {
                        return h(node, {...node.props, size: props.size}, node.children)
                      })
                    }
                  </ElFormItem>
              )
              : (
                  <MagFlexComponent class={`el-form-item el-form-item--${props.size}`}
                                    {...cols.childNodes[0].props}
                                    {...cols.childNodes[0].attrs}>
                    {
                      cols.childNodes.map((node: any) => {
                        return h(node, {...node.props, size: props.size}, node.children)
                      })
                    }
                  </MagFlexComponent>
              )
        }
      </ElCol>
    }

    /**
     * 表单组件布局: 行布局
     */
    const createRows = () => {
      let childNodes: any = useSlots(slots);
      let formBar: any = null;
      let columnSpan = 24 / props.columns;
      let rowsJson: any = [], i = 0;
      if (childNodes.length > 0) {
        rowsJson[i] = {cols: []};
        let columnCount = props.columns;
        for (let childNode of childNodes) {
          if (childNode.type?.name === MagFormBar.name) {
            formBar = childNode;
            continue;
          }

          let spanCount: number = Math.min(childNode?.props?.span || 1, props.columns);
          if (spanCount == -1) {
            let rowCols = rowsJson[i]["cols"];
            let lastCol: any = rowCols.length > 0
                ? rowCols[rowCols.length - 1]
                : {span: columnSpan, childNodes: []};
            lastCol.childNodes.push(childNode);
          } else if (columnCount >= spanCount) {
            rowsJson[i]["cols"].push({span: columnSpan * spanCount, childNodes: [childNode]});
            columnCount -= spanCount;
          } else {
            rowsJson[++i] = {cols: []};
            columnCount = props.columns;
            if (columnCount >= spanCount) {
              rowsJson[i]["cols"].push({span: columnSpan * spanCount, childNodes: [childNode]});
              columnCount -= spanCount;
            }
          }
        }
      }

      if (rowsJson.length >= 1) {
        /* 普通表单 */
        if (!props.useQuery) {
          return <>
            {formBar
                && (!formBar.props?.position || formBar.props?.position === "top")
                && createFormBarNodes(formBar)}

            {rowsJson.map((row: any) => {
              return <ElRow gutter={props.columnSpace}>
                {row.cols.map((cols: any) => {
                  return createColumns(cols)
                })}
              </ElRow>
            })}

            {formBar
                && (formBar.props?.position && formBar.props?.position === "bottom")
                && createFormBarNodes(formBar)}
          </>
        }

        /* 查询表单: 启用查询 */
        return <>
          {rowsJson.map((row: any) => {
            return <ElRow gutter={props.columnSpace}>
              {row.cols.map((cols: any) => {
                return createColumns(cols)
              })}
            </ElRow>
          })}
          {createQueryBtnNodes()}
        </>
      }

      return <></>
    }

    /**
     * 定义返回模板
     */
    return () => {
      return <ElContainer v-show={componentVisible.value}
                          class={{
                            "mag-view-card-layout": true,
                            "is-shadow-layout": props.shadow,
                            "is-expanded": componentExpanded.value,
                            "is-collapsed": !componentExpanded.value
                          }}>
        {createFormHeader()}
        <ElCollapseTransition>
          <ElMain class="mag-form__main" style={`height: ${minHeight}px;`} v-show={componentExpanded.value}>
            <ElForm {...props} {...attrs} ref={componentRef}>
              {createRows()}
            </ElForm>
          </ElMain>
        </ElCollapseTransition>
      </ElContainer>
    }
  }
});

export default MagForm;
