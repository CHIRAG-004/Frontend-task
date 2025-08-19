<script setup lang="ts">

</script>

<template>
    <div class="min-h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8 rounded-2xl items-center">
        <div class="max-w-7xl mx-auto  ">

            <div class="text-center">
                <h1 class="text-4xl font-bold text-text-900 sm:text-5xl">
                    About Us
                </h1>
                <p class="mt-4 text-lg text-text-700">
                    We’re here to make booking appointments simple, fast, and convenient.
                </p>
            </div>


            <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <!-- Left Column: Image or Illustration -->
                <div class="flex justify-center">
                    <img src="/assets/images/download.png" alt="About Us Illustration" class="rounded-lg" />
                </div>

                <!-- Right Column: About Us Text -->
                <div class="space-y-6">
                    <h2 class="text-2xl font-bold text-text-900">
                        Who We Are
                    </h2>
                    <p class="text-text-700">
                        We are a team of passionate individuals dedicated to simplifying the way you book appointments.
                        Whether it’s a doctor’s visit, a beauty session, or a consultation with a professional, we
                        provide a seamless online platform to connect you with the services you need—right from the
                        comfort of your home.
                    </p>
                    <p class="text-text-700">
                        Our mission is to save you time and effort by eliminating the hassle of phone calls and long
                        waiting times. With just a few clicks, you can schedule, reschedule, or cancel appointments
                        anytime, anywhere.
                    </p>

                    <!-- Features Section -->
                    <div class="space-y-4">
                        <div class="flex items-center gap-3">
                            <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-500" />
                            <span class="text-gray-700">Easy online booking</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <Icon name="heroicons:clock" class="w-6 h-6 text-blue-500" />
                            <span class="text-gray-700">24/7 availability</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <Icon name="heroicons:shield-check" class="w-6 h-6 text-purple-500" />
                            <span class="text-gray-700">Secure and reliable</span>
                        </div>
                    </div>

                    <!-- Call to Action -->
                    <div class="mt-8">
                        <nuxt-link to="/services"
                            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-accent-300 bg-primary-500 hover:bg-primary-600 transition duration-300">
                            Book an Appointment Now
                            <Icon name="heroicons:arrow-right" class="ml-2 w-5 h-5" />
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>