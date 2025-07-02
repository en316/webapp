<script setup lang="ts">
import { ref, nextTick, defineProps, defineComponent, h } from 'vue'

interface Message {
  id: number
  type: 'text' | 'image' | 'emoji' | 'file' | 'link'
  content: string
  sender: 'me' | 'other'
  avatar: string
  nickname: string
  timestamp: number
  fileName?: string
  fileUrl?: string
}

const me = {
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  nickname: '我',
}
const other = {
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  nickname: '小明',
}

const messages = ref<Message[]>([
  { id: 1, type: 'text', content: '你好！', sender: 'other', avatar: other.avatar, nickname: other.nickname, timestamp: Date.now() - 60000 },
  { id: 2, type: 'emoji', content: '😄', sender: 'me', avatar: me.avatar, nickname: me.nickname, timestamp: Date.now() - 59000 },
  { id: 3, type: 'image', content: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&h=256', sender: 'other', avatar: other.avatar, nickname: other.nickname, timestamp: Date.now() - 58000 },
  { id: 4, type: 'link', content: 'https://daisyui.com', sender: 'me', avatar: me.avatar, nickname: me.nickname, timestamp: Date.now() - 57000 },
  { id: 5, type: 'file', content: '', sender: 'other', avatar: other.avatar, nickname: other.nickname, timestamp: Date.now() - 56000, fileName: '文档.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 6, type: 'text', content: '请查收文件', sender: 'other', avatar: other.avatar, nickname: other.nickname, timestamp: Date.now() - 55000 },
])

const input = ref('')
const chatListRef = ref<HTMLElement | null>(null)

const sendMessage = () => {
  if (!input.value.trim()) return
  messages.value.push({
    id: Date.now(),
    type: 'text',
    content: input.value,
    sender: 'me',
    avatar: me.avatar,
    nickname: me.nickname,
    timestamp: Date.now(),
  })
  input.value = ''
  nextTick(() => {
    if (chatListRef.value) {
      chatListRef.value.scrollTop = chatListRef.value.scrollHeight
    }
  })
}

// 自动滚动到底部
nextTick(() => {
  if (chatListRef.value) {
    chatListRef.value.scrollTop = chatListRef.value.scrollHeight
  }
})

// MessageContent 组件
const MessageContent = defineComponent({
  name: 'MessageContent',
  props: {
    msg: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    return () => {
      const msg = props.msg as Message
      if (msg.type === 'text') {
        return msg.content
      } else if (msg.type === 'emoji') {
        return h('span', { style: 'font-size:1.5em;' }, msg.content)
      } else if (msg.type === 'image') {
        return h('img', { src: msg.content, alt: '图片', class: 'rounded max-w-[120px] max-h-[120px]' })
      } else if (msg.type === 'file') {
        return h('a', { href: msg.fileUrl, target: '_blank', class: 'link link-primary' }, [
          h('i', { class: 'fa fa-paperclip mr-1' }),
          msg.fileName
        ])
      } else if (msg.type === 'link') {
        return h('a', { href: msg.content, target: '_blank', class: 'link link-info' }, msg.content)
      }
      return null
    }
  }
})

// 表情面板相关
const showEmojiPanel = ref(false)
const emojis = ['😀','😄','😂','😍','😎','😭','👍','🎉','🥳','😡','😱','🤔','🙌']
const selectEmoji = (emoji: string) => {
  input.value += emoji
  showEmojiPanel.value = false
}

// 图片/文件上传
const onImageChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    const url = URL.createObjectURL(files[0])
    messages.value.push({
      id: Date.now(),
      type: 'image',
      content: url,
      sender: 'me',
      avatar: me.avatar,
      nickname: me.nickname,
      timestamp: Date.now(),
    })
    nextTick(() => {
      if (chatListRef.value) chatListRef.value.scrollTop = chatListRef.value.scrollHeight
    })
  }
}
const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    messages.value.push({
      id: Date.now(),
      type: 'file',
      content: '',
      sender: 'me',
      avatar: me.avatar,
      nickname: me.nickname,
      timestamp: Date.now(),
      fileName: files[0].name,
      fileUrl: '', // 可扩展为上传后真实URL
    })
    nextTick(() => {
      if (chatListRef.value) chatListRef.value.scrollTop = chatListRef.value.scrollHeight
    })
  }
}
</script>

<template>
  <div class="h-screen flex flex-col bg-base-200">
    <div class="navbar bg-base-100 shadow-sm border-b border-base-300">
      <div class="navbar-start">
        <div class="text-lg font-bold ml-2">聊天</div>
      </div>
    </div>
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 聊天历史 -->
      <div ref="chatListRef" class="flex-1 overflow-y-auto p-4 space-y-4">
        <div v-for="msg in messages" :key="msg.id" class="flex items-end" :class="msg.sender === 'me' ? 'justify-end' : 'justify-start'">
          <div class="flex items-end gap-2" :class="msg.sender === 'me' ? 'flex-row-reverse' : ''">
            <img :src="msg.avatar" class="w-8 h-8 rounded-full border border-base-300" :alt="msg.nickname" />
            <div>
              <div class="flex items-center gap-2 mb-1" :class="msg.sender === 'me' ? 'justify-end' : ''">
                <span class="text-xs font-semibold text-base-content/80">{{ msg.nickname }}</span>
                <span class="text-xs text-base-content/50">{{ new Date(msg.timestamp).toLocaleTimeString() }}</span>
              </div>
              <div :class="msg.sender === 'me' ? 'chat chat-end' : 'chat chat-start'">
                <div :class="msg.sender === 'me' ? 'chat-bubble bg-primary text-primary-content' : 'chat-bubble bg-base-300'">
                  <component :is="MessageContent" :msg="msg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 输入区 -->
      <form class="bg-base-100 border-t border-base-300 p-3 flex gap-2 items-end relative" @submit.prevent="sendMessage">
        <!-- 表情 -->
        <div class="relative">
          <button type="button" class="btn btn-ghost btn-square" @click="showEmojiPanel = !showEmojiPanel">
            <span class="text-xl">😊</span>
          </button>
          <div v-if="showEmojiPanel" class="absolute bottom-12 left-0 z-10 bg-base-100 border border-base-300 rounded shadow p-2 grid grid-cols-6 gap-1">
            <button v-for="emoji in emojis" :key="emoji" class="btn btn-ghost btn-xs text-lg" type="button" @click="selectEmoji(emoji)">{{ emoji }}</button>
          </div>
        </div>
        <!-- 图片上传 -->
        <label class="btn btn-ghost btn-square">
          <input type="file" accept="image/*" class="hidden" @change="onImageChange" />
          <span class="text-xl">🖼️</span>
        </label>
        <!-- 文件上传 -->
        <label class="btn btn-ghost btn-square">
          <input type="file" class="hidden" @change="onFileChange" />
          <span class="text-xl">📎</span>
        </label>
        <input v-model="input" type="text" class="input input-bordered flex-1" placeholder="输入消息..." />
        <button class="btn btn-primary" type="submit">发送</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.chat-bubble {
  word-break: break-all;
}
</style> 