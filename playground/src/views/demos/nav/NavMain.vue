<template>
  <div>
    <mag-dropdown :click-option="onClickDropdownOption" :data-options="dropdownOptions" header="菜单类型" :button-type="true"
                  type="danger"/>
  </div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue';
import {MagDropdownOptionType} from "@/types/element-mage-plus-types";

const dropdownOptions: MagDropdownOptionType[] = [
  {
    value: 'group',
    label: '菜单组',
    icon: 'MagIconMenuGroup'
  },
  {
    value: 'menu',
    label: '菜单项',
    icon: 'MagIconMenu'
  }, {
    value: 'outLink',
    label: '操作权限',
    icon: "MagIconOutlink"
  }
];

const onClickDropdownOption = (value: string) => {
  console.log('value===', value)
}

onMounted(() => {
});
</script>

<style scoped lang="scss">
</style>