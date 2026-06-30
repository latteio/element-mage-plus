<template>
  <mag-border-layout>
    <!-- 按钮和按钮组 -->
    <mag-form region="center" :columns="1" ref="formRef">
      <mag-flex-component>
        <mag-button type="primary" @click="resetForm">保存
        </mag-button>
        <mag-button type="primary" @click="submitForm" :icon="Refresh">提交</mag-button>
      </mag-flex-component>
      <mag-button-group position="right">
        <mag-button type="primary" as-type="link" @click="() => alert('首页')">首页</mag-button>
        <mag-button type="primary" as-type="link">前页</mag-button>
        <mag-button type="primary" as-type="link">后页</mag-button>
        <mag-button type="primary" as-type="link">尾页</mag-button>
      </mag-button-group>
      <mag-button-group :buttons="btnGroup1">
      </mag-button-group>
      <mag-button-group :buttons="btnGroup2">
      </mag-button-group>
    </mag-form>
  </mag-border-layout>

</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {Refresh} from "@element-plus/icons-vue";

const formRef = ref();
const btnGroup1 = [{
  type: '',
  label: '按鈕1',
  onClick: function () {
    console.log(1)
  }
}, {
  type: 'primary',
  label: '按鈕2',
  onClick: function () {
    console.log(2)
  }
}, {
  type: 'warning',
  label: '按鈕3',
  onClick: function () {
    console.log(3)
  }
}, {
  type: 'danger',
  label: '按鈕4',
  onClick: function () {
    console.log(4)
  }
}];

const btnGroup2 = [{
  type: '',
  label: '文字按鈕1',
  text: true,
  onClick: function () {
    console.log(1)
  }
}, {
  type: 'primary',
  label: '文字按鈕2',
  text: true,
  onClick: function () {
    console.log(2)
  }
}, {
  type: 'warning',
  label: '文字按鈕3',
  text: true,
  onClick: function () {
    console.log(3)
  }
}, {
  type: 'danger',
  label: '文字按鈕4',
  text: true,
  onClick: function () {
    console.log(4)
  }
}];

const alert = (text: string) => {
  console.log('button text = ', text)
}

const submitForm = () => {
}

const resetForm = () => {
  formRef.value.resetForm();
}

onMounted(() => {
});
</script>

<style scoped lang="scss">
</style>