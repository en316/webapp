<template>
    <div :class="wrapperClass">
        <!-- 顶部或底部 tab 头 -->
        <template v-if="isHorizontal">
            <!-- 当tabPosition为bottom时，先显示内容区 -->
            <template v-if="tabPosition === 'bottom'">
                <!-- 内容区 -->
                <div class="bg-white border rounded-t p-4 flex-1 min-h-[60px]">
                    <slot />
                </div>
                <!-- tab头部 -->
                <div :class="headerClass">
                    <!-- 前置内容和左箭头 -->
                    <div class="flex-shrink-0 flex items-center min-w-[40px]">
                        <slot name="header-before" />
                        <button class="ml-2 px-2 py-2 rounded hover:bg-gray-200 transition-colors" @click="scrollTabs('left')"
                            v-if="showScroll" title="左移">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                    <!-- 可滚动 tab 区域 -->
                    <div ref="tabScroll" class="flex-1 overflow-hidden whitespace-nowrap relative">
                        <div class="inline-flex transition-all duration-200" ref="tabList">
                            <template v-for="(pane) in panes" :key="pane.uid">
                                <div :class="[
                                    'relative px-4 py-2 mr-1 rounded cursor-pointer select-none items-center inline-flex',
                                    pane.uid === activeIndex ? 'bg-white border-t-2 border-blue-500 font-bold text-blue-600' : 'hover:bg-gray-200',
                                ]" @click="setActive(pane.uid)" :ref="el => tabRefs[pane.uid] = el">
                                    <span>
                                        {{ pane.name }}
                                    </span>
                                    <button v-if="closable" class="ml-2 text-gray-400 hover:text-red-500"
                                        @click.stop="closeTab(pane.uid)" title="关闭">×</button>
                                </div>
                            </template>
                        </div>
                    </div>
                    <!-- 右箭头和后置内容、新增按钮 -->
                    <div class="flex-shrink-0 flex items-center min-w-[40px]">
                        <button class="mr-2 px-2 py-2 rounded hover:bg-gray-200 transition-colors" @click="scrollTabs('right')"
                            v-if="showScroll" title="右移">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button v-if="addable" class="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            @click="addTab" title="新增">+</button>
                        <slot name="header-after" />
                    </div>
                </div>
            </template>
            <!-- 当tabPosition为top时，先显示tab头部 -->
            <template v-else>
                <!-- tab头部 -->
                <div :class="headerClass">
                    <!-- 前置内容和左箭头 -->
                    <div class="flex-shrink-0 flex items-center min-w-[40px]">
                        <slot name="header-before" />
                        <button class="ml-2 px-2 py-2 rounded hover:bg-gray-200 transition-colors" @click="scrollTabs('left')"
                            v-if="showScroll" title="左移">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                    <!-- 可滚动 tab 区域 -->
                    <div ref="tabScroll" class="flex-1 overflow-hidden whitespace-nowrap relative">
                        <div class="inline-flex transition-all duration-200" ref="tabList">
                            <template v-for="(pane) in panes" :key="pane.uid">
                                <div :class="[
                                    'relative px-4 py-2 mr-1 rounded cursor-pointer select-none items-center inline-flex',
                                    pane.uid === activeIndex ? 'bg-white border-b-2 border-blue-500 font-bold text-blue-600' : 'hover:bg-gray-200',
                                ]" @click="setActive(pane.uid)" :ref="el => tabRefs[pane.uid] = el">
                                    <span>
                                        {{ pane.name }}
                                    </span>
                                    <button v-if="closable" class="ml-2 text-gray-400 hover:text-red-500"
                                        @click.stop="closeTab(pane.uid)" title="关闭">×</button>
                                </div>
                            </template>
                        </div>
                    </div>
                    <!-- 右箭头和后置内容、新增按钮 -->
                    <div class="flex-shrink-0 flex items-center min-w-[40px]">
                        <button class="mr-2 px-2 py-2 rounded hover:bg-gray-200 transition-colors" @click="scrollTabs('right')"
                            v-if="showScroll" title="右移">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button v-if="addable" class="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            @click="addTab" title="新增">+</button>
                        <slot name="header-after" />
                    </div>
                </div>
                <!-- 内容区 -->
                <div class="bg-white border rounded-b p-4 flex-1 min-h-[60px]">
                    <slot />
                </div>
            </template>
        </template>

        <!-- 左右 tab 头 -->
        <template v-else>
            <div class="flex h-full">
                <!-- 左侧 tab 头 -->
                <template v-if="tabPosition === 'left'">
                    <div :class="sideHeaderClass">
                        <div class="flex-shrink-0">
                            <slot name="header-before" />
                        </div>
                        <div class="flex-1 overflow-y-auto max-h-[60vh]">
                            <div class="flex flex-col">
                                <template v-for="(pane) in panes" :key="pane.uid">
                                    <div :class="[
                                        'relative px-4 py-2 mb-1 rounded cursor-pointer select-none items-center flex',
                                        pane.uid === activeIndex ? 'bg-white border-l-4 border-blue-500 font-bold text-blue-600' : 'hover:bg-gray-200',
                                    ]" @click="setActive(pane.uid)">
                                        <slot name="tab" :tab="pane" :index="pane.uid" :isActive="pane.uid === activeIndex">
                                            {{ pane.name }}
                                        </slot>
                                        <button v-if="closable" class="ml-2 text-gray-400 hover:text-red-500"
                                            @click.stop="closeTab(pane.uid)" title="关闭">×</button>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="flex-shrink-0 flex flex-col items-center">
                            <button v-if="addable"
                                class="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" @click="addTab"
                                title="新增">+</button>
                            <slot name="header-after" />
                        </div>
                    </div>
                    <div class="bg-white border rounded p-4 flex-1 min-h-[60px]">
                        <slot />
                    </div>
                </template>
                <!-- 右侧 tab 头 -->
                <template v-else>
                    <div class="bg-white border rounded p-4 flex-1 min-h-[60px]">
                        <slot />
                    </div>
                    <div :class="sideHeaderClass">
                        <div class="flex-shrink-0">
                            <slot name="header-before" />
                        </div>
                        <div class="flex-1 overflow-y-auto max-h-[60vh]">
                            <div class="flex flex-col">
                                <template v-for="(pane) in panes" :key="pane.uid">
                                    <div :class="[
                                        'relative px-4 py-2 mr-1 rounded cursor-pointer select-none items-center inline-flex',
                                        pane.uid === activeIndex ? 'bg-white border-b-2 border-blue-500 font-bold text-blue-600' : 'hover:bg-gray-200',
                                    ]" @click="setActive(pane.uid)" :ref="el => tabRefs[pane.uid] = el">
                                        <slot name="tab" :tab="pane" :index="pane.uid" :isActive="pane.uid === activeIndex">
                                            {{ pane.name }}
                                        </slot>
                                        <button v-if="closable" class="ml-2 text-gray-400 hover:text-red-500"
                                            @click.stop="closeTab(pane.uid)" title="关闭">×</button>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="flex-shrink-0 flex flex-col items-center">
                            <button v-if="addable"
                                class="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" @click="addTab"
                                title="新增">+</button>
                            <slot name="header-after" />
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, onMounted, nextTick, watch, defineEmits, watchEffect } from 'vue'

