<template>
  <mag-border-layout>
    <!-- 按钮和按钮组 -->
    <mag-form region="center" :columns="1" ref="formRef">
      <mag-flex-component>
        <mag-confirm-button type="primary" @click="submitForm" :icon="Refresh">提交</mag-confirm-button>
        <mag-button type="primary" @click="resetForm">重置</mag-button>
      </mag-flex-component>
      <mag-button-group position="right">
        <mag-button type="primary">首页</mag-button>
        <mag-button type="primary">前页</mag-button>
        <mag-button type="primary">后页</mag-button>
        <mag-button type="primary">尾页</mag-button>
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

const submitForm = async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log('提交成功！');
      resolve('提交成功的数据');
    }, 5000);
  });
}

const resetForm = () => {
  setTimeout(() => {
  }, 3000);
  console.log('2')
  formRef.value.resetForm();
}

onMounted(() => {
});
</script>

<style scoped lang="scss">
</style>