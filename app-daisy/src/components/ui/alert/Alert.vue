<script setup lang="ts">
import { ref } from 'vue';

interface AlertMessage {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

interface Props {
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  autoClose: true,
  autoCloseDelay: 3000
});

const alerts = ref<AlertMessage[]>([]);
let alertId = 0;

const showAlert = (message: string, type: AlertMessage['type'] = 'success') => {
  const newAlert: AlertMessage = {
    id: alertId++,
    message,
    type
  };
  alerts.value.push(newAlert);
  
  if (props.autoClose) {
    setTimeout(() => {
      removeAlert(newAlert.id);
    }, props.autoCloseDelay);
  }
};

const removeAlert = (id: number) => {
  const index = alerts.value.findIndex(alert => alert.id === id);
  if (index > -1) {
    alerts.value.splice(index, 1);
  }
};

// 暴露方法给父组件使用
defineExpose({
  showAlert,
  removeAlert
});
</script>

<template>
  <div class="alert-container">
    <div 
      v-for="alert in alerts" 
      :key="alert.id"
      :class="[
        'alert',
        alert.type === 'success' ? 'alert-success' : '',
        alert.type === 'danger' ? 'alert-error' : '',
        alert.type === 'warning' ? 'alert-warning' : '',
        alert.type === 'info' ? 'alert-info' : '',
        'shadow-lg', 'rounded', 'mb-2', 'flex', 'items-center', 'gap-2', 'px-4', 'py-2'
      ]"
      role="alert"
    >
      <div class="flex-1">{{ alert.message }}</div>
      <button 
        type="button" 
        class="btn btn-xs btn-circle btn-ghost" 
        @click="removeAlert(alert.id)"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.alert-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1050;
  max-width: 400px;
}
</style> 