<script setup lang="ts">
import { ref } from 'vue'

import Alert from '@/components/ui/alert/Alert.vue'
import Tree, { type TreeNode } from '@/components/ui/tree/Tree.vue';
// 当前选中的侧边栏项目
const activeSidebarItem = ref('explorer')

// 侧边栏内容区是否显示
const showSidebarContent = ref(true)

// 侧边栏宽度
const minSidebarWidth = 48 // 只显示图标栏
const maxSidebarWidth = 400
const defaultSidebarWidth = 256
const sidebarWidth = ref(defaultSidebarWidth)
const isResizing = ref(false)
const dragging = ref(false)
const dragStartX = ref(0)
const dragStartWidth = ref(0)

// 侧边栏项目配置
const sidebarItems = [
  {
    id: 'explorer',
    icon: '📁',
    label: '资源管理器',
    content: '文件资源管理器内容'
  },
  {
    id: 'search',
    icon: '🔍',
    label: '搜索',
    content: '搜索功能内容'
  },
  {
    id: 'git',
    icon: '📦',
    label: '源代码管理',
    content: 'Git 源代码管理内容'
  },
  {
    id: 'debug',
    icon: '🐛',
    label: '运行和调试',
    content: '调试功能内容'
  },
  {
    id: 'extensions',
    icon: '🧩',
    label: '扩展',
    content: '扩展管理内容'
  }
]

// 切换侧边栏项目
const switchSidebarItem = (itemId: string) => {
  if (activeSidebarItem.value === itemId) {
    showSidebarContent.value = !showSidebarContent.value
  } else {
    activeSidebarItem.value = itemId
    showSidebarContent.value = true
  }
}

// 获取当前选中项目的内容
const getCurrentContent = () => {
  return sidebarItems.find(item => item.id === activeSidebarItem.value)?.content || ''
}

// 拖拽相关
const onDragStart = (e: MouseEvent) => {
  if (!showSidebarContent.value) return
  dragging.value = true
  isResizing.value = true
  dragStartX.value = e.clientX
  dragStartWidth.value = sidebarWidth.value
}

const onDragMove = (e: MouseEvent) => {
  if (!dragging.value) return
  let newWidth = dragStartWidth.value + (e.clientX - dragStartX.value)
  if (newWidth < minSidebarWidth) newWidth = minSidebarWidth
  if (newWidth > maxSidebarWidth) newWidth = maxSidebarWidth
  sidebarWidth.value = newWidth
}

const onDragEnd = () => {
  if (!dragging.value) return
  dragging.value = false
  isResizing.value = false
}

const alertRef = ref<InstanceType<typeof Alert>>();

const showAlert = () => {
  alertRef.value?.showAlert('这是一个成功的 alert 消息！', 'success');
};

const showWarningAlert = () => {
  alertRef.value?.showAlert('这是一个警告消息！', 'warning');
};

