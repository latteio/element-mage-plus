<template>
  <mag-border-layout>
    <mag-form size="default" region="north" :height="215" header="查询表单" :model="formData" :columns="3" ref="formRef" :use-query="true" query-align="left" :expanded="true">
      <mag-input :model="formData" prop="name" label="姓名：" placeholder="请输入姓名" clearable/>
      <mag-select :model="formData" prop="gender" label="性别：" :data="genders" placeholder="请选择性别" clearable ref="genderRef"/>
      <mag-input-number :model="formData" prop="age" :min="0" :max="150" :step="10" label="年龄：" placeholder="请输入年龄" clearable/>
      <mag-select :model="formData" prop="city" :data="cities " label="城市：" placeholder="请选择所在城市" clearable/>
      <mag-select-tree :model="formData" prop="org" :data="orgs" label="机构树：" placeholder="请选择所在机构" clearable ref="orgRef"
                       node-key="id" :props="{label: 'orgName'}"/>
    </mag-form>
    <mag-table region="center" :visible="true" header="表格样例" ref="empTableRef" :border="true" :row-checkbox="true" :row-index="true"
               :data-loader="employeeApi.getPageData" :data-params="queryParams" :use-page="true" page-align="center"
               @data-filter="filterFunc">
      <mag-table-bar>
        <mag-button :icon="Plus" @click="addRow">新增</mag-button>
        <mag-input :form-type="false" :model="formData" prop="name" label="姓名: " label-width="60" placeholder="请输入姓名" clearable/>
        <mag-select-date :form-type="false" :model="formData" prop="birth" label="出生日期：" label-width="100" placeholder="请选择出生日期" clearable/>
      </mag-table-bar>

      <mag-table-column prop="code" label="员工编码" :filterable="true" :sort-props="{sortNo: 2}">
        <mag-input :model="formData" prop="code" placeholder="请输入员工编码" clearable/>
      </mag-table-column>

      <mag-table-column prop="gender" label="性别" :filterable="true" :sort-props="{sortNo: 1}">
        <mag-select :model="formData" prop="gender" placeholder="请选择性别" clearable :data="genderOptions"/>
      </mag-table-column>

      <mag-table-column prop="name" label="员工姓名" :filterable="true">
        <mag-input :model="formData" prop="name" placeholder="请输入员工姓名" clearable/>
      </mag-table-column>

      <mag-table-column prop="idNumber" label="身份证号"/>
      <mag-table-column prop="orgName" label="所属机构" :filterable="true">
        <mag-select-tree :model="formData" prop="orgId" placeholder="请选择机构" :data="orgs" node-key="id" :props="{label:'orgName'}" clearable/>
      </mag-table-column>

      <mag-table-column prop="entryTime" label="入职日期" :filterable="true">
        <mag-select-date :model="formData" prop="entryTime" type="daterange" valueFormat="YYYY-MM-DD" placeholder="请选择入职日期"/>
      </mag-table-column>

      <mag-table-column-switch prop="isEnabled" label="是否启用" :change-handler="changeFunc"/>
      <mag-table-column-buttons prop="buttons" label="操作" width="400">
        <mag-button type="primary" :icon="Edit" @click.stop="editFunc" :visible-handler="editVisibleFunc">编辑</mag-button>
        <mag-confirm-button type="danger" :icon="Delete" @click.stop="deleFunc" message="确定要删除吗？" :visible-handler="deleteVisibleFunc">删除</mag-confirm-button>
        <mag-button @click.stop="viewFunc" :icon="Search" :visible-handler="viewVisibleFunc">查看</mag-button>
        <mag-dropdown :click-option="onClickDropdownOption" :data-options-provider="dropdownOptionsProvider" header="菜单类型" :button-type="true"/>
      </mag-table-column-buttons>
    </mag-table>
  </mag-border-layout>
  <EditDialogView :model="dialogModel"></EditDialogView>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {Delete, Edit, Plus, Search} from "@element-plus/icons-vue";
import EditDialogView from "@/views/demos/table/EditDialogView.vue";
import {ApiRequest} from '@/utils';
import {cities, genders, orgs} from "../mainData";

const formRef = ref();
const empTableRef = ref();
const queryParams = {cid: 1};
const dialogModel = reactive({
  header: '',
  visible: false,
  fullscreen: false,
  data: {},
  onClose(retValues: any) {
    console.log(retValues)
  }
});

const formData = reactive({
  code: null,
  name: null,
  gender: null,
  orgId: null,
  entryTime: null
})

const genderOptions = [
  {value: 1, label: '男', type: 'primary'},
  {value: 2, label: '女', type: 'success'},
  {value: 0, label: '未知', type: 'danger', color: '#fff'}
];

const selectableHandler = (data: any) => {
  return data && data.code === '10000';
}

const filterFunc = (filteredValue: any) => {
  console.log('values=============', filteredValue)
  console.log('params=============', formData)
  empTableRef.value.load(formData);
}

const addRow = () => {
  dialogModel.visible = true;
  dialogModel.header = "新增对话框"
  dialogModel.data = {};
}

const changeFunc = (val: any, scope: any) => {
  console.log('val', val)
  console.log('scope', scope)
}

const editFunc = (event: any, scope: any) => {
  dialogModel.visible = true;
  dialogModel.header = "编辑对话框"
  dialogModel.data = scope.row;
}

const deleFunc = (event: any, scope: any) => {
  console.log('1===', event)
  console.log('2===', scope)
}

const viewFunc = (event: any, scope: any) => {
  console.log('1===', event)
  console.log('2===', scope)
}

const editVisibleFunc = (scope: any) => {
  return true;
}

const deleteVisibleFunc = (scope: any) => {
  return true;
}

const viewVisibleFunc = (scope: any) => {
  return scope.row.gender !== 2;
}

const dropdownOptionsProvider = (scope: any) => {
  if (scope.row.gender == 0) {
    return []
  } else if (scope.row.gender == 1) {
    return [
      {
        value: 'group',
        label: '菜单组',
        icon: 'ElIconEdit'
      }
    ];
  } else {
    return [
      {
        value: 'group',
        label: '菜单组',
        icon: 'ElIconEdit'
      },
      {
        value: 'menu',
        label: '菜单项',
        icon: 'MagIconQuery'
      }, {
        value: 'outLink',
        label: '操作权限',
        icon: 'MagIconOutlink'
      }
    ];
  }
}

const onClickDropdownOption = (value: string, scope: any) => {
  console.log('value===', value)
  console.log('scope===', scope)
}

const employeeApi = {
  getPageData: (data?: object) => {
    return ApiRequest({
      url: '/api/system/employee/getPageData',
      method: 'post',
      data
    });
  }
}
onMounted(() => {
})
</script>

<style scoped lang="scss">
</style>
