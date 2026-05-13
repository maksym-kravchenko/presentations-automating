<template>
  <div v-if="!$slidev.nav.currentLayout.includes('cover')" class="slide-header">
    <span class="logo">{{ $slidev.configs.company ?? $slidev.configs.title }}</span>
    <span>{{ $slidev.configs.subject ?? $slidev.configs.title }}</span>
  </div>
</template>