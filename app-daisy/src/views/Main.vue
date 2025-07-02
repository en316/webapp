<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Menu Test</h2>
    <div class="mb-4">
      <p>Selected: {{ selected }}</p>
      <p>Expanded: {{ expanded }}</p>
      <p>Collapsed: {{ collapsed }}</p>
      <div class="flex gap-2 mt-2">
        <button @click="selected = '1'" class="btn btn-sm">Select Dashboard</button>
        <button @click="selected = '2-1'" class="btn btn-sm">Select User List</button>
        <button @click="selected = '2-2-1'" class="btn btn-sm">Select Profile</button>
        <button @click="selected = '2-2-2'" class="btn btn-sm">Select Security</button>
        <button @click="collapsed = !collapsed" class="btn btn-sm btn-primary">
          {{ collapsed ? 'Expand' : 'Collapse' }} Menu
        </button>
      </div>
    </div>
    <div class="flex gap-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Vertical Menu</h3>
        <Menu :options="menuOptions" mode="vertical" v-model:collapsed="collapsed" v-model:selectedKey="selected"
          v-model:expandedKeys="expanded" @select="onSelect" />
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-2">Horizontal Menu</h3>
        <Menu :options="menuOptions" mode="horizontal" v-model:collapsed="collapsed" v-model:selectedKey="selected"
          v-model:expandedKeys="expanded" @select="onSelect" />
      </div>

    </div>

    <div>
      <Tabs tab-class="tabs-box" closable addable @add="onAddTab">
        <template #prefix>
          <span>前置内容</span>
        </template>
        <template #suffix>
          <span>后置内容</span>
        </template>
        <TabPane name="tab 1">
          <div style="color: red;">tab 1 内容，可以是任意 HTML</div>
        </TabPane>
        <TabPane checked name="tab 2">
          <div>
            <b>tab 2</b> <i>内容</i>
            <button>bt</button>
          </div>
        </TabPane>
        <TabPane v-for="tab in tabs" :key="tab.name" :name="tab.name" :closable="tab.closable" :checked="tab.checked">
          <div>
            <b>{{ tab.name }}</b> <i>内容</i>
            <button>bt</button>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Menu from '@/components/ui/menu/Menu.vue';
import Tabs from '@/components/ui/tab/Tabs.vue'
import TabPane from '@/components/ui/tab/TabPane.vue'

const selected = ref<string | number>('');
const expanded = ref<(string | number)[]>([]);
const collapsed = ref<boolean>(false);

const tabs = ref([
  {
    name: 'tab 1',
    closable: true,
    checked: true,
  },
  {
    name: 'tab 2',
    closable: true,
    checked: true,
  }
]);

const menuOptions = [
  {
    id: '1',
    label: 'Dashboard',
    icon: 'i-heroicons-home',
  },
  {
    id: '2',
    label: 'User',
    icon: 'i-heroicons-user',
    children: [
      {
        id: '2-1',
        label: 'User List',
        expanded: true,

      },
      {
        id: '2-2',
        label: 'User Setting',
        children: [
          { id: '2-2-1', label: 'Profile' },
          { id: '2-2-2', label: 'Security' }
        ]
      }
    ]
  },
  {
    id: '3',
    label: 'Disabled',
    disabled: true
  }
];

function onSelect(key: string | number, option: any) {
  console.log('Selected:', key, option);
}

function onAddTab() {
  tabs.value.push({
    name: `tab ${tabs.value.length + 1}`,
    closable: true,
    checked: true,
  });
}
</script>