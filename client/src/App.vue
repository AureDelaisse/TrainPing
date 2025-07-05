<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header simple -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">TT</span>
            </div>
            <h1 class="ml-3 text-xl font-semibold text-gray-900">TrainPing</h1>
          </div>
          
          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <router-link to="/" class="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Accueil
            </router-link>
            <router-link to="/exercises" class="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Exercices
            </router-link>
            <router-link to="/sessions" class="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Sessions
            </router-link>
          </nav>
          
          <!-- Menu mobile -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Menu mobile -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link to="/" class="block px-3 py-2 text-base font-medium text-gray-900">Accueil</router-link>
          <router-link to="/exercises" class="block px-3 py-2 text-base font-medium text-gray-500">Exercices</router-link>
          <router-link to="/sessions" class="block px-3 py-2 text-base font-medium text-gray-500">Sessions</router-link>
        </div>
      </div>
    </header>
    
    <!-- Contenu -->
    <main class="pt-0">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
</script>