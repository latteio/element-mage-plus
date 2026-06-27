<template>
  <ElDialog
      :model-value="componentVisible"
      @update:model-value="handleUpdateVisible"
      :header-class="`is-${dialogConfig.headerAlign}-alignment`"
      :title="dialogConfig.header"
      :width="dialogConfig.width"
      :fullscreen="dialogConfig.fullscreen"
      :append-to-body="dialogConfig.appendToBody"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      align-center
      draggable
      :show-close="false"
  >
    <!-- default 插槽 -->
    <template #default>
      <div v-if="dialogConfig.url" class="mag-dialog__iframe-wrapper">
        <iframe
            :src="dialogConfig.url"
            :style="{ width: '100%', height: dialogBodyHeight, border: 0 }"
        />
      </div>
      <div v-else class="mag-dialog__body" :style="{ height: dialogBodyHeight }">
        <slot/>
      </div>
    </template>

    <!-- footer 插槽 -->
    <template #footer>
      <div v-if="dialogConfig.showConfirmBtn || dialogConfig.showCancelBtn"
           class="mag-dialog__footer"
           :class="{
          'is-left-alignment': dialogConfig.footerAlign === 'left',
          'is-right-alignment': dialogConfig.footerAlign === 'right',
          'is-center-alignment': dialogConfig.footerAlign === 'center'
        }"
      >
        <MagButton v-if="dialogConfig.showCancelBtn" @click="onDialogCancelFunc">取消</MagButton>
        <MagButton v-if="dialogConfig.showConfirmBtn" type="primary" @click="onDialogConfirmFunc">确定</MagButton>
      </div>
    </template>
  </ElDialog>
</template>

<script lang="ts">
import {computed, defineComponent, nextTick, PropType, ref, watch} from 'vue';
import {ElDialog} from 'element-plus';
import {MagDialogModel} from '@/types/element-mage-plus-types.ts';
import MagButton from '@/components/basic/MagButton.vue';
import BasicComponent from '@/components/core/BasicComponent.ts';

export default defineComponent({
  name: 'MagDialog',
  extends: BasicComponent,
  components: {
    ElDialog,
    MagButton,
  },
  props: {
    model: {
      type: Object as PropType<MagDialogModel>,
      required: true,
      default: () => ({
        visible: false,
        appendToBody: false,
        fullscreen: false,
        header: '',
        headerAlign: 'left',
        width: '60vw',
        height: '40vh',
        url: '',
        footerAlign: 'right',
        showConfirmBtn: true,
        showCancelBtn: true,
        mode: '',
        data: {},
        onClose: () => {
        },
      }),
    },
    description: {
      type: String,
      required: false,
      default: () => '对话框描述',
    },
  },
  emits: ['update:visible', 'dialogReady', 'dialogConfirm', 'dialogCancel'],
  setup(props, {emit, expose}) {
    const componentVisible = ref(props.model.visible);

    // 同步外部 visible 变化
    watch(
        () => props.model.visible,
        (val) => {
          componentVisible.value = val;
        }
    );

    // 监听本地 visible 变化, 触发事件
    watch(componentVisible, (val) => {
      if (!val) {
        emit('update:visible', false);
      } else {
        nextTick(() => {
          emit('dialogReady', props.model.mode, props.model.data);
        });
      }
    });

    // 计算对话框配置
    const dialogConfig = computed(() => {
      const model = props.model;
      return {
        header: model.header || '',
        headerAlign: model.headerAlign || 'left',
        width: model.fullscreen ? '100vw' : (model.width || '60vw'),
        fullscreen: model.fullscreen || false,
        appendToBody: model.appendToBody || false,
        showConfirmBtn: model.showConfirmBtn !== false,
        showCancelBtn: model.showCancelBtn !== false,
        footerAlign: model.footerAlign || 'right',
        url: model.url || '',
      };
    });

    // 计算对话框主体高度
    const dialogBodyHeight = computed(() => {
      if (dialogConfig.value.fullscreen) {
        if (props.model.showConfirmBtn || props.model.showCancelBtn) {
          return 'calc(100vh - 105px)';
        }
        return 'calc(100vh - 60px)';
      }
      return props.model.height || '40vh';
    });

    // 更新 visible 事件
    const handleUpdateVisible = (val: boolean) => {
      componentVisible.value = val;
    };

    // 定义点击对话框确定按钮事件
    const onDialogConfirmFunc = (event: any) => {
      event?.stopPropagation();
      emit('dialogConfirm', {});
    };

    // 定义点击对话框取消按钮事件
    const onDialogCancelFunc = (event: any) => {
      event?.stopPropagation();
      emit('dialogCancel', {});
    };

    // 定义关闭事件
    const closeDialog = (retValues?: any) => {
      props.model.visible = false;
      props.model.header = '';
      props.model.data = {};
      props.model.onClose?.(retValues);
    };

    // 暴露外部方法
    expose({
      closeDialog,
    });

    return {
      componentVisible,
      dialogConfig,
      dialogBodyHeight,
      handleUpdateVisible,
      onDialogConfirmFunc,
      onDialogCancelFunc,
    };
  },
});
</script>

<style scoped>
</style>