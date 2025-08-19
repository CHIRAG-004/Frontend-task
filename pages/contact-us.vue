<script setup lang="ts">

const handleSubmit = () => {
    alert('Your complaint has been submitted. We will get back to you soon!');
};
</script>

<template>
    <div class="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <!-- Page Header -->
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl">
                    Contact Us
                </h1>
                <p class="mt-4 text-lg text-gray-600">
                    We’re here to help! Reach out to us for any questions, concerns, or feedback.
                </p>
            </div>

            <!-- Contact Content -->
            <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <!-- Left Column: Contact Information -->
                <div class="space-y-6">
                    <h2 class="text-2xl font-bold text-gray-900">
                        Get in Touch
                    </h2>
                    <p class="text-gray-600">
                        If you have any questions or need assistance, feel free to contact us. Our team is always ready
                        to help you with your booking needs or resolve any issues you may have.
                    </p>

                    <!-- Contact Details -->
                    <div class="space-y-4">
                        <div class="flex items-center gap-3">
                            <Icon name="heroicons:envelope" class="w-6 h-6 text-blue-500" />
                            <span class="text-gray-700">support@bookathome.com</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <Icon name="heroicons:phone" class="w-6 h-6 text-green-500" />
                            <span class="text-gray-700">+1 (123) 456-7890</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <Icon name="heroicons:map-pin" class="w-6 h-6 text-red-500" />
                            <span class="text-gray-700">123 Booking Street, Suite 456, Home City, HC 789</span>
                        </div>
                    </div>

                    <!-- Social Media Links -->
                    <div class="mt-6">
                        <h3 class="text-xl font-semibold text-gray-900">Follow Us</h3>
                        <div class="flex gap-4 mt-3">
                            <a href="#" class="text-gray-500 hover:text-blue-500 transition duration-300">
                                <Icon name="ri:facebook-fill" class="w-6 h-6" />
                            </a>
                            <a href="#" class="text-gray-500 hover:text-pink-500 transition duration-300">
                                <Icon name="ri:instagram-fill" class="w-6 h-6" />
                            </a>
                            <a href="#" class="text-gray-500 hover:text-blue-400 transition duration-300">
                                <Icon name="ri:twitter-x-fill" class="w-6 h-6" />
                            </a>
                            <a href="#" class="text-gray-500 hover:text-red-500 transition duration-300">
                                <Icon name="ri:youtube-fill" class="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Complaint Form -->
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Submit a Complaint</h2>
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Name Field -->
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700">Your Name</label>
                            <input type="text" id="name" name="name" required
                                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                        </div>

                        <!-- Email Field -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">Your Email</label>
                            <input type="email" id="email" name="email" required
                                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                        </div>

                        <!-- Complaint Field -->
                        <div>
                            <label for="complaint" class="block text-sm font-medium text-gray-700">Your
                                Complaint</label>
                            <textarea id="complaint" name="complaint" rows="4" required
                                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
                        </div>

                        <!-- Submit Button -->
                        <div>
                            <button type="submit"
                                class="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-accent-300 bg-primary-500 hover:bg-primary-600 transition duration-300">
                                Submit Complaint
                                <Icon name="heroicons:paper-airplane" class="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>