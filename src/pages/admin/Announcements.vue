<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-black text-white">Announcements</h1>
      <p class="text-surface-400 mt-1">Send platform-wide or role-targeted messages</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Compose -->
      <div class="bg-surface-900 border border-surface-800 rounded-2xl p-6">
        <h2 class="font-bold text-white mb-4">Send Announcement</h2>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-surface-300 mb-1.5 block">Title</label>
            <input id="ann-title" v-model="form.title" type="text" placeholder="Announcement title…" class="w-full rounded-xl border border-surface-700 bg-surface-800 text-white placeholder-surface-500 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-adm-500/40"/>
          </div>
          <div>
            <label class="text-sm font-medium text-surface-300 mb-1.5 block">Message</label>
            <textarea id="ann-message" v-model="form.message" rows="5" placeholder="Write your announcement here…" class="w-full rounded-xl border border-surface-700 bg-surface-800 text-white placeholder-surface-500 text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-adm-500/40 resize-none"/>
          </div>
          <div>
            <label class="text-sm font-medium text-surface-300 mb-1.5 block">Target Audience</label>
            <select id="ann-target" v-model="form.target" class="w-full rounded-xl border border-surface-700 bg-surface-800 text-surface-200 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-adm-500/40">
              <option value="ALL">All Users</option>
              <option value="SEEKERS">Job Seekers Only</option>
              <option value="EMPLOYERS">Employers Only</option>
              <option value="ADMINS">Admins Only</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium text-surface-300 mb-1.5 block">Type</label>
            <div class="flex gap-3">
              <label v-for="t in ['info','warning','success']" :key="t" class="flex items-center gap-2 cursor-pointer">
                <input type="radio" :id="`ann-type-${t}`" v-model="form.type" :value="t" class="text-adm-600"/>
                <span :class="['text-sm capitalize', typeColors[t]]">{{ t }}</span>
              </label>
            </div>
          </div>

          <div v-if="error" class="rounded-xl bg-red-900/30 border border-red-700 px-4 py-3 text-sm text-red-400">{{ error }}</div>
          <button @click="send" id="send-announcement-btn" :disabled="sending" class="w-full inline-flex items-center justify-center gap-2 font-bold rounded-xl px-5 py-2.5 text-sm bg-adm-600 hover:bg-adm-700 text-white transition-all active:scale-95 disabled:opacity-60">
            <svg v-if="sending" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            {{ sending ? 'Sending…' : '📢 Send Announcement' }}
          </button>
        </div>
      </div>

      <!-- History -->
      <div class="bg-surface-900 border border-surface-800 rounded-2xl p-6">
        <h2 class="font-bold text-white mb-4">Announcement History</h2>
        <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          <div v-for="ann in announcements" :key="ann.id" :class="['p-4 rounded-xl border', typeBg[ann.type]]">
            <div class="flex items-start justify-between gap-2 mb-1">
              <h3 class="font-bold text-white text-sm">{{ ann.title }}</h3>
              <span class="text-xs text-surface-500 flex-shrink-0">{{ ann.sentAt }}</span>
            </div>
            <p class="text-xs text-surface-300 leading-relaxed mb-2">{{ ann.message }}</p>
            <div class="flex items-center gap-2">
              <span :class="['badge text-xs', targetBadge[ann.target]]">{{ ann.target }}</span>
              <span class="text-xs text-surface-500">{{ ann.sentBy }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/admin'
import { useToastStore } from '@/stores/toast'

const toast       = useToastStore()
const sending     = ref(false); const error = ref('')
const announcements = ref([])
const form = ref({ title:'', message:'', target:'ALL', type:'info' })

const typeColors = { info:'text-blue-400', warning:'text-amber-400', success:'text-emerald-400' }
const typeBg     = { info:'bg-blue-900/20 border-blue-800/50', warning:'bg-amber-900/20 border-amber-800/50', success:'bg-emerald-900/20 border-emerald-800/50' }
const targetBadge = { ALL:'bg-surface-700 text-surface-300', SEEKERS:'bg-blue-900/40 text-blue-400', EMPLOYERS:'bg-emp-900/40 text-emp-400', ADMINS:'bg-adm-900/40 text-adm-400' }

async function send() {
  error.value = ''
  if (!form.value.title || !form.value.message) { error.value = 'Title and message are required'; return }
  sending.value = true
  try {
    await adminApi.post('/admin/announcements', form.value)
    toast.success('Announcement sent!')
    announcements.value.unshift({ id: Date.now(), ...form.value, sentAt: 'just now', sentBy: 'Super Admin' })
    form.value = { title:'', message:'', target:'ALL', type:'info' }
  } catch { error.value = 'Failed to send announcement' }
  finally   { sending.value = false }
}

onMounted(async () => {
  try {
    const res = await adminApi.get('/admin/announcements')
    announcements.value = res.data.content || res.data || []
  } catch {
    announcements.value = [
      { id:1, title:'Platform Maintenance', message:'Scheduled maintenance on Sunday 2-4 AM UTC. Brief downtime expected.', target:'ALL', type:'warning', sentAt:'2h ago', sentBy:'Admin' },
      { id:2, title:'New Feature: Resume Parsing', message:'We\'ve added AI-powered resume parsing for all job seekers.', target:'SEEKERS', type:'info', sentAt:'1d ago', sentBy:'Admin' },
      { id:3, title:'Free Plan Extended', message:'All employer free plan limits have been increased this month.', target:'EMPLOYERS', type:'success', sentAt:'3d ago', sentBy:'Admin' },
    ]
  }
})
</script>
