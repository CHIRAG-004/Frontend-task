<script setup lang="ts">
const {  appointment } = defineProps(["appointment"])
const { createReviewAndRating } = useReview()

const isModalOpen = ref(false);
const rating = ref(0);
const review = ref('');
const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const setRating = (star: number) => {
    rating.value = star;
};

const submitReview = async () => {
    await createReviewAndRating(appointment, review.value, rating.value)
    onSuccess('Review created')
    closeModal();
};
</script>
<template>
    <div>
        <div @click="openModal"
            class="w-fit px-4 py-2 bg-yellow-300 text-gray-950  rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer">
            Leave a Review
        </div>

        <!-- Modal -->
        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
            <div class="bg-white text-text-900 p-6 rounded-lg w-96">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold">Leave a Review</h2>
                    <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                        <Icon name="heroicons-outline:x" class="w-6 h-6" />
                    </button>
                </div>

                <!-- Rating -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">Rating</label>
                    <div class="flex space-x-2">
                        <button v-for="star in 5" :key="star" @click="setRating(star)" :class="[
                            'text-2xl',
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        ]">
                            <Icon name="heroicons-solid:star" />
                        </button>
                    </div>
                </div>

                <!-- Review -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">Review</label>
                    <textarea v-model="review" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" rows="4"
                        placeholder="Write your review here..."></textarea>
                </div>

                <!-- Submit Button -->
                <button @click="submitReview"
                    class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    Submit
                </button>
            </div>
        </div>
    </div>
</template>