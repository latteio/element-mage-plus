<template>
  <div class="mag-button-group"
       v-bind="mergedAttrs"
  >
    <template v-if="buttons && buttons.length > 0">
      <ElButton
          v-for="(btn, index) in buttons"
          :key="index"
          v-bind="btn"
      >
        {{ btn.label }}
      </ElButton>
    </template>

    <slot v-else/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {ElButton} from 'element-plus'
import {MagButtonType} from '@/types'
import BasicComponent from '@/components/core/BasicComponent.ts'
import {useMergedAttrs} from "@/composables/ComposableUseProvider.ts";

export default defineComponent({
  name: 'MagButtonGroup',
  extends: BasicComponent,
  components: {
    ElButton
  },
  props: {
    formType: {type: Boolean, required: false, default: () => true},
    prop: {type: String as PropType<string>, required: false, default: () => ""},
    label: {type: String, required: false, default: () => ""},
    buttons: {type: Array as PropType<MagButtonType[]>, required: false, default: () => []},
    buttonSpace: {type: Number, required: false, default: () => 8}
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