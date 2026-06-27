import {defineComponent, nextTick, onMounted, PropType, reactive, ref} from "vue";
import {ElOption, ElSelect} from "element-plus";
import {AxiosResponse} from "axios";
import {MagSelectOptionType} from "@/types/element-mage-plus-types.ts";
import BasicFormComponent from "@/components/core/BasicFormComponent.ts";
import MagFlexComponent from "@/components/basic/MagFlexComponent.vue";
import Objects from "@/utils/Objects";

const MagSelect = defineComponent({
  extends: BasicFormComponent,
  name: "MagSelect",
  props: {
    type: {type: String, required: false, default: () => "select"},
    data: {type: Array as PropType<MagSelectOptionType[]>, required: false, default: () => []},
    dataLoader: {type: Function as PropType<(params: any) => Promise<AxiosResponse<any>>>, required: false, default: () => null},
    dataParams: {type: Object, required: false, default: () => null},
    autoLoad: {type: Boolean, required: false, default: () => true}
  },
  setup(props, {attrs, expose}) {
    const loadingStatus = ref(false);

    /**
     * 定义下拉列表内置模型变量
     */
    const selectModel = reactive({
      /* 初始化数据 */
      selectOptionsData: props.data,
      /* 获取数据的参数 */
      selectParams: {...props.dataParams}
    });

    /**
     * 内部方法: 加载数据
     * @param data
     */
    const loadDataFunc = (data: Array<MagSelectOptionType>) => {
      selectModel.selectOptionsData = data;
    }

    /**
     * 内部方法: 异步加载数据
     * @param params 查询参数
     * @param beforeLoader 数据加载前的处理(需要返回处理后的数据)
     */
    const loadDataAsyncFunc = (params: any, ...beforeLoader: Array<Function | undefined>) => {
      if (props.dataLoader) {
        loadingStatus.value = true;
        props.dataLoader({...selectModel.selectParams, ...params}).then(({data}: any) => {
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
     * 定义组件外部方法
     */
    expose({
      load: loadDataAsyncFunc,
      loadData: loadDataFunc
    });

    /**
     * 定义页面准备好后执行事件
     */
    onMounted(() => {
      nextTick(() => {
        if (props.autoLoad && Objects.isEmpty(selectModel.selectOptionsData)) {
          loadDataAsyncFunc({});
        }
      }).then(() => {
      });
    });

    /**
     * 定义返回模板
     */
    return () => {
      if (props.formType) {
        return <ElSelect {...props}
                         {...attrs}
                         filterable
                         v-model={props.model[props.prop]}
                         loading={loadingStatus.value}>
          {
            selectModel.selectOptionsData.map((opt: MagSelectOptionType) => <ElOption {...opt} ></ElOption>)
          }
        </ElSelect>
      }

      return <MagFlexComponent {...props} {...attrs}>
        <ElSelect {...props}
                  {...attrs}
                  filterable
                  v-model={props.model[props.prop]}
                  loading={loadingStatus.value}>
          {
            selectModel.selectOptionsData.map((opt: MagSelectOptionType) => <ElOption {...opt} ></ElOption>)
          }
        </ElSelect>
      </MagFlexComponent>
    }
  }
});

export default MagSelect;
