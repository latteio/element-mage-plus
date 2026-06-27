<template>
  <ElPageHeader
      :icon="ArrowLeft"
      @back="onBackFunc"
      :class="{
      'mag-page': true,
      'mag-view-card-layout': true,
      'is-shadow-layout': shadow
    }"
      v-bind="mergedAttrs"
  >
    <!-- 内容插槽 - 显示页面标题 -->
    <template #content>
      <span>{{ header }}</span>
    </template>

    <!-- 默认插槽 - 显示页面内容 -->
    <template #default>
      <slot/>
    </template>
  </ElPageHeader>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType} from 'vue';
import {Router} from 'vue-router';
import {ElPageHeader} from 'element-plus';
import {ArrowLeft} from '@element-plus/icons-vue';
import BasicComponent from '@/components/core/BasicComponent.ts';
import {useMergedAttrs} from "@/composables/ComposableUseProvider.ts";
import Strings from '@/utils/Strings';

export default defineComponent({
  name: 'MagPage',
  extends: BasicComponent,
  components: {
    ElPageHeader,
    ArrowLeft,
  },
  props: {
    header: {type: String, required: false, default: () => ""},
    router: {type: Object as PropType<Router>, required: true, default: () => null},
    backwardPath: {type: String, required: true, default: () => "/"},
    shadow: {type: Boolean as PropType<boolean>, required: false, default: () => true}
  },
  emits: ['pageReady'],
  setup(props, {attrs, emit, expose}) {
    let mergedAttrs = useMergedAttrs(props, attrs);

    /**
     * 定义组件外部方法
     */
    expose({
      getUrlParams: Strings.getUrlParams,
    });

    /**
     * 定义组件加载完成事件
     */
    onMounted(() => {
      emit('pageReady', Strings.getUrlParams());
    });

    /**
     * 定义页面后退事件
     */
    const onBackFunc = () => {
      if (props.backwardPath) {
        props.router.push(props.backwardPath);
      }
    };

    return {
      mergedAttrs,
      ArrowLeft,
      onBackFunc,
    };
  },
});
</script>

<style scoped>
</style>