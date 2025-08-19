<script setup lang="ts">

const router = useRouter();


const userStore = UserStore();
const profileUrl = ref('')

watchEffect(() => {
    profileUrl.value =
        typeof userStore.user?.profilePicture === 'string'
            ? userStore.user?.profilePicture
            : userStore.user?.profilePicture instanceof File
                ? URL.createObjectURL(userStore.user.profilePicture)
                : '';
});

async function logoutHandler() {
    await useAuth().logout();
}


const isMobileMenuOpen = ref(false);
</script>

<template>
    <ClientOnly>
        <div
            class="flex justify-between fixed top-0 w-full z-50 items-center p-4 bg-gradient-to-r from-primary-700 to-primary-600 backdrop-blur-xs text-accent-100">

            <h1 class="text-2xl font-bold">BookAtHome</h1>


            <button class="lg:hidden text-2xl focus:outline-none" @click="isMobileMenuOpen = !isMobileMenuOpen">
                <Icon :name="isMobileMenuOpen ? 'mingcute:close-line' : 'mingcute:menu-line'" />
            </button>


            <div class="hidden lg:flex space-x-4 text-md font-medium">
                <nuxt-link to="/" class="hover:text-primary-300">Home</nuxt-link>
                <nuxt-link to="/about" class="hover:text-primary-300">About</nuxt-link>
                <nuxt-link to="/services" class="hover:text-primary-300">Services</nuxt-link>
                <nuxt-link to="/contact-us" class="hover:text-primary-300">Contact us</nuxt-link>
            </div>


            <div class="hidden lg:flex items-center space-x-4">

                <div v-if="userStore.isAuthenticated" class="flex items-center space-x-2">
                    <div class="flex items-center cursor-pointer space-x-2" @click="router.push('/user/profile')">
                        <img :src="profileUrl as string" alt="user-avatar"
                            class="w-10 h-10 border-[0.5px] rounded-full object-cover hover:cursor-pointer" />
                        <span class="text-md font-medium">{{ userStore.getUserFullName }}</span>
                    </div>
                    <Icon name="mingcute:exit-line" class="text-2xl cursor-pointer" @click="logoutHandler" />
                </div>


                <div v-else class="flex space-x-2">
                    <nuxt-link to="/auth/login" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Log
                        in</nuxt-link>
                    <nuxt-link to="/auth/register"
                        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Sign up</nuxt-link>
                </div>
            </div>


            <div v-if="isMobileMenuOpen"
                class="lg:hidden absolute top-16 left-0 w-full bg-gradient-to-r from-primary-700 to-primary-600 backdrop-blur-xs text-accent-100 p-4"
                @click="isMobileMenuOpen = false">
                <div class="flex flex-col space-y-4">
                    <nuxt-link to="/" class="hover:text-primary-300">Home</nuxt-link>
                    <nuxt-link to="/about" class="hover:text-primary-300">About</nuxt-link>
                    <nuxt-link to="/services" class="hover:text-primary-300">Services</nuxt-link>
                    <nuxt-link to="/contact-us" class="hover:text-primary-300">Contact us</nuxt-link>


                    <div v-if="userStore.isAuthenticated" class="flex flex-col space-y-2">
                        <nuxt-link to="user/profile">Profile</nuxt-link>
                        <button class="flex items-center space-x-2 text-md font-medium" @click="logoutHandler">
                            <Icon name="mingcute:exit-line" class="text-2xl" />
                            <span>Logout</span>
                        </button>
                    </div>

                    <div v-else class="flex flex-col space-y-2">
                        <nuxt-link to="/auth/login"
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center">Log
                            in</nuxt-link>
                        <nuxt-link to="/auth/register"
                            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center">Sign
                            up</nuxt-link>
                    </div>
                </div>
            </div>
        </div>
    </ClientOnly>
</template>