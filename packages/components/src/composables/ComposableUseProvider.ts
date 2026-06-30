import {Comment, Fragment, Ref, Slots, VNode} from 'vue';

export function useMergedAttrs(props: any, attrs: any, excludeKeys?: string | string[]) {
  const excludeList = Array.isArray(excludeKeys) ? excludeKeys : excludeKeys ? [excludeKeys] : [];
  const excludeSet = new Set(excludeList);

  // 过滤 props：排除指定属性
  const filteredProps = Object.keys(props)
      .filter(key => !excludeSet.has(key))
      .reduce((obj, key) => {
        obj[key] = props[key];
        return obj;
      }, {} as any);

  // 过滤 attrs：排除指定属性
  const filteredAttrs = Object.keys(attrs)
      .filter(key => !excludeSet.has(key))
      .reduce((obj, key) => {
        obj[key] = attrs[key];
        return obj;
      }, {} as any);

  // 合并过滤后的 props 和 attrs
  return {
    ...filteredProps,
    ...filteredAttrs,
  };
}

export function useSlots(slots: Slots) {
  const nodes = slots.default?.() || [];
  return nodes.filter(node => {
    if (node.type === Comment) return false;
    if (node.type === Fragment && node.children) {
      const validChildren = (node.children as VNode[]).filter(
          child => child.type !== Comment
      );
      return validChildren.length > 0;
    }
    return true;
  });
}

export function useInvoke(componentRef: Ref, methodName: string, ...args: any[]) {
  if (componentRef.value && typeof componentRef.value[methodName] === 'function') {
    return componentRef.value[methodName](...args)
  }
  console.warn(`方法 ${methodName} 不存在`)
  return undefined
}
