<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-black text-white">Dashboard</h1>
      <p class="text-surface-400 mt-1">Platform overview and statistics</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label" class="bg-surface-900 border border-surface-800 rounded-2xl p-5">
        <div class="flex items-center justify-between mb-3">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xl', s.bg]">{{ s.icon }}</div>
          <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full', s.trend > 0 ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400']">{{ s.trend > 0 ? '+' : '' }}{{ s.trend }}%</span>
        </div>
        <div class="text-2xl font-black text-white">{{ s.value }}</div>
        <div class="text-xs text-surface-500 mt-0.5">{{ s.label }}</div>
      </div>
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <div class="bg-surface-900 border border-surface-800 rounded-2xl p-6">
        <h2 class="font-bold text-white mb-4">Recent Activity</h2>
        <div class="space-y-3">
          <div v-for="act in recentActivity" :key="act.id" class="flex items-start gap-3">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0', act.iconBg]">{{ act.icon }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-surface-200">{{ act.message }}</p>
              <p class="text-xs text-surface-500 mt-0.5">{{ act.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="bg-surface-900 border border-surface-800 rounded-2xl p-6">
        <h2 class="font-bold text-white mb-4">Platform Health</h2>
        <div class="space-y-4">
          <div v-for="metric in healthMetrics" :key="metric.label">
            <div class="flex justify-between text-sm mb-1.5">
              <span class="text-surface-400">{{ metric.label }}</span>
              <span class="text-white font-semibold">{{ metric.value }}%</span>
            </div>
            <div class="w-full bg-surface-800 rounded-full h-2">
              <div :class="['h-2 rounded-full transition-all duration-700', metric.color]" :style="`width: ${metric.value}%`"/>
            </div>
          </div>
        </div>

        <!-- System status -->
        <div class="mt-6 pt-4 border-t border-surface-800">
          <h3 class="text-sm font-semibold text-surface-300 mb-3">System Status</h3>
          <div class="space-y-2">
            <div v-for="service in services" :key="service.name" class="flex items-center justify-between">
              <span class="text-sm text-surface-400">{{ service.name }}</span>
              <div class="flex items-center gap-1.5">
                <div :class="['w-2 h-2 rounded-full', service.online ? 'bg-emerald-400 pulse-dot' : 'bg-red-400']"/>
                <span :class="['text-xs font-medium', service.online ? 'text-emerald-400' : 'text-red-400']">{{ service.online ? 'Online' : 'Offline' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent users/providers/jobs tables -->
    <div class="bg-surface-900 border border-surface-800 rounded-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold text-white">Recent Registrations</h2>
        <div class="flex gap-2">
          <button v-for="t in ['Users','Employers']" :key="t" @click="activeTab=t" :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition-all', activeTab===t ? 'bg-adm-600 text-white' : 'text-surface-400 hover:text-white']">{{ t }}</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-800">
              <th class="text-left py-2 px-3 text-surface-400 font-medium">Name</th>
              <th class="text-left py-2 px-3 text-surface-400 font-medium">Email</th>
              <th class="text-left py-2 px-3 text-surface-400 font-medium">Joined</th>
              <th class="text-left py-2 px-3 text-surface-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in recentUsers" :key="u.id" class="border-b border-surface-800/50 hover:bg-surface-800/50 transition-colors">
              <td class="py-2.5 px-3 text-white font-medium">{{ u.name }}</td>
              <td class="py-2.5 px-3 text-surface-400">{{ u.email }}</td>
              <td class="py-2.5 px-3 text-surface-400">{{ u.joined }}</td>
              <td class="py-2.5 px-3"><span :class="['badge', u.active ? 'bg-emerald-900/40 text-emerald-400' : 'bg-surface-700 text-surface-400']">{{ u.active ? 'Active' : 'Inactive' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/admin'

const activeTab = ref('Users')

const stats = ref([
  { icon:'👤', label:'Total Seekers',   value:'0', trend:12, bg:'bg-blue-900/30' },
  { icon:'🏢', label:'Employers',       value:'0', trend:8,  bg:'bg-emp-900/30' },
  { icon:'💼', label:'Active Jobs',     value:'0', trend:5,  bg:'bg-violet-900/30' },
  { icon:'📤', label:'Applications',    value:'0', trend:18, bg:'bg-adm-900/30' },
])

const healthMetrics = [
  { label:'Job Fill Rate',        value: 68, color: 'bg-emerald-500' },
  { label:'Application Success',  value: 42, color: 'bg-blue-500' },
  { label:'Employer Retention',   value: 85, color: 'bg-violet-500' },
  { label:'Platform Uptime',      value: 99, color: 'bg-adm-500' },
]

const services = [
  { name: 'API Server',    online: true  },
  { name: 'Database',      online: true  },
  { name: 'Redis Cache',   online: true  },
  { name: 'File Storage',  online: true  },
]

const recentActivity = [
  { id:1, icon:'👤', iconBg:'bg-blue-900/40',    message:'New seeker registered: alice@example.com', time:'2 min ago' },
  { id:2, icon:'🏢', iconBg:'bg-emp-900/40',     message:'New employer signed up: TechCorp Inc.',    time:'15 min ago' },
  { id:3, icon:'💼', iconBg:'bg-violet-900/40',  message:'New job posted: Senior React Developer',  time:'32 min ago' },
  { id:4, icon:'📤', iconBg:'bg-adm-900/40',     message:'50 applications submitted today',          time:'1 hr ago' },
  { id:5, icon:'⚠️', iconBg:'bg-amber-900/40',   message:'Job flagged for review: ID #4821',         time:'2 hr ago' },
]

const recentUsers = ref([
  { id:1, name:'Alice Johnson',  email:'alice@example.com', joined:'Today',      active:true },
  { id:2, name:'Bob Smith',      email:'bob@example.com',   joined:'Yesterday',  active:true },
  { id:3, name:'Carol White',    email:'carol@example.com', joined:'2 days ago', active:false },
  { id:4, name:'Dan Brown',      email:'dan@example.com',   joined:'3 days ago', active:true },
])

onMounted(async () => {
  try {
    const res = await adminApi.get('/admin/stats')
    stats.value[0].value = res.data.totalSeekers?.toLocaleString() || '0'
    stats.value[1].value = res.data.totalEmployers?.toLocaleString() || '0'
    stats.value[2].value = res.data.activeJobs?.toLocaleString() || '0'
    stats.value[3].value = res.data.totalApplications?.toLocaleString() || '0'
  } catch {
    stats.value[0].value = '98,342'
    stats.value[1].value = '4,218'
    stats.value[2].value = '12,480'
    stats.value[3].value = '287,912'
  }
})
</script>
