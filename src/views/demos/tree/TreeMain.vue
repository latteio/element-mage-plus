<template>
  <mag-border-layout>
    <mag-tree region="center" header="权限菜单树" ref="roleTreeRef" node-key="id" :props="roleTreeProps" default-expand-all
              :data-loader="getRoleMenus" :params="queryParams" data-prop-key="menus" checked-data-prop-key="checkedMenuKeys" @node-click="onClick">
      <mag-tree-bar>
        <mag-button type="primary" @click.stop="onAdd">新增</mag-button>
        <mag-button type="primary" @click.stop="onUpload">上传</mag-button>
        <mag-button type="primary" @click.stop="onDownload">下载</mag-button>
      </mag-tree-bar>
    </mag-tree>
  </mag-border-layout>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {ApiRequest} from "@/utils";

const roleTreeRef = ref();
const roleTreeProps = {
  label: 'title'
};

const queryParams = {id: '486473489193107456', code: 1, name: 2};

const onClick = (a: any, b: any, c: any, d: any) => {
  console.log('a', a)
  console.log('b', b)
  console.log('c', c)
  console.log('d', d)
}

const onAdd = (_: any, node: any) => {
  console.log('add', node)
}

const onUpload = (_: any, node: any) => {
  console.log('upload', node)
}

const onDownload = (_: any, node: any) => {
  console.log('download', node)
}

const getRoleMenus = (data?: object) => {
  return ApiRequest({
    url: '/api/system/role/getRoleMenus',
    method: 'post',
    data: data
  });
}

onMounted(() => {
})
</script>

<style scoped lang="scss">
</style>
