<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import TreeNode, { type TreeNode as TreeNodeType } from './TreeNode.vue';

export interface TreeNode {
  id: string | number;
  label: string;
  children?: TreeNode[];
  icon?: string;
  expanded?: boolean;
  disabled?: boolean;
  data?: any;
}

interface Props {
  data: TreeNode[];
  draggable?: boolean;
  showIcons?: boolean;
  expandOnClick?: boolean;
  contextMenu?: boolean;
  defaultExpanded?: boolean;
  nodeHeight?: number;
  showCheckbox?: boolean;
  checkedKeys?: (string | number)[];
}

interface Emits {
  (e: 'node-click', node: TreeNode, event: MouseEvent): void;
  (e: 'node-dblclick', node: TreeNode, event: MouseEvent): void;
  (e: 'node-contextmenu', node: TreeNode, event: MouseEvent): void;
  (e: 'node-drop', draggedNode: TreeNode, targetNode: TreeNode, position: 'before' | 'after' | 'inside'): void;
  (e: 'node-expand', node: TreeNode): void;
  (e: 'node-collapse', node: TreeNode): void;
  (e: 'update:checkedKeys', keys: (string | number)[]): void;
  (e: 'update:data', data: TreeNode[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  draggable: true,
  showIcons: true,
  expandOnClick: false,
  contextMenu: true,
  defaultExpanded: false,
  nodeHeight: 32,
  showCheckbox: false,
  checkedKeys: () => []
});

const emit = defineEmits<Emits>();

// 响应式数据
const treeData = ref<TreeNode[]>([]);
const draggedNode = ref<TreeNode | null>(null);
const dragOverNode = ref<TreeNode | null>(null);
const dragPosition = ref<'before' | 'after' | 'inside'>('after');
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuNode = ref<TreeNode | null>(null);

// 初始化数据
watch(
  () => props.data,
  (newData) => {
    treeData.value = newData;
    if (props.defaultExpanded) {
      expandAll(treeData.value);
    }
  },
  { immediate: true, deep: true }
);

// 展开所有节点
const expandAll = (nodes: TreeNode[]) => {
  nodes.forEach(node => {
    node.expanded = true;
    if (node.children && node.children.length > 0) {
      expandAll(node.children);
    }
  });
};

// 计算节点层级
const getNodeLevel = (node: TreeNode, level = 0): number => {
  if (!node.children || node.children.length === 0) {
    return level;
  }
  return Math.max(...node.children.map(child => getNodeLevel(child, level + 1)));
};

// 获取节点路径
const getNodePath = (node: TreeNode, nodes: TreeNode[] = treeData.value, path: TreeNode[] = []): TreeNode[] | null => {
  for (let i = 0; i < nodes.length; i++) {
    const currentPath = [...path, nodes[i]];
    if (nodes[i].id === node.id) {
      return currentPath;
    }
    if (nodes[i].children) {
      const result = getNodePath(node, nodes[i].children!, currentPath);
      if (result) return result;
    }
  }
  return null;
};

// 节点勾选事件
const handleNodeCheck = (node: TreeNode, checked: boolean) => {
  const newCheckedKeys = new Set(props.checkedKeys);

  const setDescendantsCheckedState = (startNode: TreeNode, isChecked: boolean) => {
    const queue: TreeNode[] = [startNode];
    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      if (isChecked) {
        newCheckedKeys.add(currentNode.id);
      } else {
        newCheckedKeys.delete(currentNode.id);
      }
      if (currentNode.children) {
        queue.push(...currentNode.children);
      }
    }
  };

  setDescendantsCheckedState(node, checked);

  const path = getNodePath(node, treeData.value);
  if (path && path.length > 1) {
    for (let i = path.length - 2; i >= 0; i--) {
      const parent = path[i];
      if (!parent.children) continue;

      const allChildrenChecked = parent.children.every((child) => newCheckedKeys.has(child.id));

      if (allChildrenChecked) {
        newCheckedKeys.add(parent.id);
      } else {
        newCheckedKeys.delete(parent.id);
      }
    }
  }

  emit('update:checkedKeys', Array.from(newCheckedKeys));
};

// 节点点击事件
const handleNodeClick = (node: TreeNode, event: MouseEvent) => {
  if (props.expandOnClick && node.children && node.children.length > 0) {
    toggleNode(node);
  }
  emit('node-click', node, event);
};

// 节点双击事件
const handleNodeDblClick = (node: TreeNode, event: MouseEvent) => {
  if (node.children && node.children.length > 0) {
    toggleNode(node);
  }
  emit('node-dblclick', node, event);
};

