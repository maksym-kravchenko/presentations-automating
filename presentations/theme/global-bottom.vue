<template>
  <div v-if="!$slidev.nav.currentLayout.includes('cover')" class="slide-footer">
    <span>{{ $slidev.configs.author }} · {{ $slidev.configs.date }}</span>
    <span class="page-number">{{ $slidev.nav.currentPage }} / {{ $slidev.nav.total }}</span>
  </div>
</template>