<template>
  <div class="mag-flex-component"
       v-bind="mergedAttrs"
  >
    <div
        :class="`mag-flex-component__label_${size}`"
        :style="{ width: calcLabelWidthFunc }"
        class="mag-flex-component__label"
    >
      {{ label }}
    </div>
    <div
        :class="`mag-flex-component__compo_${size}`"
        class="mag-flex-component__compo"
    >
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'
import BasicComponent from '@/components/core/BasicComponent.ts'
import {useMergedAttrs} from "@/composables/ComposableUseProvider.ts";

export default defineComponent({
  name: 'MagFlexComponent',
  extends: BasicComponent,
  props: {
    formType: {type: Boolean, required: false, default: () => false},
    prop: {type: String as PropType<string>, required: false, default: () => ""},
    label: {type: String, required: false, default: () => ""},
    labelWidth: {type: [String, Number], required: false, default: () => "auto"}
  },
  setup(props, {attrs}) {
    let mergedAttrs = useMergedAttrs(props, attrs);

    /**
     * 动态计算组件 label 宽度
     */
    const calcLabelWidthFunc = computed(() => {
      if (!props.label) return '0'

      if (props.labelWidth === 'auto') {
        return 'auto'
      }

      return typeof props.labelWidth === 'string' && props.labelWidth.endsWith('px')
          ? props.labelWidth
          : `${props.labelWidth}px`
    })

    /**
     * 定义返回
     */
    return {
      mergedAttrs,
      calcLabelWidthFunc
    }
  }
})
</script>

<style lang="scss" scoped>
</style>