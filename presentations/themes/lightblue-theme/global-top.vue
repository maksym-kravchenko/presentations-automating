<template>
  <div v-if="!$slidev.nav.currentLayout.includes('cover')" class="slide-header">
    <span class="logo">{{ $slidev.configs.title }}</span>
    <span class="logo">{{ $slidev.configs.company }}</span>
  </div>
</template>