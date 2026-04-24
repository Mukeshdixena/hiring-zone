<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-black text-white">Role Management</h1>
      <p class="text-surface-400 mt-1">Assign and manage user roles and permissions</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Roles list -->
      <div class="bg-surface-900 border border-surface-800 rounded-2xl p-6">
        <h2 class="font-bold text-white mb-4">System Roles</h2>
        <div class="space-y-3">
          <div v-for="role in roles" :key="role.name" class="flex items-start gap-4 p-4 rounded-xl bg-surface-800/50 border border-surface-700/50">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', role.bg]">{{ role.icon }}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-bold text-white">{{ role.name }}</h3>
                <span class="badge bg-surface-700 text-surface-300">{{ role.count }} users</span>
              </div>
              <p class="text-xs text-surface-400 mb-2">{{ role.desc }}</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="perm in role.permissions" :key="perm" class="text-xs bg-adm-900/30 border border-adm-800/50 text-adm-400 px-2 py-0.5 rounded-full">{{ perm }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Assign role -->
      <div class="bg-surface-900 border border-surface-800 rounded-2xl p-6">
        <h2 class="font-bold text-white mb-4">Assign Role to User</h2>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-surface-300 mb-1.5 block">User Email</label>
            <input id="role-user-email" v-model="roleForm.email" type="email" placeholder="user@example.com" class="w-full rounded-xl border border-surface-700 bg-surface-800 text-white placeholder-surface-500 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-adm-500/40"/>
          </div>
          <div>
            <label class="text-sm font-medium text-surface-300 mb-1.5 block">Role</label>
            <select id="role-select" v-model="roleForm.role" class="w-full rounded-xl border border-surface-700 bg-surface-800 text-surface-200 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-adm-500/40">
              <option value="">Select role…</option>
              <option value="ROLE_SEEKER">Job Seeker</option>
              <option value="ROLE_EMPLOYER">Employer</option>
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_MODERATOR">Moderator</option>
            </select>
          </div>
          <button @click="assignRole" id="assign-role-btn" :disabled="assigning" class="w-full inline-flex items-center justify-center gap-2 font-bold rounded-xl px-5 py-2.5 text-sm bg-adm-600 hover:bg-adm-700 text-white transition-all active:scale-95 disabled:opacity-60">
            <svg v-if="assigning" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            {{ assigning ? 'Assigning…' : 'Assign Role' }}
          </button>
        </div>

        <!-- Revoke role -->
        <div class="mt-6 pt-6 border-t border-surface-800">
          <h3 class="font-semibold text-white mb-4">Recent Role Changes</h3>
          <div class="space-y-2">
            <div v-for="log in roleLog" :key="log.id" class="flex items-center gap-3 text-sm">
              <div class="w-2 h-2 rounded-full bg-adm-400 flex-shrink-0"/>
              <span class="text-surface-300 flex-1">{{ log.message }}</span>
              <span class="text-surface-500 text-xs">{{ log.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { adminApi } from '@/api/admin'
import { useToastStore } from '@/stores/toast'

const toast    = useToastStore()
const assigning = ref(false)
const roleForm = ref({ email: '', role: '' })

const roles = [
  { name:'Job Seeker', icon:'👤', bg:'bg-blue-900/40', count:98342, desc:'Standard job seekers. Can browse, apply, and track applications.', permissions:['browse_jobs','apply','save_jobs','view_applications'] },
  { name:'Employer',   icon:'🏢', bg:'bg-emp-900/40',  count:4218,  desc:'Employer accounts. Can post jobs and manage applicants.', permissions:['post_jobs','manage_jobs','view_applicants','update_status'] },
  { name:'Moderator',  icon:'🛡️', bg:'bg-amber-900/40', count:12,   desc:'Platform moderators. Can flag and review job content.', permissions:['flag_jobs','review_content','view_reports'] },
  { name:'Admin',      icon:'⚡', bg:'bg-adm-900/40',  count:3,     desc:'Full platform access with all administrative capabilities.', permissions:['all_permissions','manage_users','manage_roles','system_settings'] },
]

const roleLog = ref([
  { id:1, message:'ROLE_MODERATOR assigned to dana@example.com', time:'2h ago' },
  { id:2, message:'ROLE_EMPLOYER revoked from spammer@fake.com', time:'5h ago' },
  { id:3, message:'ROLE_ADMIN granted to newadmin@hq.com', time:'1d ago' },
])

async function assignRole() {
  if (!roleForm.value.email || !roleForm.value.role) { useToastStore().error('Fill in both fields'); return }
  assigning.value = true
  try {
    await adminApi.post('/admin/roles/assign', roleForm.value)
    toast.success(`Role ${roleForm.value.role} assigned to ${roleForm.value.email}`)
    roleLog.value.unshift({ id: Date.now(), message: `${roleForm.value.role} assigned to ${roleForm.value.email}`, time: 'just now' })
    roleForm.value = { email: '', role: '' }
  } catch { toast.error('Failed to assign role') }
  finally   { assigning.value = false }
}
</script>
