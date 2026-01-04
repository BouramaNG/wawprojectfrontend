<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="lg:pl-64">
      <Header />
      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
/* Styles globaux pour animations fluides */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import { RouterView } from 'vue-router'
</script>

