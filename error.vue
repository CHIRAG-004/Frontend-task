<script setup>
defineProps({
  error: Object
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
    <h1 class="text-5xl font-bold text-red-600">Oops!</h1>
    <p class="text-xl text-gray-700 mt-2">Something went wrong.</p>
    <p class="text-lg text-gray-500 mt-2">{{ error.statusCode }} - {{ error.message }}</p>
    <NuxtLink to="/" class="mt-4 px-6 py-2 text-white bg-primary-500 rounded-lg hover:bg-blue-600 transition">
      Go Home
    </NuxtLink>
  </div>
</template>