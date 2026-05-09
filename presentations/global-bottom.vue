<template>
  <div v-if="$slidev.nav.currentPage > 1" class="slide-footer">
    <span>{{ $slidev.configs.company }}</span>
    <span>{{ $slidev.configs.date }}</span>
    <span>
      <SlideCurrentNo /> / <SlideTotalNo />
    </span>
  </div>
</template>