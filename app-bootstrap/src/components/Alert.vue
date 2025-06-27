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
      :class="`alert alert-${alert.type} alert-dismissible fade show`" 
      role="alert"
    >
      <div>{{ alert.message }}</div>
      <button 
        type="button" 
        class="btn-close" 
        @click="removeAlert(alert.id)"
        aria-label="Close"
      ></button>
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

.alert {
  margin-bottom: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style> 