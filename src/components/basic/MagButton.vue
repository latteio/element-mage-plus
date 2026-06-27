<template>
  <ElButton :loading="loadingStatus"
            v-bind="mergedAttrs"
            @click="onClickFunc"
  >
    <slot></slot>
  </ElButton>
</template>

<script lang="ts">
import {defineComponent, PropType, ref} from "vue";
import {ElButton} from "element-plus";
import BasicComponent from "@/components/core/BasicComponent.ts";
import {useMergedAttrs} from "@/composables/ComposableUseProvider.ts";

export default defineComponent({
  name: "MagButton",
  extends: BasicComponent,
  components: {
    ElButton
  },
  props: {
    formType: {type: Boolean, required: false, default: () => true},
    prop: {type: String as PropType<string>, required: false, default: () => ""},
    label: {type: String, required: false, default: () => ""},
    onClick: {
      type: Function as PropType<(e: MouseEvent) => Promise<void> | void>,
      required: false
    }
  },
  emits: ["click"],
  setup(props, {attrs}) {
    const loadingStatus = ref(false);

    const mergedAttrs = useMergedAttrs(props, attrs, ['onClick', 'loading']);

    const onClickFunc = async (event: MouseEvent) => {
      event && event.stopPropagation();
      if (loadingStatus.value) return;
      loadingStatus.value = true;
      try {
        /* 执行定义点击事件 */
        const onClickInternal: any = props?.onClick || attrs?.onClick;
        onClickInternal && await onClickInternal(event);
      } finally {
        loadingStatus.value = false;
      }
    }

    /**
     * 定义返回
     */
    return {
      mergedAttrs,
      loadingStatus,
      onClickFunc
    }
  }
});
</script>

<style lang="scss" scoped>
</style>