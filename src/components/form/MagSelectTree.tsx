import {defineComponent, nextTick, onMounted, PropType, reactive, ref} from "vue";
import {ElTreeSelect} from "element-plus";
import {AxiosResponse} from "axios";
import {MagSelectTreeOptionType} from "@/types/element-mage-plus-types.ts";
import BasicFormComponent from "@/components/core/BasicFormComponent.ts";
import MagFlexComponent from "@/components/basic/MagFlexComponent.vue";
import Objects from "@/utils/Objects";

const MagSelectTree = defineComponent({
  extends: BasicFormComponent,
  name: "MagSelectTree",
  props: {
    type: {type: String, required: false, default: () => "select-tree"},
    data: {type: Array as PropType<MagSelectTreeOptionType[]>, required: false, default: () => []},
    dataLoader: {type: Function as PropType<(params: any) => Promise<AxiosResponse<any>>>, required: false, default: () => null},
    dataParams: {type: Object, required: false, default: () => null},
    autoLoad: {type: Boolean, required: false, default: () => true},
    dataPropKey: {type: String, required: false, default: () => null},
    checkedDataPropKey: {type: String, required: false, default: () => null}
  },
  setup(props, {attrs, expose}) {
    const loadingStatus = ref(false);

    /**
     * 定义下拉树内置模型变量
     */
    const selectTreeModel = reactive({
      /* 初始化数据 */
      selectTreeOptionsData: (props.dataPropKey && props.checkedDataPropKey) ? (props.data as any)[props.dataPropKey as string] : (Objects.isArray(props.data) ? props.data : [props.data]),
      /* 初始化勾选数据 */
      selectTreeOptionsCheckedKeys: (props.dataPropKey && props.checkedDataPropKey) ? (props.data as any)[props.checkedDataPropKey as string] : [],
      /* 获取数据的参数 */
      selectParams: {...props.dataParams}
    });

    /**
     * 内部方法: 加载数据
     * @param data
     */
    const loadDataFunc = (data: any) => {
      selectTreeModel.selectTreeOptionsData = (props.dataPropKey && props.checkedDataPropKey) ? data[props.dataPropKey as string] : (Objects.isArray(data) ? data : [data]);
      selectTreeModel.selectTreeOptionsCheckedKeys = (props.dataPropKey && props.checkedDataPropKey) ? data[props.checkedDataPropKey as string] : []
    }

    /**
     * 内部方法: 异步加载数据
     * @param params 查询参数
     * @param beforeLoader 数据加载前的处理(需要返回处理后的数据)
     */
    const loadDataAsynFunc = (params: any, ...beforeLoader: Array<Function | undefined>) => {
      if (props.dataLoader) {
        loadingStatus.value = true;
        props.dataLoader({...selectTreeModel.selectParams, ...params}).then(({data}: any) => {
          let handledData: any = (beforeLoader && beforeLoader[0]) ? beforeLoader[0](data) : data;
          loadDataFunc(handledData);
        }).catch((e: any) => {
          console.log('loadDataAsynFunc(): An exception occurred while requesting data: ', e)
        }).finally(() => {
          loadingStatus.value = false;
        });
      }
    }

    /**
     * 定义组件外部方法
     */
    expose({
      load: loadDataAsynFunc,
      loadData: loadDataFunc
    });

    /**
     * 定义页面准备好后执行事件
     */
    onMounted(() => {
      nextTick(() => {
        if (props.autoLoad && Objects.isEmpty(selectTreeModel.selectTreeOptionsData)) {
          loadDataAsynFunc({});
        }
      }).then(() => {
      });
    });

    /**
     * 定义返回模板
     */
    return () => {
      if (props.formType) {
        return <ElTreeSelect {...props} {...attrs}
                             v-model={props.model[props.prop]}
                             data={selectTreeModel.selectTreeOptionsData}
                             filterable
                             loading={loadingStatus.value}
                             show-checkbox={props.checkedDataPropKey != null}
                             default-checked-keys={props.checkedDataPropKey != null ? selectTreeModel.selectTreeOptionsCheckedKeys : []}>
        </ElTreeSelect>
      }

      return <MagFlexComponent {...props} {...attrs}>
        <ElTreeSelect {...props} {...attrs}
                      v-model={props.model[props.prop]}
                      data={selectTreeModel.selectTreeOptionsData}
                      filterable
                      loading={loadingStatus.value}
                      show-checkbox={props.checkedDataPropKey != null}
                      default-checked-keys={props.checkedDataPropKey != null ? selectTreeModel.selectTreeOptionsCheckedKeys : []}>
        </ElTreeSelect>
      </MagFlexComponent>
    }
  }
});

export default MagSelectTree;
