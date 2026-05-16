import { createRouter, createWebHistory } from 'vue-router'
import { useSeekerAuthStore } from '@/stores/seekerAuth'
import { useEmployerAuthStore } from '@/stores/employerAuth'
import { useAdminAuthStore } from '@/stores/adminAuth'

// ── Seeker (/) ──────────────────────────────────────────────────────────────
const SeekerLayout     = () => import('@/layouts/SeekerLayout.vue')
const SeekerLanding    = () => import('@/pages/seeker/Landing.vue')
const SeekerJobs       = () => import('@/pages/seeker/Jobs.vue')
const SeekerJobDetail  = () => import('@/pages/seeker/JobDetail.vue')
const SeekerLogin      = () => import('@/pages/seeker/Login.vue')
const SeekerRegister   = () => import('@/pages/seeker/Register.vue')
const SeekerDashboard  = () => import('@/pages/seeker/Dashboard.vue')
const SeekerTracker    = () => import('@/pages/seeker/ApplicationTracker.vue')
const SeekerProfile    = () => import('@/pages/seeker/Profile.vue')

// ── Employer (/employers) ───────────────────────────────────────────────────
const EmployerLayout   = () => import('@/layouts/EmployerLayout.vue')
const EmployerLanding  = () => import('@/pages/employer/Landing.vue')
const EmployerLogin    = () => import('@/pages/employer/Login.vue')
const EmployerRegister = () => import('@/pages/employer/Register.vue')
const EmployerDash     = () => import('@/pages/employer/Dashboard.vue')
const EmployerPostJob  = () => import('@/pages/employer/PostJob.vue')
const EmployerJobs     = () => import('@/pages/employer/ManageJobs.vue')
const EmployerApps     = () => import('@/pages/employer/Applicants.vue')

// ── Admin (/admin) ──────────────────────────────────────────────────────────
const AdminLayout      = () => import('@/layouts/AdminLayout.vue')
const AdminLogin       = () => import('@/pages/admin/Login.vue')
const AdminDashboard   = () => import('@/pages/admin/Dashboard.vue')
const AdminUsers       = () => import('@/pages/admin/Users.vue')
const AdminProviders   = () => import('@/pages/admin/Providers.vue')
const AdminRoles       = () => import('@/pages/admin/Roles.vue')
const AdminJobs        = () => import('@/pages/admin/Jobs.vue')
const AdminAnnounce    = () => import('@/pages/admin/Announcements.vue')

// ── 404 ─────────────────────────────────────────────────────────────────────
const NotFound         = () => import('@/pages/NotFound.vue')

const routes = [
  // ── SEEKER PLATFORM ─────────────────────────────────────────────────────
  {
    path: '/',
    component: SeekerLayout,
    children: [
      { path: '',        name: 'seeker-landing',   component: SeekerLanding },
      { path: 'jobs',    name: 'seeker-jobs',      component: SeekerJobs },
      { path: 'jobs/:id', name: 'seeker-job-detail', component: SeekerJobDetail },
      { path: 'login',   name: 'seeker-login',     component: SeekerLogin },
      { path: 'register', name: 'seeker-register', component: SeekerRegister },
      {
        path: 'dashboard',
        name: 'seeker-dashboard',
        component: SeekerDashboard,
        meta: { requiresAuth: 'seeker' },
      },
      {
        path: 'applications',
        name: 'seeker-tracker',
        component: SeekerTracker,
        meta: { requiresAuth: 'seeker' },
      },
      {
        path: 'profile',
        name: 'seeker-profile',
        component: SeekerProfile,
        meta: { requiresAuth: 'seeker' },
      },
    ],
  },

  // ── EMPLOYER PLATFORM ───────────────────────────────────────────────────
  {
    path: '/employers',
    component: EmployerLayout,
    children: [
      { path: '',          name: 'employer-landing',  component: EmployerLanding },
      { path: 'login',     name: 'employer-login',    component: EmployerLogin },
      { path: 'register',  name: 'employer-register', component: EmployerRegister },
      {
        path: 'dashboard',
        name: 'employer-dashboard',
        component: EmployerDash,
        meta: { requiresAuth: 'employer' },
      },
      {
        path: 'post-job',
        name: 'employer-post-job',
        component: EmployerPostJob,
        meta: { requiresAuth: 'employer' },
      },
      {
        path: 'jobs',
        name: 'employer-jobs',
        component: EmployerJobs,
        meta: { requiresAuth: 'employer' },
      },
      {
        path: 'jobs/:id/applicants',
        name: 'employer-applicants',
        component: EmployerApps,
        meta: { requiresAuth: 'employer' },
      },
    ],
  },

  // ── ADMIN PLATFORM ──────────────────────────────────────────────────────
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'login', name: 'admin-login', component: AdminLogin },
      {
        path: '',
        name: 'admin-dashboard',
        component: AdminDashboard,
        meta: { requiresAuth: 'admin' },
      },
      {
        path: 'users',
        name: 'admin-users',
        component: AdminUsers,
        meta: { requiresAuth: 'admin' },
      },
      {
        path: 'providers',
        name: 'admin-providers',
        component: AdminProviders,
        meta: { requiresAuth: 'admin' },
      },
      {
        path: 'roles',
        name: 'admin-roles',
        component: AdminRoles,
        meta: { requiresAuth: 'admin' },
      },
      {
        path: 'jobs',
        name: 'admin-jobs',
        component: AdminJobs,
        meta: { requiresAuth: 'admin' },
      },
      {
        path: 'announcements',
        name: 'admin-announcements',
        component: AdminAnnounce,
        meta: { requiresAuth: 'admin' },
      },
    ],
  },

  // ── 404 ────────────────────────────────────────────────────────────────
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

// ── Navigation Guards ────────────────────────────────────────────────────────
router.beforeEach((to, from, next) => {
  const seekerAuth   = useSeekerAuthStore()
  const employerAuth = useEmployerAuthStore()
  const adminAuth    = useAdminAuthStore()

  if (to.meta.requiresAuth === 'seeker') {
    if (!seekerAuth.isAuthenticated) return next({ name: 'seeker-login', query: { redirect: to.fullPath } })
  }
  if (to.meta.requiresAuth === 'employer') {
    if (!employerAuth.isAuthenticated) return next({ name: 'employer-login', query: { redirect: to.fullPath } })
  }
  if (to.meta.requiresAuth === 'admin') {
    if (!adminAuth.isAuthenticated) return next({ name: 'admin-login' })
  }
  next()
})

export default router
