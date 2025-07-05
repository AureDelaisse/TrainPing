import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExercisesView from '../views/ExercisesView.vue'
import SessionsView from '../views/SessionsView.vue'
import TrainingView from '../views/TrainingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: ExercisesView
    },
    {
      path: '/exercises/new',
      name: 'exercise-create',
      component: () => import('../views/ExerciseEditorView.vue')
    },
    {
      path: '/exercises/:id/edit',
      name: 'exercise-edit',
      component: () => import('../views/ExerciseEditorView.vue')
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: SessionsView
    },
    {
      path: '/sessions/new',
      name: 'session-create',
      component: () => import('../views/SessionEditorView.vue')
    },
    {
      path: '/sessions/:id/edit',
      name: 'session-edit',
      component: () => import('../views/SessionEditorView.vue')
    },
    {
      path: '/training/:sessionId',
      name: 'training',
      component: TrainingView
    }
  ]
})

export default router