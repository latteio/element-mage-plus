<template>
  <ElDivider v-bind="mergedAttrs"
  >
    <slot></slot>
  </ElDivider>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {ElDivider} from "element-plus";
import BasicComponent from "@/components/core/BasicComponent.ts";
import {useMergedAttrs} from "@/composables/ComposableUseProvider.ts";

export default defineComponent({
  name: "MagDivider",
  extends: BasicComponent,
  components: {
    ElDivider
  },
  props: {
    formType: {type: Boolean, required: false, default: () => false},
    prop: {type: String as PropType<string>, required: false, default: () => ""},
    label: {type: String, required: false, default: () => ""},
  },
  setup(props, {attrs}) {
    let mergedAttrs = useMergedAttrs(props, attrs);

    /**
     * 定义返回
     */
    return {
      mergedAttrs
    }
  }
});
</script>

<style lang="scss" scoped>

</style>