const showErrorAlert = () => {
  alertRef.value?.showAlert('这是一个错误消息！', 'danger');
};
// tree
// Tree 组件数据
const checkedKeys = ref<(string | number)[]>(['1-1-1']);
const treeData = ref<TreeNode[]>([
  {
    id: '1',
    label: '项目根目录',
    icon: 'bi bi-folder-fill',
    expanded: true,
    children: [
      {
        id: '1-1',
        label: '前端开发',
        icon: 'bi bi-code-slash',
        children: [
          {
            id: '1-1-1',
            label: 'Vue.js',
            icon: 'bi bi-file-earmark-code',
            children: [
              { id: '1-1-1-1', label: 'main.ts', icon: 'bi bi-file-earmark-text' },
              { id: '1-1-1-2', label: 'App.vue', icon: 'bi bi-file-earmark-code' },
              { id: '1-1-1-3', label: 'router.ts', icon: 'bi bi-file-earmark-code' }
            ]
          },
          {
            id: '1-1-2',
            label: 'TypeScript',
            icon: 'bi bi-file-earmark-code',
            children: [
              { id: '1-1-2-1', label: 'types.ts', icon: 'bi bi-file-earmark-text' },
              { id: '1-1-2-2', label: 'utils.ts', icon: 'bi bi-file-earmark-code' }
            ]
          }
        ]
      },
      {
        id: '1-2',
        label: '后端开发',
        icon: 'bi bi-server',
        children: [
          {
            id: '1-2-1',
            label: 'Spring Boot',
            icon: 'bi bi-gear-fill',
            children: [
              { id: '1-2-1-1', label: 'Application.java', icon: 'bi bi-file-earmark-code' },
              { id: '1-2-1-2', label: 'Controller.java', icon: 'bi bi-file-earmark-code' },
              { id: '1-2-1-3', label: 'Service.java', icon: 'bi bi-file-earmark-code' }
            ]
          },
          {
            id: '1-2-2',
            label: '数据库',
            icon: 'bi bi-database',
            children: [
              { id: '1-2-2-1', label: 'schema.sql', icon: 'bi bi-file-earmark-text' },
              { id: '1-2-2-2', label: 'data.sql', icon: 'bi bi-file-earmark-text' }
            ]
          }
        ]
      },
      {
        id: '1-3',
        label: '文档',
        icon: 'bi bi-file-earmark-text',
        children: [
          { id: '1-3-1', label: 'README.md', icon: 'bi bi-file-earmark-text' },
          { id: '1-3-2', label: 'API文档.md', icon: 'bi bi-file-earmark-text' },
          { id: '1-3-3', label: '部署指南.md', icon: 'bi bi-file-earmark-text' }
        ]
      }
    ]
  }
]);

// Tree 事件处理
const handleNodeClick = (node: TreeNode, event: MouseEvent) => {
  alertRef.value?.showAlert(`点击了节点: ${node.label}`, 'info');
};

const handleNodeDblClick = (node: TreeNode, event: MouseEvent) => {
  alertRef.value?.showAlert(`双击了节点: ${node.label}`, 'warning');
};

const handleNodeContextMenu = (node: TreeNode, event: MouseEvent) => {
  alertRef.value?.showAlert(`右键点击了节点: ${node.label}`, 'info');
};

const handleNodeDrop = (draggedNode: TreeNode, targetNode: TreeNode, position: string) => {
  console.log("handleNodeDrop");
  alertRef.value?.showAlert(
    `拖拽 ${draggedNode.label} 到 ${targetNode.label} 的${position === 'before' ? '前面' : position === 'after' ? '后面' : '内部'}`,
    'success'
  );
};

const handleNodeExpand = (node: TreeNode) => {
  alertRef.value?.showAlert(`展开节点: ${node.label}`, 'info');
};

const handleNodeCollapse = (node: TreeNode) => {
  alertRef.value?.showAlert(`收起节点: ${node.label}`, 'info');
};

</script>

