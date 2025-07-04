<script setup lang="ts">
import { inject, getCurrentInstance, onMounted, onBeforeUnmount, computed } from 'vue';

interface Props {
  name: string;
  active?: boolean;
  checked?: boolean;
  closable?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  name: "",
  checked: false,
  closable: false,
});

const registerTabPane = inject('registerTabPane') as Function;
const unregisterTabPane = inject('unregisterTabPane') as Function;
const activeTab = inject('activeTab') as any;
const instance = getCurrentInstance();

onMounted(() => {
  registerTabPane({
    uid: instance!.uid,
    name: props.name,
    closable: props.closable,
    checked: props.checked,
  });
  if (props.active) {
    activeTab.value = instance!.uid;
  }
});

onBeforeUnmount(() => {
  unregisterTabPane(instance!.uid);
});

const isActive = computed(() => activeTab.value === instance!.uid);

</script>

<template>
  <div v-show="isActive">
    <slot></slot>
  </div>
</template>

<style></style>