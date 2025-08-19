<script setup lang="ts">
import type { User } from '~/services/dataBase/schema/schemaTypes'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')

// Password validation
const hasMinLength = computed(() => password.value.length >= 8)
const hasNumber = computed(() => /\d/.test(password.value))
const hasUppercase = computed(() => /[A-Z]/.test(password.value))
const hasSpecialChar = computed(() => /[!@#$%^&*]/.test(password.value))
const passwordsMatch = computed(() => password.value === confirmPassword.value)
const nameMatch = computed(() => firstName.value.length >= 3 && lastName.value.length >= 3)

const { signUp, signInWithGoogle } = useAuth()

//TODO: we have to think about how can we verify email field address

// Form validation
const isFormValid = computed(() => {
    return (
        firstName.value &&
        lastName.value &&
        email.value &&
        (phone.value && phone.value.length === 10) &&
        hasMinLength.value &&
        hasNumber.value &&
        hasUppercase.value &&
        hasSpecialChar.value &&
        passwordsMatch.value &&
        nameMatch
    )
})

definePageMeta({
    layout: 'custom'
})

const handleSubmit = async () => {
    const user: User = {
        id: "",
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phoneNo: phone.value,
        password: password.value,
        role: "consumer",
    }
    await signUp(user)
}
</script>


<template>
    <div class="w-full h-screen flex items-center justify-center bg-gray-50">
        <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <div class="text-center">
                <h1 class="text-3xl font-bold text-gray-900">Create Account</h1>
                <p class="mt-2 text-gray-600">Get started with your free account</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                        <div class="mt-1">
                            <input id="firstName" v-model="firstName" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John" />
                        </div>
                    </div>

                    <div>
                        <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                        <div class="mt-1">
                            <input id="lastName" v-model="lastName" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Doe" />
                        </div>
                    </div>
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <div class="mt-1">
                        <input id="email" v-model="email" type="email" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email" />
                    </div>
                </div>

                <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div class="mt-1">
                        <input id="phone" v-model="phone" type="tel" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="+1 234 567 890" />
                    </div>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <div class="mt-1">
                        <input id="password" v-model="password" type="password" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Create a password" />
                    </div>
                    <div class="mt-2 text-sm text-gray-600">
                        <p class="font-medium">Password must:</p>
                        <ul class="list-disc list-inside">
                            <li :class="{ 'text-green-600': hasMinLength }">Be at least 8 characters</li>
                            <li :class="{ 'text-green-600': hasNumber }">Contain at least one number</li>
                            <li :class="{ 'text-green-600': hasUppercase }">Contain at least one uppercase letter</li>
                            <li :class="{ 'text-green-600': hasSpecialChar }">Contain at least one special character
                            </li>
                        </ul>
                    </div>
                </div>

                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm
                        Password</label>
                    <div class="mt-1">
                        <input id="confirmPassword" v-model="confirmPassword" type="password" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password" />
                    </div>
                </div>

                <div>
                    <button type="submit" :disabled="!isFormValid"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                        Create Account
                    </button>
                </div>
            </form>

            <p class="text-center font-medium">OR</p>

            <button @click="signInWithGoogle"
                class="w-full flex items-center justify-center px-4 py-2 border gap-2 border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Icon name="logos:google-icon" class="w-5 h-5" />
                Continue with Google
            </button>

            <div class="text-center text-sm text-gray-600">
                Already have an account?
                <NuxtLink to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
