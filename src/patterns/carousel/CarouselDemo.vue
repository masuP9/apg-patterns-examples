<template>
  <Carousel
    v-if="variant === 'auto-rotate'"
    :slides="autoRotateSlides"
    aria-label="News highlights"
    :auto-rotate="true"
    :rotation-interval="5000"
    data-testid="carousel-auto"
  />
  <Carousel
    v-else
    :slides="demoSlides"
    aria-label="Featured content"
    data-testid="carousel-manual"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Carousel from './Carousel.vue';

const props = defineProps<{
  variant?: 'default' | 'auto-rotate';
  basePath?: string;
}>();

const base = computed(() => {
  const path = props.basePath || '';
  return path.endsWith('/') ? path.slice(0, -1) : path;
});

const demoSlides = computed(() => [
  {
    id: 'slide1',
    label: 'Featured Product',
    content: `<img src="${base.value}/images/carousel/slide-1.svg" alt="Featured Product - Discover our latest offering" class="apg-carousel-image" />`,
  },
  {
    id: 'slide2',
    label: 'New Arrivals',
    content: `<img src="${base.value}/images/carousel/slide-2.svg" alt="New Arrivals - Check out the newest additions" class="apg-carousel-image" />`,
  },
  {
    id: 'slide3',
    label: 'Special Offer',
    content: `<img src="${base.value}/images/carousel/slide-3.svg" alt="Special Offer - Limited time discount" class="apg-carousel-image" />`,
  },
]);

const autoRotateSlides = computed(() => [
  {
    id: 'auto1',
    label: 'Breaking News',
    content: `<img src="${base.value}/images/carousel/slide-4.svg" alt="Breaking News - Stay updated with the latest" class="apg-carousel-image" />`,
  },
  {
    id: 'auto2',
    label: 'Weather Update',
    content: `<img src="${base.value}/images/carousel/slide-5.svg" alt="Weather Update - Sunny skies expected" class="apg-carousel-image" />`,
  },
  {
    id: 'auto3',
    label: 'Sports Highlights',
    content: `<img src="${base.value}/images/carousel/slide-6.svg" alt="Sports Highlights - Catch up on game results" class="apg-carousel-image" />`,
  },
  {
    id: 'auto4',
    label: 'Entertainment',
    content: `<img src="${base.value}/images/carousel/slide-7.svg" alt="Entertainment - New releases and trending" class="apg-carousel-image" />`,
  },
]);
</script>
