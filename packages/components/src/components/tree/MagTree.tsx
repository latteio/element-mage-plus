import {defineComponent, h, nextTick, onMounted, PropType, reactive, ref} from "vue";
import {ElCollapseTransition, ElContainer, ElHeader, ElIcon, ElMain, ElTree} from "element-plus";
import {ArrowRight} from "@element-plus/icons-vue";
import {AxiosResponse} from "axios";
import MagTreeBar from "@/components/tree/MagTreeBar";
import BasicViewComponent from "@/components/core/BasicViewComponent.ts";
import {useSlots} from "@/composables/ComposableUseProvider.ts";
import Objects from "@/utils/Objects";

const MagTree = defineComponent({
  extends: BasicViewComponent,
  name: "MagTree",
  props: {
    region: {type: String, required: false, default: () => "center"},
    header: {type: String, required: false, default: () => ""},
    data: {type: Array as PropType<any[]>, required: false, default: () => []},
    dataLoader: {type: Function as PropType<(params: any) => Promise<AxiosResponse<any>>>, required: false, default: () => null},
    dataParams: {type: Object, required: false, default: () => null},
    autoLoad: {type: Boolean, required: false, default: () => true},
    dataPropKey: {type: String, required: false, default: () => null},
    checkedDataPropKey: {type: String, required: false, default: () => null}
  },
  setup(props, {attrs, slots, expose}) {
    const componentVisible = ref(props.visible);
    const componentExpanded = ref(props.expanded);
    const loadingStatus = ref(false);

    /**
     * 定义树内置模型变量
     */
    const treeModel = reactive({
      data: (props.dataPropKey && props.checkedDataPropKey) ? (props.data as any)[props.dataPropKey as string] : (Objects.isArray(props.data) ? props.data : [props.data]),
      checkedKeys: (props.dataPropKey && props.checkedDataPropKey) ? (props.data as any)[props.checkedDataPropKey as string] : [],
      dataParams: {...props.dataParams}
    });

    /**
     * 内部方法: 加载数据
     * @param data
     */
    const loadDataFunc = (data: any) => {
      if (data) {
        treeModel.data = (props.dataPropKey && props.checkedDataPropKey) ? data[props.dataPropKey as string] : (Objects.isArray(data) ? data : [data]);
        treeModel.checkedKeys = (props.dataPropKey && props.checkedDataPropKey) ? data[props.checkedDataPropKey as string] : []
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
        props.dataLoader({...treeModel.dataParams, ...params}).then(({data}: any) => {
          let handledData: any = (beforeLoader && beforeLoader[0]) ? beforeLoader[0](data) : data;
          loadDataFunc(handledData);
        }).catch((e: any) => {
          console.log('loadDataAsyncFunc(): An exception occurred while requesting data: ', e)
        }).finally(() => {
          loadingStatus.value = false;
        });
      }
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
          params: treeModel.dataParams
        }
      },
      setVisible: (visible: boolean) => {
        componentVisible.value = visible;
      },
      setExpanded: setExpandedFunc,
      load: loadDataAsyncFunc,
      loadData: loadDataFunc
    });

    /**
     * 定义页面准备好后执行事件
     */
    onMounted(() => {
      nextTick(() => {
        if (props.autoLoad && Objects.isEmpty(treeModel.data)) {
          loadDataAsyncFunc({});
        }
      }).then(() => {
      });
    });

    /**
     * 定义返回模板
     */
    return () => {
      let childNodes: any = useSlots(slots);
      let treeBar: any = null;

      childNodes && childNodes.map((node: any) => {
        if (node?.type?.name && node?.type?.name === MagTreeBar.name) {
          treeBar = node;
        }
      });

      const createTreeHeader = () => {
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

      const createTreeBody = () => {
        if (null != treeBar) {
          return <ElTree {...props} {...attrs}
                         data={treeModel.data}
                         show-checkbox={props.checkedDataPropKey != null}
                         default-checked-keys={props.checkedDataPropKey != null ? treeModel.checkedKeys : []}
                         v-slots={{
                           default: (data: any) =>
                               h(MagTreeBar, {treeProps: {...attrs?.props as any}, dataScope: {...data}},
                                   {default: () => treeBar?.children?.default?.()})
                         }}>
          </ElTree>
        } else {
          return <ElTree {...props} {...attrs}
                         data={treeModel.data}
                         show-checkbox={props.checkedDataPropKey != null}
                         default-checked-keys={props.checkedDataPropKey != null ? treeModel.checkedKeys : []}>
          </ElTree>
        }
      }

      return <ElContainer v-show={componentVisible.value}
                          class={{
                            "mag-view-card-layout": true,
                            "is-shadow-layout": props.shadow,
                            "is-expanded": componentExpanded.value,
                            "is-collapsed": !componentExpanded.value
                          }}
                          v-loading={loadingStatus.value}>
        {createTreeHeader()}
        <ElCollapseTransition>
          <ElMain class="mag-tree__main" v-show={componentExpanded.value}>
            {createTreeBody()}
          </ElMain>
        </ElCollapseTransition>
      </ElContainer>
    }
  }
});

export default MagTree;
