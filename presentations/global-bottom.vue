<template>
  <div v-if="$slidev.nav.currentPage > 1" class="pagination">
    <SlideCurrentNo /> / <SlideTotalNo />
  </div>
</template>

<style scoped>
.pagination {
  position: fixed;
  bottom: 1.2rem;
  right: 1.5rem;
  font-size: 0.78rem;
  color: #818CF8;
  opacity: 0.7;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  letter-spacing: 0.05em;
}
</style>