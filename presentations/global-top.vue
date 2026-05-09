<template>
  <div v-if="$slidev.nav.currentPage > 1" class="slide-header">
    <span>{{ $slidev.configs.subject }}</span>
    <span>{{ $slidev.configs.author }}</span>
  </div>
</template>