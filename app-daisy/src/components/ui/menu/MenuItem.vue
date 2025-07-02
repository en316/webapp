<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import type { MenuOption } from './Menu.vue';

const props = defineProps<{
  item: MenuOption;
  mode: 'vertical' | 'horizontal';
  collapsed?: boolean;
  selectedKey: string | number;
  expandedKeys: (string | number)[];
}>();

const emit = defineEmits<{
  (e: 'select', key: string | number, option: MenuOption): void;
  (e: 'expand', menuItem: MenuOption): void;
}>();

const isSelected = computed(() => {
  if (!props.selectedKey || !props.item.id) return false;
  return String(props.selectedKey) === String(props.item.id);
});
const isExpanded = computed(() => {
  if (!props.expandedKeys || !props.item.id) return false;
  return props.expandedKeys.some(key => String(key) === String(props.item.id));
});
const isDisabled = computed(() => !!props.item.disabled);
const isCollapsed = computed(() => props.collapsed ?? false);

function handleClick(e: MouseEvent) {
  if (isDisabled.value) return;
  
  // 如果有子菜单，总是触发展开事件
  if (props.item.children && props.item.children.length > 0) {
    emit('expand', props.item);
  } else {
    // 只有没有子菜单的项目才触发选中事件
    emit('select', props.item.id, props.item);
  }
}

function handleChildSelect(key: string | number, option: MenuOption) {
  emit('select', key, option);
}

function handleChildExpand(menuItem: MenuOption) {
  emit('expand', menuItem);
}
</script>

<template>
  <li class="relative group">
    <div
      class="flex items-center px-4 py-2 cursor-pointer select-none"
      :class="[
        isSelected && !isDisabled ? 'bg-primary text-primary-content' : 'hover:bg-base-200',
        isDisabled ? 'opacity-50 cursor-not-allowed' : '',
        isCollapsed ? 'justify-center' : ''
      ]"
      @click="handleClick"
      :title="isCollapsed ? props.item.label : ''"
    >
      <span v-if="props.item.icon" :class="isCollapsed ? '' : 'mr-2'">
        <i :class="props.item.icon">
          <svg width="16" height="16" viewBox="0 0 448 512"><path fill="currentColor" d="M62.258 8.006a22.216 22.216 0 0 0-20.929 13.448c-3.404 8.169-.96 13.898 6.506 24.59c10.935 16.09 122.178 149.673 122.178 149.673l-24.619 23.038c-20.74 20.735-21.632 48.566-2.34 67.852l28.663 27.3l-79.976 98.235c-6.21 6.614-10.053 18.221-6.585 26.552a22.697 22.697 0 0 0 21.21 14.06a20.227 20.227 0 0 0 15.249-7.536l95.122-88.437L363.33 496.39a27.141 27.141 0 0 0 18.418 7.61a25.26 25.26 0 0 0 7.335-1.108a27.658 27.658 0 0 0 18.4-18.99a25.606 25.606 0 0 0-6.481-23.69L272.219 305.195l23.062-21.443c17.198-15.504 17.29-42.455.197-58.076l-25.257-24.228L357.417 98.46l.115-.133l.103-.14c7.793-10.123 11.52-17.92 7.502-27.806a36.169 36.169 0 0 0-23.647-18.37a24.07 24.07 0 0 0-3.166-.212l-.006.018a28.524 28.524 0 0 0-18.252 8.123l-.203.166l-.19.173L218.6 151.925L79.261 18.253S70.995 8.213 62.258 8.006m276.06 51.214c.742.003 1.484.051 2.22.148a29.306 29.306 0 0 1 17.719 13.81c2.246 5.523 1.554 10.01-6.506 20.484L264.861 196.3l-40.882-39.22l100.68-91.304a21.77 21.77 0 0 1 13.66-6.536zM175.077 201.127L395.19 464.872c4.32 5.408 7.02 10.818 5.18 16.914a20.246 20.246 0 0 1-13.463 14.037a17.617 17.617 0 0 1-5.17.784a19.792 19.792 0 0 1-13.293-5.56l-220.15-209.694c-17.317-17.316-14.698-40.33 2.158-57.186z"/></svg>
        </i>
      </span>
      <span v-if="!isCollapsed">{{ props.item.label }}</span>
      <span v-if="props.item.children && !isCollapsed" class="ml-auto">
        <svg v-if="props.mode === 'vertical'" class="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <svg v-else class="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 9l7 7 7-7"/></svg>
      </span>
      <!-- 收起状态下的选中指示器 -->
      <div v-if="isCollapsed && isSelected && !isDisabled" class="absolute right-1 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-primary-content rounded-full"></div>
    </div>
    
    <!-- 收起状态下的悬浮提示 -->
    <div
      v-if="isCollapsed && !isDisabled"
      class="absolute left-full top-0 ml-2 px-2 py-1 bg-base-300 text-base-content text-sm rounded shadow-lg opacity-0 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap group-hover:opacity-100"
    >
      {{ props.item.label }}
      <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-l-0 border-r-4 border-y-2 border-transparent border-r-base-300"></div>
    </div>
    
    <ul
      v-if="props.item.children && isExpanded && !isCollapsed"
      :class="[
        props.mode === 'horizontal'
          ? 'absolute left-0 top-full z-50 bg-base-100 rounded-box shadow-lg min-w-[160px]'
          : 'pl-6'
      ]"
    >
      <MenuItem
        v-for="child in props.item.children"
        :key="child.id"
        :item="child"
        :mode="props.mode"
        :collapsed="isCollapsed"
        :selected-key="props.selectedKey"
        :expanded-keys="props.expandedKeys"
        @select="handleChildSelect"
        @expand="handleChildExpand"
      />
    </ul>
  </li>
</template>