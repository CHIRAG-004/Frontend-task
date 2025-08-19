<script setup lang="ts">
const router = useRouter();
</script>

<template>
  <div class="flex flex-col lg:flex-row items-center gap-4">

    <div class="w-full lg:w-1/2 h-auto lg:h-screen flex flex-col justify-center items-center p-4 lg:p-8">
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-700 mb-4 lg:mb-8 text-center">
        Book Appointments Online, Anytime, Anywhere
      </h2>
      <p class="text-base sm:text-lg text-text-600 mb-6 lg:mb-12 text-center">
        Welcome to BookAtHome, your one-stop solution for booking appointments online. Whether you need a doctor’s
        consultation, a beauty session, or professional advice, we make it easy to schedule, manage, and reschedule
        appointments—all from the comfort of your home.
      </p>


      <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <button
          class="bg-primary-500 text-accent-300 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-accent-400 transition duration-300"
          @click="router.push('/services')">
          Book Appointment
        </button>
        <button
          class="bg-primary-500 text-accent-300 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-accent-400 transition duration-300"
          @click="router.push('/user/profile')">
          Become a Provider
        </button>
      </div>
    </div>

    <div class="w-full lg:w-1/2 h-auto lg:h-screen flex justify-center items-center p-4 lg:p-8">
      <img src="/assets/images/hero.png" alt="Booking Illustration" class="rounded-lg w-full max-w-md lg:max-w-none" />
    </div>
  </div>
</template>