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
      <h3 class="text-lg font-semibold mb-2">Tabs Test - Bottom Position</h3>
      <p>Active Tab: {{ activeTab }}</p>
      <Tabs tabPosition="bottom" v-model="activeTab" :closable="true" :addable="true" @add="handleAddTab">
        <template #header-before>
          <span class="text-gray-400 mr-2">前置内容</span>
        </template>
        <template #header-after>
          <span class="text-gray-400 ml-2">后置内容</span>
        </template>
        <TabPane name="tab1" active>
          <div class="p-4 bg-blue-100 rounded">
            <h4 class="font-bold text-blue-800">Tab 1 内容</h4>
            <p>这里是Tab 1的内容，可以写任意HTML</p>
            <button class="btn btn-primary mt-2">测试按钮</button>
          </div>
        </TabPane>
        <TabPane name="tab2">
          <div class="p-4 bg-green-100 rounded">
            <h4 class="font-bold text-green-800">Tab 2 内容</h4>
            <p>Tab 2内容</p>
            <ul class="list-disc list-inside mt-2">
              <li>列表项 1</li>
              <li>列表项 2</li>
              <li>列表项 3</li>
            </ul>
          </div>
        </TabPane>
        <TabPane name="tab3">
          <div class="p-4 bg-yellow-100 rounded">
            <h4 class="font-bold text-yellow-800">Tab 3 内容</h4>
            <p>Tab 3内容</p>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <div class="bg-white p-2 rounded">网格项 1</div>
              <div class="bg-white p-2 rounded">网格项 2</div>
            </div>
          </div>
        </TabPane>
        <TabPane name="tab4">
          <div class="p-4 bg-purple-100 rounded">
            <h4 class="font-bold text-purple-800">Tab 4 内容</h4>
            <p>这是一个很长的Tab名称来测试滚动功能</p>
          </div>
        </TabPane>
        <TabPane name="tab5">
          <div class="p-4 bg-pink-100 rounded">
            <h4 class="font-bold text-pink-800">Tab 5 内容</h4>
            <p>另一个很长的Tab名称来测试滚动功能</p>
          </div>
        </TabPane>
        <TabPane name="tab6">
          <div class="p-4 bg-indigo-100 rounded">
            <h4 class="font-bold text-indigo-800">Tab 6 内容</h4>
            <p>第三个很长的Tab名称来测试滚动功能</p>
          </div>
        </TabPane>
      </Tabs>
    </div>

    <div class="mt-8">
      <h3 class="text-lg font-semibold mb-2">Tabs Test - Top Position</h3>
      <Tabs tabPosition="top" v-model="activeTab2" :closable="true" :addable="true" @add="handleAddTab">
        <template #header-before>
          <span class="text-gray-400 mr-2">前置内容</span>
        </template>
        <template #header-after>
          <span class="text-gray-400 ml-2">后置内容</span>
        </template>
        <TabPane name="tab1">
          <div class="p-4 bg-blue-100 rounded">
            <h4 class="font-bold text-blue-800">Tab 1 内容 (Top)</h4>
            <p>这里是Tab 1的内容，可以写任意HTML</p>
            <button class="btn btn-primary mt-2">测试按钮</button>
          </div>
        </TabPane>
        <TabPane name="tab2">
          <div class="p-4 bg-green-100 rounded">
            <h4 class="font-bold text-green-800">Tab 2 内容 (Top)</h4>
            <p>Tab 2内容</p>
            <ul class="list-disc list-inside mt-2">
              <li>列表项 1</li>
              <li>列表项 2</li>
              <li>列表项 3</li>
            </ul>
          </div>
        </TabPane>
        <TabPane name="tab3">
          <div class="p-4 bg-yellow-100 rounded">
            <h4 class="font-bold text-yellow-800">Tab 3 内容 (Top)</h4>
            <p>Tab 3内容</p>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <div class="bg-white p-2 rounded">网格项 1</div>
              <div class="bg-white p-2 rounded">网格项 2</div>
            </div>
          </div>
        </TabPane>
        <TabPane v-for="tab in tabs" :key="tab.name" :name="tab.name">
          <div class="p-4 bg-gray-100 rounded">
            <h4 class="font-bold text-gray-800">Tab {{ tab.name }} 内容 (Top)</h4>
            <p>Tab {{ tab.content }}内容</p>
          </div>
        </TabPane>
      </Tabs>
    </div>

    <div>
      <!-- name of each tab group should be unique -->
      <div class="flex">
        <div>
          prefix
        </div>
        <div role="tablist" class="tabs tabs-box">

          <a role="tab" class="tab">
            Tab 1
            <button class="ml-1 inline-flex items-center justify-center rounded hover:bg-base-300 transition"
              style="background: none; border: none; cursor: pointer;" title="关闭">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </a>
          <a role="tab" class="tab tab-active text-primary [--tab-bg:orange] [--tab-border-color:red]"> Tab 2</a>
          <a role="tab" class="tab">Tab 3</a>
        </div>
        <div>
          suffix
        </div>
      </div>
      <div class="">
        content
      </div>
    </div>

    <button class="mr-2 px-2 py-2 rounded hover:bg-gray-200 transition-colors" title="右移">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
    </button>




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
const activeTab = ref();
const activeTab2 = ref();

const tabs = ref([
  {
    name: 'tab 1',
    content: 'true',
  },
  {
    name: 'tab 2',
    content: 'true',
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

function handleAddTab() {
  tabs.value.push({
    name: 'tab ' + (tabs.value.length + 1),
    content: 'true',
  });
}

</script>