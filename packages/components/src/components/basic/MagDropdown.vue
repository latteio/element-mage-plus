<template>
  <ElDropdown
      v-if="buttonType"
      split-button
      trigger="click"
      v-bind="mergedAttrs"
      @command="handleCommandFunc"
  >
    {{ header }}
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
            v-for="item in dataOptionsInternal"
            :key="item.value"
            :command="item.value"
            v-bind="item"
        >
          {{ item.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>

  <ElDropdown
      v-else
      trigger="click"
      v-bind="mergedAttrs"
      @command="handleCommandFunc"
  >
    <ElText v-bind="mergedAttrs">
      {{ header }}
      <ElIcon class="el-icon__right">
        <ArrowDown/>
      </ElIcon>
    </ElText>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
            v-for="item in dataOptionsInternal"
            :key="item.value"
            :command="item.value"
            v-bind="item"
        >
          {{ item.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive} from 'vue';
import {ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElText} from 'element-plus';
import {ArrowDown} from '@element-plus/icons-vue';
import {MagDropdownOptionType} from '@/types';
import BasicComponent from '@/components/core/BasicComponent.ts';
import {useMergedAttrs} from "@/composables/ComposableUseProvider.ts";
import Objects from '@/utils/Objects';

export default defineComponent({
  name: 'MagDropdown',
  extends: BasicComponent,
  components: {
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElIcon,
    ElText,
    ArrowDown,
  },
  props: {
    prop: {type: String as PropType<string>, required: false, default: () => ""},
    label: {type: String, required: false, default: () => ""},
    header: {type: String, required: true, default: () => ""},
    buttonType: {type: Boolean, required: false, default: () => false},
    dataOptions: {type: Array as PropType<MagDropdownOptionType[]>, required: false, default: () => []},
    dataOptionsProvider: {type: Function as PropType<(scope: any) => Array<any>>, required: false, default: () => []},
    clickOption: {type: Function as PropType<(val: any, scope: any) => void>, required: true, default: () => void (0)}
  },
  setup(props, {attrs}) {
    let mergedAttrs = useMergedAttrs(props, attrs);

    /**
     * 定义 item 数据项集
     */
    const dataOptionsInternal = reactive<Array<MagDropdownOptionType>>(
        !Objects.isEmpty(props.dataOptions)
            ? props.dataOptions
            : props.dataOptionsProvider(props.dataScope)
    );

    /**
     * 定义处理点击事件
     */
    const handleCommandFunc = (val: any) => {
      props.clickOption(val, props.dataScope);
    };

    /**
     * 定义返回
     */
    return {
      mergedAttrs,
      dataOptionsInternal,
      handleCommandFunc,
    };
  },
});
</script>

<style scoped>
.el-icon__right {
  margin-left: 4px;
}
</style>