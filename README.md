# HiringZone Frontend

Vue 3 + Vite single-page application powering three isolated job-portal platforms (Seeker, Employer, Admin).

## Tech Stack

- Vue 3 (Composition API + `<script setup>`)
- Vite 6
- Pinia (state management)
- Vue Router 4
- Axios
- Tailwind CSS v4

## Getting Started

```bash
npm install
npm run dev        # dev server on :5173
npm run build      # production build → dist/
npm run preview    # preview production build
```

## Environment Variables

Create `.env.local` (git-ignored) to override defaults:

```env
VITE_API_URL=https://hiring-zone-backend.onrender.com/api
```

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `https://hiring-zone-backend.onrender.com/api` | Backend API base URL |

## Project Structure

```
src/
├── api/
│   ├── seeker.js        # Axios client — seeker + public endpoints
│   ├── employer.js      # Axios client — employer endpoints
│   └── admin.js         # Axios client — admin endpoints
├── stores/
│   ├── seekerAuth.js    # Seeker JWT + user state (Pinia)
│   ├── employerAuth.js  # Employer JWT + user state
│   ├── adminAuth.js     # Admin JWT + user state
│   └── toast.js         # Toast notification queue
├── router/index.js      # Routes + per-platform auth guards
├── layouts/             # SeekerLayout, EmployerLayout, AdminLayout
├── pages/
│   ├── seeker/          # Landing, Login, Register, Jobs, JobDetail, Dashboard, ApplicationTracker, Profile
│   ├── employer/        # Landing, Login, Register, Dashboard, PostJob, ManageJobs, Applicants
│   └── admin/           # Login, Dashboard, Users, Providers, Jobs, Roles, Announcements
└── components/
    ├── shared/          # Button, Input, ToastContainer, Skeleton
    └── seeker/          # JobCard
```

## Platform Details

| Platform | Base path | Accent color |
|----------|-----------|--------------|
| Seeker | `/` | Blue `#2563eb` |
| Employer | `/employers` | Green `#059669` |
| Admin | `/admin` | Purple `#7c3aed` |

Each platform stores its own JWT in `localStorage`:

| Platform | Token key | User key |
|----------|-----------|----------|
| Seeker | `seeker_token` | `seeker_user` |
| Employer | `employer_token` | `employer_user` |
| Admin | `admin_token` | `admin_user` |

For production, run `npm run build` and serve the `dist/` folder with nginx or a static host.

For GitHub Pages deploys, build with the deployed backend API URL:

```bash
$env:VITE_API_URL="https://hiring-zone-backend.onrender.com/api"
npm run deploy
```
