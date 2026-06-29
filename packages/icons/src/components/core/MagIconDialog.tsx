import {defineComponent, h, nextTick, PropType, reactive, ref, watch} from "vue";
import {ElButton, ElDialog, ElFormItem, ElIcon, ElInput, ElScrollbar, ElTabPane, ElTabs, ElTag} from "element-plus";
import * as elIcons from "@element-plus/icons-vue";
import * as magIcons from "@/components/components";

interface MagIconDialogModel {
  visible: boolean;
  appendToBody?: boolean;
  fullscreen?: boolean;
  header?: string;
  headerAlign?: string;
  width?: string;
  height?: string;
  url?: string;
  footerAlign?: string;
  showConfirmBtn?: boolean;
  showCancelBtn?: boolean;
  mode?: string;
  data?: any;
  onClose?: (val: any) => void;
}

const MagIconDialog = defineComponent({
  name: "MagIconDialog",
  props: {
    model: {
      type: Object as PropType<MagIconDialogModel>,
      required: true,
      default: {
        visible: false,
        appendToBody: false,
        fullscreen: false,
        header: '',
        headerAlign: 'left',
        width: '60vw',
        height: '50vh',
        url: '',
        footerAlign: 'right',
        showConfirmBtn: true,
        showCancelBtn: true,
        mode: '',
        data: {},
        onClose: () => {
        }
      }
    }
  },
  emits: ["update:visible", "dialogReady", "dialogConfirm", "dialogCancel"],
  setup(props, {attrs, emit, expose}) {
    const dialogVisible = ref(props.model.visible);

    const dialogFormModel = reactive({
      selectedText: ''
    });

    /**
     *  监听 props.model.visible 变化
     */
    watch(() => props.model.visible, (val) => {
      dialogVisible.value = val;
    });

    /**
     * 监听本地visible变化
     */
    watch(dialogVisible, (val) => {
      if (!val) {
        emit("update:visible", false);
      } else {
        nextTick(() => {
          emit("dialogReady", props.model.mode, props.model.data);
        }).then(() => {
        })
      }
    });

    const camelToMinusFunc = (str: string) => {
      return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    /**
     * 定义对话框初始化方法
     */
    const onInitDialogFunc = () => {
      props.model.visible = props.model.visible || false;
      props.model.appendToBody = props.model.appendToBody || false;
      props.model.fullscreen = props.model.fullscreen || false;
      props.model.header = props.model.header || "";
      props.model.headerAlign = props.model.headerAlign || "left";
      props.model.width = props.model.fullscreen ? "100vw" : (props.model.width || "60vw");
      props.model.height = props.model.fullscreen ? "calc(100vh - 235px)" : (props.model.height || "40vh");
      props.model.url = props.model.url || ""
      props.model.footerAlign = props.model.footerAlign || "right";
      props.model.showConfirmBtn = (props.model.showConfirmBtn !== false);
      props.model.showCancelBtn = (props.model.showCancelBtn !== false);
      dialogFormModel.selectedText = '';
    }

    /**
     * 定义点击对话框确定按钮事件
     */
    const onDialogConfirmFunc = (event: any) => {
      event && event.stopPropagation();
      emit("dialogConfirm", {icon: dialogFormModel.selectedText});
    };

    /**
     * 定义点击对话框取消按钮事件
     */
    const onDialogCancelFunc = (event: any) => {
      event && event.stopPropagation();
      emit("dialogCancel", {icon: ''});
    };

    /**
     * 定义关闭事件
     * @param retValues
     */
    const onCloseDialogFunc = (retValues: any) => {
      props.model.visible = false;
      props.model.header = "";
      props.model.data = {};
      props.model.onClose && props.model.onClose(retValues);
    };

    expose({
      closeDialog: onCloseDialogFunc
    });

    /**
     * 图标收集
     */
    const defaultIcons = Object.entries(elIcons);
    const extendsIcons = Object.entries(magIcons);

    /**
     * 选择图标
     */
    const onSelectIconFunc = (prefix: string, icon: any) => {
      let iconName: string = camelToMinusFunc(icon.name);
      dialogFormModel.selectedText = prefix + iconName;
    }

    /**
     * 定义返回模板
     */
    return () => {
      onInitDialogFunc();
      return <ElDialog
          {...props}
          {...attrs}
          modelValue={dialogVisible.value}
          onUpdate:modelValue={(val: boolean) => dialogVisible.value = val}
          header-class={`is-${props.model.headerAlign}-alignment`}
          title="选择图标"
          width={props.model.width}
          fullscreen={props.model.fullscreen}
          appendToBody={props.model.appendToBody}
          closeOnClickModal={false}
          closeOnPressEscape={false}
          alignCenter
          draggable
          show-close={false}
          v-slots={{
            default: () => {
              return <div class="mag-icon-flex__vertical mag-icon-flex__contentful">
                <ElFormItem prop="selectedText" label="当前选择图标: ">
                  <ElInput prefix-icon={dialogFormModel.selectedText}
                           v-model={dialogFormModel.selectedText}
                           size="default"
                           clearable/>
                </ElFormItem>

                <ElTabs>
                  <ElTabPane layzy v-slots={{
                    label: () => {
                      return <>
                        <span>默认</span>
                        <ElTag size="small" type="info">{defaultIcons.length}</ElTag>
                      </>
                    }
                  }}>
                    <ElScrollbar max-height="100vh" style={`height: ${props.model.height};`}>
                      <div class="mag-select-icon__list">
                        <ul>
                          {
                            defaultIcons.map(([iconName, iconComponent]) => {
                              return <li onClick={() => onSelectIconFunc('el-icon-', iconComponent)}>
                                <span data-icon={iconName}></span>
                                <ElIcon>
                                  {h(iconComponent)}
                                </ElIcon>
                              </li>
                            })
                          }
                        </ul>
                      </div>
                    </ElScrollbar>
                  </ElTabPane>
                  <ElTabPane layzy v-slots={{
                    label: () => {
                      return <>
                        <span>扩展</span>
                        <ElTag size="small" type="info">{extendsIcons.length}</ElTag>
                      </>
                    }
                  }}>
                    <ElScrollbar max-height="100vh" style={`height: ${props.model.height};`}>
                      <div class="mag-select-icon__list">
                        <ul>
                          {
                            extendsIcons.map(([iconName, iconComponent]) => {
                              return <li onClick={() => onSelectIconFunc('', iconComponent)}>
                                <span data-icon={iconName}></span>
                                <ElIcon>
                                  {h(iconComponent)}
                                </ElIcon>
                              </li>
                            })
                          }
                        </ul>
                      </div>
                    </ElScrollbar>
                  </ElTabPane>
                </ElTabs>
              </div>
            },

            footer: () => {
              return (props.model.showConfirmBtn || props.model.showCancelBtn)
                  ? (<div class={{
                        "mag-icon-dialog__footer": true,
                        "is-left-alignment": props.model.footerAlign === "left",
                        "is-right-alignment": props.model.footerAlign === "right",
                        "is-center-alignment": props.model.footerAlign === "center"
                      }}>
                        {props.model.showCancelBtn && (<ElButton onClick={onDialogCancelFunc}>取消</ElButton>)}
                        {props.model.showConfirmBtn && (<ElButton onClick={onDialogConfirmFunc} type="primary">确定</ElButton>)}
                      </div>
                  ) : null
            }
          }}>
      </ElDialog>
    }
  }
});

export default MagIconDialog;
