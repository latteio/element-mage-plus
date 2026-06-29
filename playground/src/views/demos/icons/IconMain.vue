<template>
  <div>
    <el-divider content-position="left">图标相关</el-divider>
    <mag-icon :name="Edit"/>
    <mag-icon name="Button"/>
    <mag-icon name="Dict"/>
    <mag-icon name="Help"/>
    <mag-icon name="Lang"/>
    <mag-icon name="Log"/>
    <mag-icon name="Menu"/>
    <mag-icon name="MenuGroup"/>
    <mag-icon name="Org"/>
    <mag-icon name="Outlink"/>
    <mag-icon name="Project"/>
    <mag-icon name="ProjectMember"/>
    <mag-icon name="Query"/>
    <mag-icon name="Role"/>
    <mag-icon name="RolePerms"/>
    <mag-icon name="Todo"/>
    <mag-icon name="TodoRoutine"/>
    <mag-icon name="Undo"/>
    <mag-icon name="User"/>
    <mag-icon name="Employee"/>
    <mag-icon name="Bookmark"/>
    <mag-icon name="HeartLine"/>
    <mag-icon name="SanYuan"/>
    <mag-icon name="SysLog"/>
    <mag-icon name="Save"/>
    <mag-icon name="SaveAll"/>
    <mag-icon name="DataImport"/>
    <mag-icon name="Exam"/>
    <mag-icon name="Exit"/>
    <mag-icon name="BatchDelete"/>
    <mag-icon name="LeftRightArrows"/>
    <mag-icon name="MoreOthers"/>
    <mag-icon name="CrossRing"/>
    <mag-icon name="CloseOthers"/>
    <mag-icon name="Lock"/>
    <mag-icon name="Unlock"/>
    <mag-icon name="PageFirst"/>
    <mag-icon name="PagePrev"/>
    <mag-icon name="PageNext"/>
    <mag-icon name="PageLast"/>
    <mag-icon name="Submit"/>
    <mag-icon name="Rollback"/>
    <mag-icon name="DoctorCap"/>
    <mag-icon name="Remove"/>
    <mag-icon name="CloseOthers"/>
    <mag-icon name="LeftRightArrows"/>
    <mag-icon name="Close"/>
    <mag-icon name="Plus"/>
    <br/>
    <el-button type="primary" icon="mag-icon-plus"></el-button>
    <el-button type="primary" @click="onDialogOpen" icon="mag-icon-save">打开图标选择</el-button>
    <el-button type="primary" @click="onDialogOpen" icon="mag-icon-batch-save">打开图标选择</el-button>
  </div>
  <mag-icon-dialog ref="iconDialogRef" :model="dialogModel" @dialog-confirm="onDialogConfirm" @dialog-cancel="onDialogCancel"/>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue';
import {Edit} from "@element-plus/icons-vue";

const iconDialogRef = ref();
const dialogModel = reactive({
  visible: false,
  fullscreen: false,
  header: '',
  headerAlign: 'center',
  footerAlign: 'center',
  data: {},
  onClose: (retValues: any) => {
    console.log(retValues)
  }
});

const onDialogOpen = () => {
  dialogModel.visible = true;
  // dialogModel.fullscreen = true;
}

const onDialogConfirm = (val: any) => {
  console.log(val)
  iconDialogRef.value.closeDialog({})
}

const onDialogCancel = (val: any) => {
  console.log(val)
  iconDialogRef.value.closeDialog({})
}

onMounted(() => {
});
</script>

<style scoped lang="scss">
</style>