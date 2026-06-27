import {defineComponent, PropType} from "vue";
import {ElTableColumn, ElTag} from "element-plus";
import {MagElmType, MagTableColumnSortType, MagTableColumnTagOptionType} from "@/types/element-mage-plus-types.ts";
import Objects from "@/utils/Objects";

const MagTableColumnTag = defineComponent({
  name: "MagTableColumnTag",
  props: {
    prop: {type: String, required: true, default: () => ""},
    label: {type: String, required: true, default: () => ""},
    sortProps: {type: Object as PropType<MagTableColumnSortType>, required: false, default: () => null},
    dataOptions: {type: Array as PropType<MagTableColumnTagOptionType[]>, required: false, default: () => []},
    visibleHandler: {type: Function as PropType<(scope: any) => boolean>, required: false, default: () => true}
  },
  setup(props, {attrs}) {
    /**
     * 定义插槽节点
     * @param scope
     */
    const createDefaultNode = (scope: any) => {
      if (!props.visibleHandler(scope)) {
        return <></>
      }

      let tagType: MagElmType = "info", tagValue = scope.row["" + props.prop], tagColor = "";
      let notNullAndBlackVal = tagValue !== undefined && tagValue !== null && tagValue !== "";
      if (!Objects.isEmpty(props.dataOptions)) {
        for (let opt of props.dataOptions) {
          if (opt.value == tagValue) {
            tagType = opt.type || "primary";
            tagValue = opt.label || tagValue;
            tagColor = opt.color ? opt.color : tagColor;
            break;
          }
        }
      }

      return notNullAndBlackVal ? <ElTag type={tagType} color={tagColor}>{tagValue}</ElTag> : ""
    }

    /**
     * 定义返回模板
     */
    return () => {
      return <ElTableColumn {...props} {...attrs} v-slots={{default: createDefaultNode}}>
      </ElTableColumn>
    }
  }
});

export default MagTableColumnTag;
