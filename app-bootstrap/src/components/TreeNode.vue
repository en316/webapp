<script setup lang="ts">
import { computed } from 'vue';

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
  node: TreeNode;
  level: number;
  draggable: boolean;
  showIcons: boolean;
  checkedKeys: (string | number)[];
  showCheckbox: boolean;
  draggedNode?: TreeNode | null;
  dragOverNode?: TreeNode | null;
  dragPosition?: 'before' | 'after' | 'inside';
}

interface Emits {
  (e: 'node-check', node: TreeNode, checked: boolean): void;
  (e: 'node-click', node: TreeNode, event: MouseEvent): void;
  (e: 'node-dblclick', node: TreeNode, event: MouseEvent): void;
  (e: 'node-contextmenu', node: TreeNode, event: MouseEvent): void;
  (e: 'node-drop', node: TreeNode, event: DragEvent): void;
  (e: 'toggle-node', node: TreeNode): void;
  (e: 'drag-start', node: TreeNode, event: DragEvent): void;
  (e: 'drag-end'): void;
  (e: 'drag-over', node: TreeNode, event: DragEvent): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const hasChildren = computed(() => props.node.children && props.node.children.length > 0);
const isExpanded = computed(() => props.node.expanded);
const isChecked = computed(() => props.checkedKeys.includes(props.node.id));

const isIndeterminate = computed(() => {
  if (isChecked.value || !hasChildren.value) {
    return false;
  }

  const checkDescendants = (node: TreeNode): boolean => {
    if (!node.children) return false;
    return node.children.some(
      (child) => props.checkedKeys.includes(child.id) || checkDescendants(child)
    );
  };

  return checkDescendants(props.node);
});

const handleCheckboxChange = (event: Event) => {
  emit('node-check', props.node, (event.target as HTMLInputElement).checked);
};

const handleToggleClick = (event: MouseEvent) => {
  event.stopPropagation();
  emit('toggle-node', props.node);
};
</script>

<template>
  <div
    :class="[
      'tree-node',
      {
        'tree-node-expanded': isExpanded,
        'tree-node-dragging': draggedNode?.id === node.id,
        'tree-node-drag-over': dragOverNode?.id === node.id,
        'tree-node-drag-before': dragOverNode?.id === node.id && dragPosition === 'before',
        'tree-node-drag-after': dragOverNode?.id === node.id && dragPosition === 'after',
        'tree-node-drag-inside': dragOverNode?.id === node.id && dragPosition === 'inside',
        'tree-node-disabled': node.disabled
      }
    ]"
    
  >
    <div
      :draggable="draggable && !node.disabled"
      @dragstart="(e) => emit('drag-start', node, e)"
      @dragend="emit('drag-end')"
      @dragover="(e) => emit('drag-over', node, e)"
      @drop.stop="(e) => emit('node-drop', node, e)"
      @click="(e) => emit('node-click', node, e)"
      @dblclick="(e) => emit('node-dblclick', node, e)"
      @contextmenu="(e) => emit('node-contextmenu', node, e)"
      class="tree-node-content" :style="{ paddingLeft: '20px' }">
      <!-- class="tree-node-content" :style="{ paddingLeft: `${level * 16}px` }"> -->

      
      <!-- 展开/收起图标 -->
      <i
        v-if="hasChildren"
        :class="[
          'tree-toggle-icon',
          isExpanded ? 'bi bi-chevron-down' : 'bi bi-chevron-right'
        ]"
        @click="handleToggleClick"
      />

      <!-- 复选框 -->
      <input
        v-if="showCheckbox"
        type="checkbox"
        class="form-check-input me-2"
        :checked="isChecked"
        :indeterminate="isIndeterminate"
        @change="handleCheckboxChange"
        @click.stop
      />
      
      <!-- 节点图标 -->
      <i v-if="showIcons && node.icon" :class="['tree-node-icon', node.icon]" />
      
      <!-- 节点标签 -->
      <span class="tree-node-label">{{ node.label }}</span>
    </div>
    
    <!-- 子节点 -->
    <div v-if="hasChildren && isExpanded" class="tree-children">
      <TreeNode
        :class="{
          'tree-children-expanded': isExpanded
        }"
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        :draggable="draggable"
        :show-icons="showIcons"
        :show-checkbox="showCheckbox"
        :checked-keys="checkedKeys"
        :dragged-node="draggedNode"
        :drag-over-node="dragOverNode"
        :drag-position="dragPosition"
        @node-check="(node, checked) => emit('node-check', node, checked)"
        @node-click="(node, event) => emit('node-click', node, event)"
        @node-dblclick="(node, event) => emit('node-dblclick', node, event)"
        @node-contextmenu="(node, event) => emit('node-contextmenu', node, event)"
        @node-drop="(node, event) => emit('node-drop', node, event)"
        @toggle-node="(node) => emit('toggle-node', node)"
        @drag-start="(node, event) => emit('drag-start', node, event)"
        @drag-end="() => emit('drag-end')"
        @drag-over="(node, event) => emit('drag-over', node, event)"
      />
    </div>
  </div>
</template>

<style scoped>
.tree-node {
  position: relative;
  min-height: 32px;
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
  min-height: 32px;
  border-radius: 4px;
  margin: 1px 0;
}

.form-check-input {
  cursor: pointer;
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
  margin-left: 6px;
  padding-left: 20px;
}

.tree-node-expanded > .tree-children {
  display: block;
}

.tree-children-expanded {
  border-left: dashed 2px #007bff;
  border-radius: 1px;
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
</style> 