interface TabPaneInfo {
    uid: number;
    name: string;
    closable: boolean;
    checked: boolean;
}


const props = defineProps({
    modelValue: { type: [String, Number], default: '' },
    closable: { type: Boolean, default: true },
    addable: { type: Boolean, default: false },
    tabPosition: {
        type: String,
        default: 'top',
        validator: (v: string) => ['top', 'bottom', 'left', 'right'].includes(v),
    },
})

const emit = defineEmits([
    'add', 'update:modelValue'
])

const panes = ref<TabPaneInfo[]>([])
const tabRefs = ref({})
const tabScroll = ref(null)
const tabList = ref(null)
const activeIndex = ref<number>(0); // 改为number类型，默认0

const isHorizontal = computed(() => props.tabPosition === 'top' || props.tabPosition === 'bottom')
const wrapperClass = computed(() => isHorizontal.value ? 'w-full' : 'w-full h-[400px] flex')
const headerClass = computed(() => {
    if (props.tabPosition === 'bottom') {
        return 'flex items-center bg-gray-100 rounded-b p-2 gap-1 border-t'
    }
    return 'flex items-center bg-gray-100 rounded-t p-2 gap-1 border-b'
})

const sideHeaderClass = computed(() => 
    'flex flex-col items-stretch bg-gray-100 rounded-l p-2 gap-1 border-r min-w-[160px]'
)

const showScroll = ref(false)
watchEffect(() => {
    if (tabList.value && tabScroll.value) {
        showScroll.value = tabList.value.scrollWidth > tabScroll.value.offsetWidth + 1;
    } else {
        showScroll.value = false;
    }
});
// 用 watchEffect 让 showScroll 响应 DOM 变化

// 监听panes变化，当添加新tab时自动滚动到新tab
watch(panes, (newPanes, oldPanes) => {
  if (newPanes.length > oldPanes.length) {
    nextTick(() => {
      const latestTab = newPanes[newPanes.length - 1];
      if (latestTab) {
        activeIndex.value = latestTab.uid;
        nextTick(scrollToActive);
      }
    });
  }
}, { deep: true });

