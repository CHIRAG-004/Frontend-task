<template>
  <div class="relative overflow-hidden" v-if="props.reviews.length">
    <!-- Slider Container -->
    <div ref="slider" class="flex mx-10 items-center transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(${translateX}px)` }">
      <!-- Review Cards -->
      <ReviewCard v-for="(review, index) in reviews" :key="index" :review="review" :type="'consumer'"
        class="w-64 sm:w-72 md:w-80 lg:w-96 flex-shrink-0 mx-2" />
    </div>

    <!-- Navigation Buttons -->
    <button @click="prevSlide"
      class="absolute left-0 top-1/2 -translate-y-1/2 flex justify-center items-center size-10 sm:size-12 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700">
      <Icon name="simple-line-icons:arrow-left"></Icon>
    </button>
    <button @click="nextSlide"
      class="absolute right-0 top-1/2 -translate-y-1/2 flex justify-center items-center size-10 sm:size-12 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700">
      <Icon name="simple-line-icons:arrow-right"></Icon>
    </button>
  </div>
  <div v-else class="text-text-500 font-bold text-3xl">No Reviews</div>
</template>

<script setup lang="ts">
import type { ReviewAndRating } from '~/services/dataBase/schema/schemaTypes';

const props = defineProps<{
  reviews: ReviewAndRating[]
}>();


const slider = ref<HTMLElement | null>(null);
const translateX = ref(0);
const cardWidth = ref(0); 
const gap = 16; 


const calculateCardWidth = () => {
  if (window.innerWidth < 640) {
    cardWidth.value = 256;
  } else if (window.innerWidth < 768) {
    cardWidth.value = 288; 
  } else if (window.innerWidth < 1024) {
    cardWidth.value = 320; 
  } else {
    cardWidth.value = 384; 
  }
};


onMounted(() => {
  calculateCardWidth();
  window.addEventListener('resize', calculateCardWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', calculateCardWidth);
});

const nextSlide = () => {
  const maxScroll = -(props.reviews.length - 1) * (cardWidth.value + gap);
  if (translateX.value > maxScroll) {
    translateX.value -= cardWidth.value + gap;
  }
};

const prevSlide = () => {
  if (translateX.value < 0) {
    translateX.value += cardWidth.value + gap;
  }
};
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>