<script setup lang="ts">
const slots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
];
</script>

<template>
    <div class="p-4 bg-secondary-50 lg:h-full rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-text-900 mb-4 text-center">Sort by</h1>

        <!-- Calendar component -->
        <div class="mb-6">
            <h2 class="text-xl font-semibold text-text-800 mb-2">Date</h2>
            <hr class="mb-5 text-secondary-400" />
            <SortingDatePicker class="p-2" :is-open="true"/>
        </div>

        <!-- Array of slots -->
        <div>
            <h2 class="text-xl font-semibold text-text-800 mb-2">Slots</h2>
            <hr class="mb-5 text-secondary-400" />
            <div
                class="max-w-[362px] grid text-sm 2xl:text-md grid-cols-3 2xl:grid-cols-3 gap-4 bg-secondary-100 cursor-pointer border border-gray-300 p-2 2xl:p-2 rounded-md shadow-lg">
                <SortingSlot v-for="(slot, idx) in slots" :key="idx" :time="slot"
                    class="2xl:p-2 p-[3px] text-gray-600 bg-gray-100 border border-gray-300 rounded-lg shadow font-semibold hover:bg-gray-200 transition-colors duration-200" />
            </div>
        </div>
    </div>
</template>