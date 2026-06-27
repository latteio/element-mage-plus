import {defineComponent, h, inject, PropType} from "vue";
import {ElTableColumn} from "element-plus";
import {MagTableColumnSortType} from "@/types/element-mage-plus-types.ts";
import MagButton from "@/components/basic/MagButton.vue";
import MagDropdown from "@/components/basic/MagDropdown.vue";
import MagConfirmButton from "@/components/basic/MagConfirmButton.vue";
import MagLink from "@/components/basic/MagLink.vue";
import MagEditButton from "@/components/table/MagEditButton";
import MagDeleteButton from "@/components/table/MagDeleteButton";
import {useSlots} from "@/composables/ComposableUseProvider.ts";

const MagTableColumnButtons = defineComponent({
  name: "MagTableColumnButtons",
  props: {
    prop: {type: String, required: true, default: () => ""},
    label: {type: String, required: true, default: () => ""},
    sortProps: {type: Object as PropType<MagTableColumnSortType>, required: false, default: () => null},
    buttonSpace: {type: Number, required: false, default: () => 8}
  },
  setup(props, {attrs, slots}) {
    const editableTableProperties: any = inject("mag_table__editable_properties");

    const btnTypes: any = {
      "MagButton": MagButton,
      "MagConfirmButton": MagConfirmButton,
      "MagLink": MagLink,
      "MagEditButton": MagEditButton,
      "MagDeleteButton": MagDeleteButton,
      "MagDropdown": MagDropdown
    };

    const bindButtonRefFunc = (scope: any, btnType: string, el: any) => {
      if (el) {
        const row = scope.row;
        const key = row[editableTableProperties.editableTableRowKey];
        if (key && !editableTableProperties.editableTableRowBtnRefs[key]) {
          editableTableProperties.editableTableRowBtnRefs[key] = {};
          editableTableProperties.editableTableRowBtnRefs[key][btnType] = el;
        }
      }
    }

    /**
     * 定义返回模板
     */
    return () => {
      const createDefaultNode = (scope: any) => {
        let childNodes: any = useSlots(slots);
        return <div class="mag-button-group">
          {childNodes.map((node: any) => {
                let vNode;
                if (node.type?.name === MagButton.name || node.type?.name === MagConfirmButton.name || node.type?.name === MagLink.name) {
                  let events: any = {};
                  if (node.props?.["onClick"]) {
                    events.onClick = (event: any) => node.props?.["onClick"](event, scope);
                  } else if (node.attrs?.["onClick"]) {
                    events.onClick = (event: any) => node.attrs?.["onClick"](event, scope);
                  }

                  vNode = h(btnTypes[node.type?.name], {
                    ...node.props,
                    ...node.attrs,
                    formType: false,
                    buttonType: true,
                    dataScope: scope,
                    ...events
                  }, {
                    default: () => node?.children?.default?.()
                  });

                } else if (node.type?.name === MagEditButton.name || node.type?.name === MagDeleteButton.name) {
                  vNode = h(btnTypes[node.type?.name], {
                    ...node.props,
                    ...node.attrs,
                    ref: (el) => {
                      bindButtonRefFunc(scope, node.type?.name, el)
                    },
                    buttonStatus: editableTableProperties.editableTableRowBtnStatus[node.type?.name],
                    dataScope: scope
                  }, {
                    default: () => node?.children?.default?.()
                  });
                } else if (node.type?.name === MagDropdown.name) {
                  let events: any = {
                    ["click-option"]: (val: any) => {
                      return node.props?.["click-option"] && node.props?.["click-option"](val, scope);
                    }
                  };

                  vNode = h(btnTypes[node.type?.name], {
                    ...node.props,
                    ...node.attrs,
                    formType: false,
                    buttonType: true,
                    dataScope: scope,
                    ...events
                  }, {
                    default: () => node?.children?.default?.()
                  });
                } else {
                  vNode = node;
                }

                if (!node?.props?.["visible-handler"]) {
                  return vNode;
                } else if (node?.props?.["visible-handler"]
                    && node?.props?.["visible-handler"](scope)) {
                  return vNode;
                } else {
                  return <></>
                }
              }
          )}
        </div>
      }

      return <ElTableColumn {...props} {...attrs} v-slots={{default: createDefaultNode}}>
      </ElTableColumn>
    }
  }
});

export default MagTableColumnButtons;
