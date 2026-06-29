<template>
  <div :style="{ height: height > 0 ? height + 'px' : 'auto' }"
       class="mag-title"
       v-bind="mergedAttrs"
  >
    <div :class="[
        'mag-title__main-title',
        `mag-font-size-${fontSize}`,
        `mag-font-weight-${fontWeight}`
      ]"
    >
      {{ title }}
    </div>

    <div v-if="subTitle"
         :class="[
        'mag-title__sub-title',
        `mag-title__sub-title-${subType}`,
        `mag-font-size-${fontSize - 8}`,
        `mag-font-weight-${fontWeight}`
      ]"
    >
      {{ subTitle }}
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useMergedAttrs} from "@/composables/ComposableUseProvider.ts";

export default defineComponent({
  name: 'MagTitle',
  props: {
    formType: {type: Boolean, required: false, default: () => false},
    title: {type: String, required: true, default: () => ""},
    subTitle: {type: String, required: false, default: () => ""},
    subType: {type: String, required: false, default: () => "primary"},
    fontSize: {type: Number, required: false, default: () => 24},
    fontWeight: {type: String, required: false, default: () => "normal"},
    height: {type: Number as PropType<number>, required: false, default: () => -1}
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
})
</script>

<style lang="scss" scoped>
</style>