import {defineComponent, PropType} from 'vue';
import {MagElmType} from "@/types";

const BasicComponent = defineComponent({
  name: 'BasicComponent',
  props: {
    type: {type: String as PropType<MagElmType>, required: false, default: () => ""},
    dataScope: {type: Object as PropType<any>, required: false, default: () => new Object()},
    span: {type: Number as PropType<number>, required: false, default: () => 1},
    size: {type: String as PropType<string>, required: false, default: () => "default"},
    visibleHandler: {type: Function as PropType<(scope: any) => boolean>, required: false, default: () => true}
  },
  setup(_, {slots}) {
    return () => slots.default?.()
  }
});

export default BasicComponent;
