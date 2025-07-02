<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import MenuItem from './MenuItem.vue';

export interface MenuOption {
  id: string | number;
  label: string;
  icon?: string;
  expanded?: boolean;
  disabled?: boolean;
  children?: MenuOption[];
}

const props = defineProps<{
  options: MenuOption[];
  mode?: 'vertical' | 'horizontal';
  selectedKey?: string | number;
  expandedKeys?: (string | number)[];
  collapsed?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:selectedKey', key: string | number): void;
  (e: 'update:expandedKeys', keys: (string | number)[]): void;
  (e: 'select', key: string | number, option: MenuOption): void;
  (e: 'update:collapsed', collapsed: boolean): void;
}>();

const menuMode = computed(() => props.mode ?? 'vertical');
const isCollapsed = computed(() => props.collapsed ?? false);

const selectedKey = ref<string | number>(props.selectedKey ?? '');
const expandedKeys = ref<(string | number)[]>(props.expandedKeys ?? []);

watch(() => props.selectedKey, v => { if (v !== undefined) selectedKey.value = v; });
watch(() => props.expandedKeys, v => { if (v !== undefined) expandedKeys.value = v; });

function handleSelect(key: string | number, option: MenuOption) {
  selectedKey.value = key;
  emit('update:selectedKey', key);
  emit('select', key, option);
}

function handleExpand(menuItem: MenuOption) {
  if (isCollapsed.value) {
    emit('update:collapsed', false);
    return;
  }
  
  let keys = [...expandedKeys.value];
  const idx = keys.findIndex(key => String(key) === String(menuItem.id));
  if (idx > -1) {
    keys.splice(idx, 1);
  } else {
    keys.push(menuItem.id);
  }
  expandedKeys.value = keys;
  emit('update:expandedKeys', keys);
}
</script>

<template>
  <ul
    class="menu bg-base-100 rounded-box"
    :class="[
      menuMode === 'vertical' 
        ? isCollapsed ? 'w-16' : 'w-56'
        : 'menu-horizontal flex-row',
    ]"
    style="overflow: visible;"
  >
    <MenuItem
      v-for="item in props.options"
      :key="item.id"
      :item="item"
      :mode="menuMode"
      :collapsed="isCollapsed"
      :selected-key="selectedKey"
      :expanded-keys="expandedKeys"
      @select="handleSelect"
      @expand="handleExpand"
    />
  </ul>
</template>