// 节点右键事件
const handleNodeContextMenu = (node: TreeNode, event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  if (props.contextMenu) {
    contextMenuVisible.value = true;
    contextMenuPosition.value = { x: event.clientX, y: event.clientY };
    contextMenuNode.value = node;
  }
  emit('node-contextmenu', node, event);
  handleDragEnd();
};

// 切换节点展开/收起
const toggleNode = (node: TreeNode) => {
  if (node.children && node.children.length > 0) {
    node.expanded = !node.expanded;
    if (node.expanded) {
      emit('node-expand', node);
    } else {
      emit('node-collapse', node);
    }
  }
};

// 拖拽开始
const handleDragStart = (node: TreeNode, event: DragEvent) => {
  if (!props.draggable || node.disabled) {
    event.preventDefault();
    return;
  }
  draggedNode.value = node;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', node.id.toString());
  }
};

// 拖拽结束
const handleDragEnd = () => {
  draggedNode.value = null;
  dragOverNode.value = null;
  dragPosition.value = 'after';
};

// 拖拽悬停
const handleDragOver = (node: TreeNode, event: DragEvent) => {
  if (!props.draggable || !draggedNode.value || node.id === draggedNode.value.id) {
    return;
  }
  event.preventDefault();
  event.dataTransfer!.dropEffect = 'move';

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const y = event.clientY - rect.top;
  const height = rect.height;
  const hasChildren = node.children && node.children.length > 0;

  if (hasChildren) {
    if (y < height * 0.25) {
      dragPosition.value = 'before';
    } else if (y > height * 0.75) {
      dragPosition.value = 'after';
    } else {
      dragPosition.value = 'inside';
    }
  } else {
    if (y < height * 0.5) {
      dragPosition.value = 'before';
    } else {
      dragPosition.value = 'after';
    }
  }
  console.log("over", node.label, dragPosition.value);
  dragOverNode.value = node;
};

const findNodeAndParent = (
  nodes: TreeNode[],
  nodeId: string | number,
  parent: TreeNode | null = null
): { node: TreeNode; parent: TreeNode | null } | null => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return { node, parent };
    }
    if (node.children) {
      const result = findNodeAndParent(node.children, nodeId, node);
      if (result) return result;
    }
  }
  return null;
};

// 拖拽放置
const handleDrop = (node: TreeNode, event: DragEvent) => {
  event.preventDefault();
  if (!draggedNode.value || !dragOverNode.value) return;
  // console.log(node, event);
  console.log("move", treeData.value, draggedNode.value.id);
  const draggedInfo = findNodeAndParent(treeData.value, draggedNode.value.id);
  console.log("draggedInfo", draggedInfo);
  if (!draggedInfo) {
    handleDragEnd();
    return;
  }

  // Prevent dropping a node into its own descendants
  let p = dragOverNode.value ? findNodeAndParent(treeData.value, dragOverNode.value.id) : null;
  while (p) {
    if (p.node.id === draggedInfo.node.id) {
      handleDragEnd();
      return;
    }
    p = p.parent ? findNodeAndParent(treeData.value, p.parent.id) : null;
  }

  const sourceContainer = draggedInfo.parent ? draggedInfo.parent.children! : treeData.value;
  const draggedIndex = sourceContainer.findIndex((n) => n.id === draggedInfo.node.id);
  const [removedNode] = sourceContainer.splice(draggedIndex, 1);

  if (dragPosition.value === 'inside') {
    const targetNodeInfo = findNodeAndParent(treeData.value, dragOverNode.value.id);
    if (targetNodeInfo) {
      if (!targetNodeInfo.node.children) {
        targetNodeInfo.node.children = [];
      }
      targetNodeInfo.node.children.push(removedNode);
      targetNodeInfo.node.expanded = true;
    }
  } else {
    const targetNodeInfo = findNodeAndParent(treeData.value, dragOverNode.value.id);
    if (targetNodeInfo) {
      const targetContainer = targetNodeInfo.parent ? targetNodeInfo.parent.children! : treeData.value;
      const targetIndex = targetContainer.findIndex((n) => n.id === targetNodeInfo.node.id);
      if (dragPosition.value === 'before') {
        targetContainer.splice(targetIndex, 0, removedNode);
      } else {
        targetContainer.splice(targetIndex + 1, 0, removedNode);
      }
    }
  }

  emit('node-drop', removedNode, dragOverNode.value, dragPosition.value);
  emit('update:data', treeData.value);
  handleDragEnd();
};

