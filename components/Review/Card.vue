<template>
    <div
        class="max-w-[450px] h-auto bg-white p-6 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 rounded-lg shadow-md border border-gray-100">
        <div class="flex justify-between items-center">
            <!-- Header Section -->
            <div class="flex items-center space-x-4">
                <img :src="profileUrl" alt="Reviewer Avatar" class="w-12 h-12 rounded-full object-cover" />
                <div>
                    <h3 class="text-lg font-semibold">{{ writtenBy.firstName }} {{ writtenBy.lastName }}</h3>
                    <p class="text-sm text-gray-500">
                        {{ review.role }},
                        {{ review.category }} ({{ review.subCategory }})
                    </p>
                </div>
            </div>

            <!-- Rating Section -->
            <div class="flex items-center">
                <span class="text-yellow-400 text-lg">★</span>
                <span class="ml-1 text-gray-700">{{ review.rating }}/5</span>
            </div>
        </div>

        <!-- Review Content -->
        <p class="mt-4 text-gray-600">{{ review.review }}</p>

        <!-- Date Section -->
        <p class="mt-4 text-sm text-gray-400">
            Reviewed on {{ review.dateAndTime.toLocaleDateString() }}
        </p>
    </div>
</template>

<script setup lang="ts">
import type { ReviewAndRating, User } from "@/services/dataBase/schema/schemaTypes"

const props = defineProps<{
    review: ReviewAndRating,
    type: string
}>();

const writtenBy: User = UserStore().getUserById(props.review.writtenBy)!
const profileUrl = typeof writtenBy.profilePicture == "string" ? writtenBy.profilePicture : URL.createObjectURL(writtenBy.profilePicture as File)
</script>