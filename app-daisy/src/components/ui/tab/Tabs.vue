<script setup lang="ts">
import { ref, provide, watch, getCurrentInstance, onMounted, nextTick } from 'vue';

interface TabPaneInfo {
    uid: number;
    name: string;
    closable: boolean;
    checked: boolean;
}

const props = withDefaults(defineProps<{
    type?: "top" | "bottom";
    border?: boolean;
    tabClass?: string;
    addable?: boolean;
    closable?: boolean;
}>(), {
    type: 'top',
    border: true,
    tabClass: '',
    addable: false,
    closable: false,
});

const emit = defineEmits(['add']);

const tabPanes = ref<TabPaneInfo[]>([]);
const activeTab = ref<number | null>(null);

function registerTabPane(info: TabPaneInfo) {
    if (!tabPanes.value.find(tp => tp.uid === info.uid)) {
        tabPanes.value.push(info);
        if (activeTab.value === null || info.checked) {
            activeTab.value = info.uid;
        }
    }
}

function unregisterTabPane(uid: number) {
    const idx = tabPanes.value.findIndex(tp => tp.uid === uid);
    if (idx !== -1) {
        tabPanes.value.splice(idx, 1);
        if (activeTab.value === uid) {
            activeTab.value = tabPanes.value[0]?.uid ?? null;
        }
    }
}

function selectTab(uid: number) {
    activeTab.value = uid;
    // 滚动到可见
    nextTick(() => {
        const el = document.querySelector(`[data-tab-uid="${uid}"]`);
        el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
}

function closeTab(uid: number, e?: MouseEvent) {
    if (e) e.stopPropagation();
    unregisterTabPane(uid);
    checkOverflow();
}

function onTabContextMenu(e: MouseEvent, tab: TabPaneInfo) {
    e.preventDefault();
    alert(`右键菜单: ${tab.name}`);
}

// 滚动与溢出处理
const tabListRef = ref<HTMLElement | null>(null);
const showMore = ref(false);

function checkOverflow() {
    const el = tabListRef.value;
    if (!el) return;
    showMore.value = el.scrollWidth > el.clientWidth + 2;
}

// 添加/删除 tab 后
watch(tabPanes, () => nextTick(checkOverflow));

// 容器宽度变化时
onMounted(() => {
    nextTick(checkOverflow);
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => checkOverflow());
        if (tabListRef.value) ro.observe(tabListRef.value);
    } else {
        window.addEventListener('resize', checkOverflow);
    }
});

function handleAdd() {
    emit('add');
    checkOverflow();
}

const showDropdown = ref(false);
const dropdownX = ref(0);
const dropdownY = ref(0);
const dropdownRef = ref<HTMLElement | null>(null);

function handleMoreClick(e: MouseEvent) {
    showDropdown.value = true;
    dropdownX.value = (e.target as HTMLElement).getBoundingClientRect().left;
    dropdownY.value = (e.target as HTMLElement).getBoundingClientRect().bottom;
    nextTick(() => {
        dropdownRef.value?.focus();
    });
}

function handleDropdownSelect(uid: number) {
    selectTab(uid);
    showDropdown.value = false;
}

provide('registerTabPane', registerTabPane);
provide('unregisterTabPane', unregisterTabPane);
provide('activeTab', activeTab);
</script>

<template>
    <div :class="[
        'tabs',
        ...tabClass.split(' '),
        {
            'tabs-bottom': props.type == 'bottom',
            'tabs-border': props.border
        }
    ]">
        <div class="flex items-center w-full">
            <div class="flex items-center">
                <slot name="prefix"></slot>
            </div>
            <div class="flex-1 relative mx-2 overflow-x-auto scrollbar-hide" ref="tabListRef" style="min-width: 0;">
                <div class="flex whitespace-nowrap">
                    <template v-for="tab in tabPanes" :key="tab.uid">
                        <div class="tab px-4 py-2 tems-center cursor-pointer select-none"
                            :class="{ 'tab-active': activeTab === tab.uid }" :data-tab-uid="tab.uid"
                            @click="selectTab(tab.uid)" @contextmenu="onTabContextMenu($event, tab)">
                                <div>
                                    <span class="truncate max-w-[120px]">{{ tab.name }}</span>
                                    <button v-if="tab.closable || closable" class="ml-1" @click.stop="closeTab(tab.uid, $event)"
                                        style="background: none; border: none; cursor: pointer;" title="关闭">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                    </template>
                </div>
            </div>
            <!-- 下拉所有tab -->
            <div
                v-if="showDropdown"
                class="absolute bg-white shadow rounded border z-50 scrollbar scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100"
                :style="{ left: dropdownX + 'px', top: dropdownY + 'px', maxHeight: '200px', overflowY: 'auto' }"
                tabindex="0"
                ref="dropdownRef"
                @blur="showDropdown = false"
            >
                <div v-for="tab in tabPanes" :key="tab.uid"
                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    @click="handleDropdownSelect(tab.uid)">
                    <span class="truncate max-w-[140px]">{{ tab.name }}</span>
                    <button v-if="tab.closable || closable" class="ml-1" @click="closeTab(tab.uid, $event)"
                        style="background: none; border: none; cursor: pointer;" title="关闭">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            <!-- 省略/更多按钮 -->
            <button v-if="showMore" class="ml-2 btn btn-sm btn-ghost"
                @click="handleMoreClick" style="z-index: 10;">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="12" r="1.5" fill="currentColor" />
                </svg>
            </button>
            <!-- 添加按钮 -->
            <button v-if="addable" class="ml-2 btn btn-sm btn-ghost" @click="handleAdd" title="添加">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
            <div class="flex items-center">
                <slot name="suffix"></slot>
            </div>
        </div>
    </div>
    <div>
        <slot></slot>
    </div>
</template>

<style scoped>
/* 隐藏所有浏览器的滚动条，但允许滚动 */
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;             /* Chrome, Safari, Opera */
}

::-webkit-scrollbar {
  width: 6px;
  background: #f3f4f6;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
</style>