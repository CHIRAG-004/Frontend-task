<script setup>
const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        default: 'Confirm Action',
    },
    message: {
        type: String,
        default: 'Are you sure you want to perform this action?',
    },
});

const emit = defineEmits(['confirm', 'close']);

const closeModal = () => {
    emit('close');
};

const confirmAction = () => {
    emit('confirm');
    closeModal();
};
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-opacity-20">
        <div class="bg-white text-text-900 rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
            <!-- Modal Body -->
             <h1 class="text-2xl font-semibold ">{{ title }}</h1>
            <div class="mb-6 ">
                <p>{{ message }}</p>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end space-x-4">
                <button @click="closeModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                    Cancel
                </button>
                <button @click="confirmAction" class="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded">
                    Confirm
                </button>
            </div>
        </div>
    </div>
</template>