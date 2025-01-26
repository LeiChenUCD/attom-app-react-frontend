import { object } from "vue-types";

/**
 * 生成uuid
 * **/
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 遍历tree，重置value，label属性
 * */
export function traverseTreeData(tree: any[], value?:any, label?:any, callback?: (node: any) => void) {
  tree?.forEach((node) => {
    // 处理当前节点
    if (value) {
      node.value = node[value];
    }
    if (label) {
      node.label = node[label];
    }
    callback(node);

    // 如果节点有子节点，则递归遍历子节点
    if (node?.children) {
      traverseTreeData(node.children, value, label, callback);
    }
  });
}

/**
 * 遍历tree，重置value，label属性
 * */
export function traverseTreeDataUpdateRules(tree: any[], dataObj: any, callback?: (node: any) => void) {
  tree?.forEach((node) => {
    // 处理当前节点
    if (typeof node === 'object') {
      if (node?.field) {
        if (dataObj?.hasOwnProperty(node.field)) {
          node.value = dataObj[node.field];
        } else {
          node.value = null;
        }
      } else {
       
      }
    }
    
    callback(node);

    // 如果节点有子节点，则递归遍历子节点
    if (node?.children) {
      traverseTreeDataUpdateRules(node.children,dataObj, callback);
    }
  });
}

/**
 * 过滤treedata
 * */
export function filterTreeData(nodes) {
  return nodes.reduce((filteredNodes, node) => {
    if (!node.isDisable) {
      // 如果当前节点不是禁用的，则将其添加到结果中，并递归处理其子节点
      const filteredChildren = filterTreeData(node.children || []);
      if (filteredChildren.length > 0) {
        node.children = filteredChildren;
      } else {
        delete node.children; // 如果没有子节点，则删除 children 属性
      }
      filteredNodes.push(node);
    }
    return filteredNodes;
  }, []);
}

/**
 * 验证字符串是否JSON格式
 * */
export function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 页码
 * */
export function getTablePageSizes() {
  return [10, 20, 50, 100]
}
