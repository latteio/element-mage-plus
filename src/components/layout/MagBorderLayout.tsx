import {defineComponent, h, ref} from "vue";
import {ElAside, ElContainer, ElFooter, ElHeader, ElMain} from "element-plus";
import BasicViewComponent from "@/components/core/BasicViewComponent.ts";
import {useSlots} from "@/composables/ComposableUseProvider.ts";
import Objects from "@/utils/Objects.ts";

const MagBorderLayout = defineComponent({
  extends: BasicViewComponent,
  name: "MagBorderLayout",
  props: {},
  setup(props, {slots, expose}) {
    const componentVisible = ref(props?.visible);

    /* 获取子级视图的 ViewMap */
    const childViewMap: any = {
      north: null,
      south: null,
      west: null,
      east: null,
      center: null
    };

    const childNodes: any = useSlots(slots);
    for (let childNode of childNodes) {
      if (!childNode?.props || !childNode?.props?.region) continue;
      childViewMap[childNode?.props?.region] = {
        props: {...childNode.props},
        vNode: () => h(childNode)
      };
    }

    /**
     * 定义容器内各个方向布局的代码模板
     */
    const northTemplate = () => {
      const regionNode: any = childViewMap["north"];
      if (!regionNode) {
        return null;
      }

      let componentHeight = regionNode.props?.height || '100%';
      componentHeight = typeof (componentHeight) === 'string' ? (componentHeight === '100%' ? 'auto' : componentHeight) : (componentHeight + "px");
      let styles = `height: ${componentHeight};`;
      return <ElHeader class="mag-view-border-layout__north" style={styles}>{regionNode["vNode"]()}</ElHeader>
    }

    const southTemplate = () => {
      const regionNode: any = childViewMap["south"];
      if (!regionNode) {
        return null;
      }

      let componentHeight = regionNode.props?.height || '100%';
      componentHeight = typeof (componentHeight) === 'string' ? (componentHeight === '100%' ? 'auto' : componentHeight) : (componentHeight + "px");
      let styles = `height: ${componentHeight};`;
      return <ElFooter class="mag-view-border-layout__south" style={styles}>{regionNode["vNode"]()}</ElFooter>
    }

    const westTemplate = () => {
      const regionNode: any = childViewMap["west"];
      if (!regionNode) {
        return null;
      }

      let componentWidth = regionNode.props?.width || '100%';
      componentWidth = typeof (componentWidth) === 'string' ? (componentWidth === '100%' ? 'auto' : componentWidth) : (componentWidth + "px");
      let styles = `width: ${componentWidth};`;
      return <ElAside class="mag-view-border-layout__west" style={styles}>{regionNode["vNode"]()}</ElAside>
    }

    const eastTemplate = () => {
      const regionNode: any = childViewMap["east"];
      if (!regionNode) {
        return null
      }

      let componentWidth = regionNode.props?.width || '100%';
      componentWidth = typeof (componentWidth) === 'string' ? (componentWidth === '100%' ? 'auto' : componentWidth) : (componentWidth + "px");
      let styles = `width: ${componentWidth};`;
      return <ElAside class="mag-view-border-layout__east" style={styles}>{regionNode["vNode"]()}</ElAside>
    }

    const centerTemplate = () => {
      const regionNode: any = childViewMap["center"];
      if (!regionNode) {
        return null
      }

      let marginLeft = "";
      let marginRight = "";
      const regionWestNode: any = childViewMap["west"];
      const regionEastNode: any = childViewMap["east"];
      if (regionWestNode) {
        marginLeft = `${props.space}px`;
      }
      if (regionEastNode) {
        marginRight = `${props.space}px`;
      }

      return <ElMain class="mag-view-border-layout__center"
                     style={{
                       "margin-left": marginLeft ? marginLeft : undefined,
                       "margin-right": marginRight ? marginRight : undefined,
                     }}
      >
        {childViewMap["center"]["vNode"]()}
      </ElMain>
    }

    const middleTemplate = () => {
      let middleHeight: string = "100%";
      let marginTop = "";
      let marginBottom = "";
      const regionNorthNode: any = childViewMap["north"];
      const regionSouthNode: any = childViewMap["south"];
      let propValue;

      if (regionNorthNode) {
        propValue = Objects.parsePropertyValue(regionNorthNode.props?.height);
        if (!propValue.isPercentage && !propValue.isPixel) {
          throw new Error(`north::height属性值无效: ${regionNorthNode.props?.height}`);
        }
        middleHeight = middleHeight + " - " + propValue.value + propValue.unit;
        middleHeight = middleHeight + " - " + props.space + "px";
        marginTop = `${props.space}px`;
      }

      if (regionSouthNode) {
        propValue = Objects.parsePropertyValue(regionSouthNode.props?.height);
        if (!propValue.isPercentage && !propValue.isPixel) {
          throw new Error(`south::height属性值无效: ${regionSouthNode.props?.height}`);
        }
        middleHeight = middleHeight + " - " + propValue.value + propValue.unit;
        middleHeight = middleHeight + " - " + props.space + "px";
        marginBottom = `${props.space}px`;
      }

      return <ElContainer class="mag-view-border-layout__middle"
                          style={{
                            height: `calc(${middleHeight})`,
                            "margin-top": marginTop ? marginTop : undefined,
                            "margin-bottom": marginBottom ? marginBottom : undefined
                          }}>
        {westTemplate()}
        {centerTemplate()}
        {eastTemplate()}
      </ElContainer>
    }

    /**
     * 定义组件外部方法
     */
    expose({
      /**
       * 设置组件可见性
       * @param visible
       */
      setVisible: (visible: boolean) => {
        componentVisible.value = visible;
      }
    });

    /**
     * 定义返回模板
     * 布局时(包括嵌套布局), 统一在 middleTemplate 和 centerTemplate 中定义布局间的间隔.
     */
    return () => {
      return <ElContainer v-show={componentVisible.value}
                          class="mag-view-border-layout"
      >
        {northTemplate()}
        {middleTemplate()}
        {southTemplate()}
      </ElContainer>
    }
  }
});

export default MagBorderLayout;
