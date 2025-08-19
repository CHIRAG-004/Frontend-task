<template>
    <footer class="bg-gradient-to-r from-primary-700 to-primary-600 text-accent-100 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Footer Grid -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <!-- Column 1: About Us -->
                <div>
                    <h3 class="text-lg font-bold mb-4">About Us</h3>
                    <p class="text-accent-300">
                        BookAtHome is your trusted platform for booking appointments online. We connect you with
                        professionals and services from the comfort of your home.
                    </p>
                </div>

                <!-- Column 2: Quick Links -->
                <div>
                    <h3 class="text-lg font-bold mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li>
                            <nuxt-link to="/"
                                class="text-text-accent-300 hover:text-white transition duration-300">Home</nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/about"
                                class="text-accent-300 hover:text-white transition duration-300">About Us</nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/services"
                                class="text-accent-300 hover:text-white transition duration-300">Services</nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/contact-us"
                                class="text-accent-300 hover:text-white transition duration-300">Contact
                                Us</nuxt-link>
                        </li>
                    </ul>
                </div>

                <!-- Column 3: Contact Info -->
                <div>
                    <h3 class="text-lg font-bold mb-4">Contact Info</h3>
                    <ul class="space-y-2">
                        <li class="flex items-center gap-2">
                            <Icon name="heroicons:envelope" class="w-5 h-5 text-accent-300" />
                            <span class="text-accent-300">support@bookathome.com</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <Icon name="heroicons:phone" class="w-5 h-5 text-accent-300" />
                            <span class="text-accent-300">+1 (123) 456-7890</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <Icon name="heroicons:map-pin" class="w-5 h-5 text-accent-300" />
                            <span class="text-accent-300">123 Booking Street, Suite 456, Home City, HC 789</span>
                        </li>
                    </ul>
                </div>

                <!-- Column 4: Social Media -->
                <div>
                    <h3 class="text-lg font-bold mb-4">Follow Us</h3>
                    <div class="flex gap-4">
                        <a href="#" class="text-accent-300 transition duration-300">
                            <Icon name="ri:facebook-fill" class="w-6 h-6" />
                        </a>
                        <a href="#" class="text-accent-300 transition duration-300">
                            <Icon name="ri:instagram-fill" class="w-6 h-6" />
                        </a>
                        <a href="#" class="text-accent-300  transition duration-300">
                            <Icon name="ri:twitter-x-fill" class="w-6 h-6" />
                        </a>
                        <a href="#" class="text-accent-300  transition duration-300">
                            <Icon name="ri:youtube-fill" class="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-secondary-400 mt-8 pt-8 text-center">
                <p class="text-accent-300">
                    &copy; {{ new Date().getFullYear() }} BookAtHome. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
</template>