// 右键菜单操作
const handleContextMenuAction = (action: string) => {
  if (!contextMenuNode.value) return;

  switch (action) {
    case 'expand':
      if (contextMenuNode.value.children && contextMenuNode.value.children.length > 0) {
        contextMenuNode.value.expanded = true;
        emit('node-expand', contextMenuNode.value);
      }
      break;
    case 'collapse':
      if (contextMenuNode.value.children && contextMenuNode.value.children.length > 0) {
        contextMenuNode.value.expanded = false;
        emit('node-collapse', contextMenuNode.value);
      }
      break;
    case 'expandAll':
      expandAll(treeData.value);
      break;
    case 'collapseAll':
      const collapseAll = (nodes: TreeNode[]) => {
        nodes.forEach(node => {
          node.expanded = false;
          if (node.children) {
            collapseAll(node.children);
          }
        });
      };
      collapseAll(treeData.value);
      break;
  }

  contextMenuVisible.value = false;
};

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenuVisible.value = false;
};

// 点击外部关闭右键菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.context-menu') && !target.closest('.tree-node')) {
    closeContextMenu();
  }
};

// 监听点击外部事件
if (props.contextMenu) {
  document.addEventListener('click', handleClickOutside);
}
</script>

<template>
  <div class="tree-container">
    <div class="tree">
      <template v-for="node in treeData" :key="node.id">
        <TreeNode
          :node="node"
          :level="0"
          :draggable="draggable"
          :show-icons="showIcons"
          :show-checkbox="showCheckbox"
          :checked-keys="checkedKeys"
          :dragged-node="draggedNode"
          :drag-over-node="dragOverNode"
          :drag-position="dragPosition"
          @node-click="handleNodeClick"
          @node-dblclick="handleNodeDblClick"
          @node-contextmenu="handleNodeContextMenu"
          @node-drop="handleDrop"
          @toggle-node="toggleNode"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drag-over="handleDragOver"
          @node-check="handleNodeCheck"
        />
      </template>
    </div>

    <!-- 右键菜单 -->
    <div v-if="contextMenuVisible" class="context-menu dropdown-menu show" :style="{
      position: 'fixed',
      left: contextMenuPosition.x + 'px',
      top: contextMenuPosition.y + 'px',
      zIndex: 1060
    }">
      <button v-if="contextMenuNode?.children && contextMenuNode.children.length > 0" class="dropdown-item"
        @click="handleContextMenuAction('expand')">
        <i class="bi bi-chevron-down me-2"></i>展开
      </button>
      <button v-if="contextMenuNode?.children && contextMenuNode.children.length > 0" class="dropdown-item"
        @click="handleContextMenuAction('collapse')">
        <i class="bi bi-chevron-up me-2"></i>收起
      </button>
      <div class="dropdown-divider"></div>
      <button class="dropdown-item" @click="handleContextMenuAction('expandAll')">
        <i class="bi bi-chevron-down me-2"></i>全部展开
      </button>
      <button class="dropdown-item" @click="handleContextMenuAction('collapseAll')">
        <i class="bi bi-chevron-up me-2"></i>全部收起
      </button>
    </div>
  </div>
</template>

<style scoped>
.tree-container {
  position: relative;
  user-select: none;
}

.tree {
  font-size: 14px;
}

.tree-node {
  position: relative;
  min-height: v-bind(nodeHeight + 'px');
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tree-node:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.tree-node-content {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  min-height: v-bind(nodeHeight + 'px');
  border-radius: 4px;
  margin: 1px 0;
}

.tree-toggle-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tree-toggle-icon:hover {
  color: #007bff;
}

.tree-node-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tree-node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-children {
  margin-left: 16px;
}

.tree-node-expanded>.tree-children {
  display: block;
}

.tree-node-dragging {
  opacity: 0.5;
}

.tree-node-drag-over {
  background-color: rgba(0, 123, 255, 0.2);
}

.tree-node-drag-before {
  border-top: 2px solid #007bff;
}

.tree-node-drag-after {
  border-bottom: 2px solid #007bff;
}

.tree-node-drag-inside {
  background-color: rgba(0, 123, 255, 0.3);
  border: 2px dashed #007bff;
}

.tree-node-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.context-menu {
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dropdown-item {
  padding: 8px 16px;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-divider {
  height: 1px;
  background-color: #dee2e6;
  margin: 4px 0;
}
</style>