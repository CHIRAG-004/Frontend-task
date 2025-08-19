<script setup lang="ts">
const email = ref('')
const password = ref('')

const { signInWithGoogle, signIn } = useAuth()
const router = useRouter()

// Form validation
const isFormValid = computed(() => {
    return (
        email.value &&
        password.value
    )
})

definePageMeta({
    layout: 'custom'
})

const handleSubmit = async () => {
    await signIn(email.value, password.value)
    router.push("/user/profile")
}

</script>
<template>
    <div class="w-full h-screen flex items-center justify-center bg-gray-50">
        <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <div class="text-center">
                <h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
                <p class="mt-2 text-gray-600">Sign in to your account</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <div class="mt-1">
                        <input id="email" v-model="email" type="email" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email" />
                    </div>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <div class="mt-1">
                        <input id="password" v-model="password" type="password" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password" />
                    </div>
                </div>

                <div>
                    <button type="submit" :disabled="!isFormValid"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                        Sign In
                    </button>
                </div>
            </form>

            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
            </div>

            <button @click="signInWithGoogle"
                class="w-full flex items-center justify-center px-4 py-2 border gap-2 border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Icon name="logos:google-icon" class="w-5 h-5" />
                Continue with Google
            </button>

            <div class="text-center text-sm text-gray-600">
                Don't have an account?
                <NuxtLink to="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">
                    Sign up
                </NuxtLink>
            </div>

            <!-- TODO we have to think how to handle forget-password route-->
            <!-- <div class="text-center text-sm text-gray-500">
                <NuxtLink to="/forgot-password" class="hover:text-gray-700">
                    Forgot your password?
                </NuxtLink>
            </div> -->
        </div>
    </div>
</template>
