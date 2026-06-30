import {defineComponent, h} from "vue";
import MagButton from "@/components/basic/MagButton.vue";
import {useSlots} from "@/composables/ComposableUseProvider.ts";

const MagTreeBar = defineComponent({
  name: "MagTreeBar",
  props: {
    treeProps: {type: Object, required: false, default: () => new Object()},
    dataScope: {type: Object, required: false, default: () => new Object()}
  },
  setup(props, {slots}) {
    /**
     * 定义返回模板
     */
    return () => {
      let childBars: any = useSlots(slots);
      let treeProps = props.treeProps as any;
      let nodeDatas = props.dataScope?.data as any;
      return <span class="mag-tree__node" {...props}>
              <span>{nodeDatas[treeProps["label"] || "label"]}</span>
              <span>{childBars.map((node: any) => {
                let vNode;

                if (node.type?.name === MagButton.name) {
                  let events: any = {};
                  if (node.props?.["onClick"]) {
                    events.onClick = (event: any) => {
                      event && event.stopPropagation();
                      node.props?.["onClick"](event, nodeDatas);
                    }
                  } else if (node.attrs?.["onClick"]) {
                    events.onClick = (event: any) => {
                      event && event.stopPropagation();
                      node.attrs?.["onClick"](event, nodeDatas);
                    }
                  }

                  vNode = h(MagButton, {
                    style: 'margin-right: 5px',
                    ...node.props,
                    ...node.attrs,
                    formType: false,
                    asType: 'link',
                    size: "small",
                    dataScope: nodeDatas,
                    ...events
                  }, {
                    default: () => node?.children?.default?.()
                  });
                }

                if (!node.props["visible-handler"]) {
                  return vNode;
                } else if (node.props["visible-handler"]
                    && node.props["visible-handler"](nodeDatas)) {
                  return vNode;
                } else {
                  return <></>
                }
              })}
              </span>
            </span>
    }
  }
});

export default MagTreeBar;
