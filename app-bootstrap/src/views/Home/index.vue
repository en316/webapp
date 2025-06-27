<script setup lang="ts">
import { ref } from 'vue';
import Alert from '@/components/Alert.vue';
import Tree, { type TreeNode } from '@/components/Tree.vue';

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
  <Alert ref="alertRef" :auto-close="true" :auto-close-delay="3000" >
    custon content
  </Alert>
  <i class="bi bi-chevron-down"></i>
  <i class="bi bi-chevron-right"></i>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-6">
        <h4>Alert 组件演示</h4>
        <div class="d-flex gap-2 mb-3">
          <button type="button" class="btn btn-primary" @click="showAlert">成功消息</button>
          <button type="button" class="btn btn-warning" @click="showWarningAlert">警告消息</button>
          <button type="button" class="btn btn-danger" @click="showErrorAlert">错误消息</button>
        </div>

        <div>
          <button type="button" class="btn btn-outline-primary">Primary</button>
          <button type="button" class="btn btn-outline-secondary">Secondary</button>
          <button type="button" class="btn btn-outline-success">Success</button>
          <button type="button" class="btn btn-outline-danger">Danger</button>
          <button type="button" class="btn btn-outline-warning">Warning</button>
          <button type="button" class="btn btn-outline-info">Info</button>
          <button type="button" class="btn btn-outline-light">Light</button>
          <button type="button" class="btn btn-outline-dark">Dark</button>
        </div>

        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td colspan="2">Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-md-6">
        <h4>Tree 组件演示</h4>
        <div class="card">
          <div class="card-body">
            <Tree v-model:data="treeData" :draggable="true" :show-icons="true" :context-menu="true"
              :default-expanded="false" :show-checkbox="true" v-model:checked-keys="checkedKeys"
              @node-click="handleNodeClick" @node-dblclick="handleNodeDblClick"
              @node-contextmenu="handleNodeContextMenu" @node-drop="handleNodeDrop" @node-expand="handleNodeExpand"
              @node-collapse="handleNodeCollapse" />
          </div>
        </div>

        <div class="mt-3">
          <p>当前选中的节点：{{ checkedKeys.join(', ') }}</p>
          <h6>功能说明：</h6>
          <ul class="list-unstyled">
            <li><i class="bi bi-mouse me-2"></i>点击节点：触发点击事件</li>
            <li><i class="bi bi-mouse me-2"></i>双击节点：展开/收起子节点</li>
            <li><i class="bi bi-mouse me-2"></i>右键节点：显示上下文菜单</li>
            <li><i class="bi bi-arrows-move me-2"></i>拖拽节点：重新排列节点</li>
            <li><i class="bi bi-chevron-right me-2"></i>点击箭头：展开/收起子节点</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>