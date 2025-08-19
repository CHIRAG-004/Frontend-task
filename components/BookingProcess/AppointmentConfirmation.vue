<script setup lang="ts">
import { ref } from 'vue';
import type { Slot } from '~/services/dataBase/schema/schemaTypes';

interface FormData {
    consumerDescription: string;
    consumerDocs: FileList | null;
    consumerDocsPreview: string[];
}

const formData = ref<FormData>({
    consumerDescription: '',
    consumerDocs: null,
    consumerDocsPreview: [],
});

const emit = defineEmits<{
    (event: 'close'): void;
    (event: 'submit', formData: FormData): void;
}>();

const props = defineProps<{
    selectedSlot: Slot | null;
}>();


function closeModal() {
    emit('close');
}

function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        formData.value.consumerDocs = target.files;
        formData.value.consumerDocsPreview = [];

        for (let i = 0; i < target.files.length; i++) {
            const file = target.files[i];
            const previewUrl = URL.createObjectURL(file);
            formData.value.consumerDocsPreview.push(previewUrl);
        }
    }
}

function submitForm() {
    emit('submit', formData.value);
    closeModal();
}
</script>

<template>
    <div class="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div class="relative p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
            <div class="absolute top-0 right-0 p-2">
                <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                    &times;
                </button>
            </div>
            <h1 class="text-2xl font-bold mb-4">Appointment Details</h1>
            <form @submit.prevent="submitForm">
                <!-- Selected Slot -->
                <div class="mb-4 flex flex-col gap-2 ">
                    <p class="text-sm text-gray-700">Selected Slot Time: <span class="font-semibold">{{
                        props.selectedSlot?.time
                            }}</span></p>
                    <p class="text-sm text-gray-700">Selected Slot Price: <span class="font-semibold">{{
                        props.selectedSlot?.price
                            }}  ₹</span></p>
                </div>

                <!-- Consumer Description -->
                <div class="mb-4">
                    <label for="consumerDescription" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="consumerDescription" v-model="formData.consumerDescription"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        rows="4" required></textarea>
                </div>

                <!-- Consumer Documents -->
                <div class="mb-4">
                    <label for="consumerDocs" class="block text-sm font-medium text-gray-700">Upload Documents</label>
                    <input type="file" id="consumerDocs" @change="handleFileUpload"
                        class="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                        multiple>
                </div>

                <!-- Document Previews -->
                <div v-if="formData.consumerDocsPreview.length" class="mb-4">
                    <h2 class="text-sm font-medium text-gray-700 mb-2">Document Previews</h2>
                    <div class="flex flex-wrap gap-2">
                        <div v-for="(previewUrl, index) in formData.consumerDocsPreview" :key="index" class="relative">
                            <img :src="previewUrl" alt="Document Preview"
                                class="w-24 h-24 object-cover rounded-lg border border-gray-300">
                            <button @click="formData.consumerDocsPreview.splice(index, 1)"
                                class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600">
                                &times;
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="flex justify-end">
                    <button type="submit"
                        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>