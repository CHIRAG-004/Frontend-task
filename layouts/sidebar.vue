<script setup lang="ts">

const isMobileScreen = ref(false)
onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
})

function checkScreenSize() {
    isMobileScreen.value = window.innerWidth < 1024
}
</script>

<template>
    <div>
        <Navbar />
        <div class="w-full 2xl:max-w-11/12 lg:mx-auto min-h-screen flex flex-col lg:flex-row">
            <!-- Main Content -->
            <div class="w-full lg:w-[75%] mt-16 p-4">
                <slot />
            </div>

            <!-- Sidebar -->
            <div v-if="!isMobileScreen"
                class="w-full lg:w-[25%] lg:h-screen border-l-1 border-gray-200 lg:fixed right-0 2xl:right-16 lg:top-16 lg:overflow-y-auto">
                <SortingSection />
            </div>
        </div>
    </div>
</template>