<template>
  <Alert ref="alertRef" :auto-close="true" :auto-close-delay="3000"></Alert>
  <div class="h-screen flex flex-col bg-base-200" @mousemove="onDragMove" @mouseup="onDragEnd"
    :style="{ cursor: dragging ? 'col-resize' : '' }">
    <!-- 顶部菜单栏 -->
    <div class="navbar bg-base-100 shadow-sm border-b border-base-300">

      <div class="navbar-start">

        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>文件</a></li>
            <li><a>编辑</a></li>
            <li><a>查看</a></li>
            <li><a>运行</a></li>
            <li><a>终端</a></li>
            <li><a>帮助</a></li>
          </ul>
        </div>

        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>文件</a></li>
            <li><a>编辑</a></li>
            <li><a>查看</a></li>
            <li><a>运行</a></li>
            <li><a>终端</a></li>
          </ul>
        </div>

        <div class="text-sm font-medium ml-4">VSCode Editor</div>

      </div>

      <div class="navbar-center">
        <div class="tabs tabs-boxed bg-base-200">
          <a class="tab tab-active">index.vue</a>
          <a class="tab">App.vue</a>
          <a class="tab">main.ts</a>
        </div>
      </div>
      <div class="navbar-end">
        <div class="flex items-center gap-2">
          <div class="badge badge-success badge-sm">TypeScript</div>
          <div class="badge badge-info badge-sm">Vue 3</div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧边栏 -->
      <div class="flex bg-base-100 border-r border-base-300"
        :style="{ width: showSidebarContent ? sidebarWidth + 'px' : minSidebarWidth + 'px', transition: isResizing ? 'none' : 'width 0.15s' }">
        <!-- 图标栏 -->
        <div class="w-12 bg-base-200 flex flex-col items-center py-2 gap-1">
          <button v-for="item in sidebarItems" :key="item.id" @click="switchSidebarItem(item.id)" :class="[
            'btn btn-sm btn-ghost w-10 h-10',
            activeSidebarItem === item.id ? 'bg-primary text-primary-content' : 'hover:bg-base-300'
          ]" :title="item.label">
            <span class="text-lg">{{ item.icon }}</span>
          </button>
        </div>

        <!-- 内容栏 -->
        <transition name="fade">
          <div v-show="showSidebarContent" class="bg-base-100 border-r border-base-300"
            :style="{ width: (sidebarWidth - minSidebarWidth) + 'px', minWidth: '0', maxWidth: (maxSidebarWidth - minSidebarWidth) + 'px', transition: isResizing ? 'none' : 'width 0.15s' }">
            <div class="p-4">
              <h3 class="font-semibold text-sm mb-3">
                {{sidebarItems.find(item => item.id === activeSidebarItem)?.label}}
              </h3>
              <div class="text-sm text-base-content/70">
                <!-- {{ getCurrentContent() }} -->
                <Tree v-model:data="treeData" :draggable="true" :show-icons="true" :context-menu="true"
                  :default-expanded="false" :show-checkbox="true" v-model:checked-keys="checkedKeys"
                  @node-click="handleNodeClick" @node-dblclick="handleNodeDblClick"
                  @node-contextmenu="handleNodeContextMenu" @node-drop="handleNodeDrop" @node-expand="handleNodeExpand"
                  @node-collapse="handleNodeCollapse" />
              </div>
            </div>
          </div>
        </transition>

      </div>

      <!-- 拖拽分隔条 -->
      <div v-if="showSidebarContent"
        class="cursor-col-resize w-1 bg-base-300 hover:bg-primary transition-colors duration-100"
        @mousedown="onDragStart" :style="{ userSelect: isResizing ? 'none' : 'auto' }"></div>

      <!-- 主编辑区域 -->
      <div class="flex-1 bg-base-100 flex flex-col">
        <!-- 编辑器工具栏 -->
        <div class="bg-base-200 px-4 py-2 border-b border-base-300">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-base-content/70">行 1, 列 1</span>
            <div class="divider divider-horizontal"></div>
            <span class="text-base-content/70">TypeScript</span>
            <div class="divider divider-horizontal"></div>
            <span class="text-base-content/70">UTF-8</span>
          </div>
        </div>

        <!-- 编辑器内容 -->
        <div class="flex-1 p-4">
          <div class="mockup-code bg-base-300">
            <pre data-prefix="1"><code>&lt;template&gt;</code></pre>
            <pre data-prefix="2"><code>  &lt;div class="container"&gt;</code></pre>
            <pre data-prefix="3"><code>    &lt;h1&gt;Hello DaisyUI!&lt;/h1&gt;</code></pre>
            <pre data-prefix="4"><code>  &lt;/div&gt;</code></pre>
            <pre data-prefix="5"><code>&lt;/template&gt;</code></pre>
            <pre data-prefix="6"><code></code></pre>
            <pre data-prefix="7"><code>&lt;script setup lang="ts"&gt;</code></pre>
            <pre data-prefix="8"><code>// Your code here</code></pre>
            <pre data-prefix="9"><code>&lt;/script&gt;</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="bg-base-100 border-t border-base-300 px-4 py-2">
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-4">
          <span class="text-base-content/70">准备就绪</span>
          <div class="divider divider-horizontal"></div>
          <span class="text-base-content/70">TypeScript 5.0.4</span>
          <div class="divider divider-horizontal"></div>
          <span class="text-base-content/70">Vue 3.3.4</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-base-content/70">Ln 1, Col 1</span>
          <div class="divider divider-horizontal"></div>
          <span class="text-base-content/70">Spaces: 2</span>
          <div class="divider divider-horizontal"></div>
          <span class="text-base-content/70">UTF-8</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--b2));
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--bc) / 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--bc) / 0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>