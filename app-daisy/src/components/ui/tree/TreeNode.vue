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
      'rounded',
      {
        'bg-primary/10': dragOverNode?.id === node.id,
        'border-t-2 border-primary': dragOverNode?.id === node.id && dragPosition === 'before',
        'border-b-2 border-primary': dragOverNode?.id === node.id && dragPosition === 'after',
        'border-2 border-dashed border-primary bg-primary/20': dragOverNode?.id === node.id && dragPosition === 'inside',
        'opacity-50': draggedNode?.id === node.id,
        'cursor-not-allowed opacity-60': node.disabled
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
      class="tree-node-content flex items-center px-2 py-1 min-h-8 hover:bg-base-200 rounded transition-all"
      :style="{ paddingLeft: `${level * 16 + 8}px` }"
    >
      <!-- 展开/收起图标 -->
      <span v-if="hasChildren" class="tree-toggle-icon cursor-pointer mr-1 text-base-content/70 hover:text-primary flex items-center justify-center" @click="handleToggleClick">
        <svg v-if="isExpanded" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </span>

      <!-- 复选框 -->
      <input
        v-if="showCheckbox"
        type="checkbox"
        class="checkbox checkbox-xs mr-2"
        :checked="isChecked"
        :indeterminate="isIndeterminate"
        @change="handleCheckboxChange"
        @click.stop
      />
      
      <!-- 节点图标 -->
      <i v-if="showIcons && node.icon" :class="['tree-node-icon', node.icon, 'mr-1', 'text-base-content/70']" />
      
      <!-- 节点标签 -->
      <span class="tree-node-label flex-1 truncate">{{ node.label }}</span>
    </div>
    
    <!-- 子节点 -->
    <div v-if="hasChildren && isExpanded" class="tree-children ml-2 border-l border-base-300">
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
  transition: background-color 0.2s;
}
</style> 