function scrollShow() {
    if (tabList.value && tabScroll.value) {
        showScroll.value = tabList.value.scrollWidth > tabScroll.value.offsetWidth + 1;
    } else {
        showScroll.value = false;
    }
}

function setActive(uid: number) {
    activeIndex.value = uid
    const idx = panes.value.findIndex(tp => tp.uid === uid)
    emit('update:modelValue', panes.value[idx]?.name)
    nextTick(scrollToActive)
}

function closeTab(uid: number) {
  if (panes.value.length <= 1) return;
  const idx = panes.value.findIndex(tp => tp.uid === uid);
  panes.value.splice(idx, 1);
  if (activeIndex.value === uid) {
    // 优先激活前一个tab，否则激活第一个
    if (panes.value.length > 0) {
      activeIndex.value = panes.value[Math.max(0, idx - 1)].uid;
    }
  }
  emit('update:modelValue', panes.value.length > 0 ? panes.value[0].name : '');
  nextTick(scrollToActive);
  scrollShow();
}

function addTab() {
    // 这里可以emit事件让父组件插入新的TabPane
    emit('add')
    // 添加一个延迟，确保父组件有时间添加新的TabPane
    setTimeout(() => {
        if (panes.value.length > 0) {
            const latestTab = panes.value[panes.value.length - 1];
            activeIndex.value = latestTab.uid;
            nextTick(scrollToActive);
        }
    }, 10);
    scrollShow();
}

function scrollTabs(direction) {
    if (!tabScroll.value) return
    const delta = tabScroll.value.offsetWidth * 0.6
    if (direction === 'left') {
        tabScroll.value.scrollBy({ left: -delta, behavior: 'smooth' })
    } else {
        tabScroll.value.scrollBy({ left: delta, behavior: 'smooth' })
    }
}

function scrollToActive() {
    console.log('scrollToActive called', { 
        activeIndex: activeIndex.value, 
        tabRefs: Object.keys(tabRefs.value),
        panes: panes.value.map(p => ({ uid: p.uid, name: p.name }))
    });
    
    if (!tabScroll.value) {
        console.log('scrollToActive: tabScroll is null');
        return;
    }
    
    if (!tabRefs.value[activeIndex.value]) {
        console.log('scrollToActive: tabRef not found for uid', activeIndex.value);
        return;
    }
    
    const tabEl = tabRefs.value[activeIndex.value];
    if (!tabEl) {
        console.log('scrollToActive: tabEl is null');
        return;
    }
    
    const scrollEl = tabScroll.value;
    const tabRect = tabEl.getBoundingClientRect();
    const scrollRect = scrollEl.getBoundingClientRect();
    
    console.log('scrollToActive: rects', { 
        tabRect: { left: tabRect.left, right: tabRect.right },
        scrollRect: { left: scrollRect.left, right: scrollRect.right }
    });
    
    if (tabRect.left < scrollRect.left) {
        const scrollAmount = tabRect.left - scrollRect.left - 16;
        console.log('scrollToActive: scrolling left by', scrollAmount);
        scrollEl.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else if (tabRect.right > scrollRect.right) {
        const scrollAmount = tabRect.right - scrollRect.right + 16;
        console.log('scrollToActive: scrolling right by', scrollAmount);
        scrollEl.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

function registerTabPane(info: TabPaneInfo) {
    if (!panes.value.find(tp => tp.uid === info.uid)) {
        panes.value.push(info);
        // 如果是第一个tab或者设置了checked，设置为active
        if (panes.value.length === 1 || info.checked) {
            activeIndex.value = info.uid; // 使用uid
        }
    }
}

function unregisterTabPane(uid: number) {
    const idx = panes.value.findIndex(tp => tp.uid === uid);
    if (idx !== -1) {
        panes.value.splice(idx, 1);
        if (activeIndex.value === uid) {
            activeIndex.value = panes.value.length > 0 ? panes.value[0].uid : 0; // 使用uid
        }
    }
}

// 在函数定义后提供依赖
provide('registerTabPane', registerTabPane);
provide('unregisterTabPane', unregisterTabPane);
provide('activeTab', activeIndex);

</script>

<style scoped>
/* 针对 Webkit 浏览器优化滚动条宽度 */
::-webkit-scrollbar {
    height: 6px;
    width: 6px;
}

::-webkit-scrollbar-thumb {
    background: #d1d5db;
    /* Tailwind gray-300 */
    border-radius: 4px;
}

::-webkit-scrollbar-track {
    background: #f3f4f6;
    /* Tailwind gray-100 */
}
</style>