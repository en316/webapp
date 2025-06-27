<script setup lang="ts">
import { ref } from 'vue'

interface AlertMessage {
    id: number;
    message: string;
    type: 'success' | 'danger' | 'warning' | 'info';
}
const alerts = ref<AlertMessage[]>([]);

const showAlert = () => {
    const newAlert: AlertMessage = {
        id: alertId++,
        message: '这是一个成功的 alert 消息！',
        type: 'success'
    };
    alerts.value.push(newAlert);

    // 3秒后自动移除
    setTimeout(() => {
        removeAlert(newAlert.id);
    }, 3000);
};

let alertId = 0;



const removeAlert = (id: number) => {
    const index = alerts.value.findIndex(alert => alert.id === id);
    if (index > -1) {
        alerts.value.splice(index, 1);
    }
};
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
        </div>
    </div>
</template>
<style scoped></style>