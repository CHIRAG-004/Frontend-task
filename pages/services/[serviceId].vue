<script setup lang="ts">

const serviceId = useRoute().params.serviceId as string
const serviceData = (ProviderServicesStore().getServiceByServiceId(serviceId))
const images = serviceData.businessDocuments.map(id => ImageStore().getAImage(id))
const data = UserStore().getUserById(serviceData.userId)

function createImageUrl(image: File) {
    return URL.createObjectURL(image)
}

</script>

<template>
    <div class="p-8 bg-gray-50 min-h-screen">
        <!-- Profile Section -->
        <div class="flex justify-center items-center gap-6 mb-12">
            <span class="flex flex-col gap-2">
                <h1 class="text-3xl font-bold text-gray-800">{{ data?.firstName }} {{ data?.lastName }}</h1>
                <h2 class="text-lg text-gray-600">{{ data?.email }}</h2>
            </span>

            <img :src="typeof data?.profilePicture == 'string' ? data.profilePicture : createImageUrl(data?.profilePicture as File)"
                alt="Profile Image" class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg">
        </div>

        <!-- Service address Section -->
        <div class="bg-white p-8 rounded-lg shadow-md mb-12">
            <h1 class="text-2xl font-semibold text-gray-800 mb-4">Service address</h1>
            <p class="text-gray-600 leading-relaxed">
                {{ serviceData.businessAddress }}
            </p>
        </div>

        <!-- Service Details Section -->
        <div class="bg-white p-8 rounded-lg shadow-md mb-12">
            <h1 class="text-2xl font-semibold text-gray-800 mb-4">Service details</h1>
            <p class="text-gray-600 leading-relaxed">
                {{ serviceData.businessDescription }}
            </p>
        </div>

        <!-- Certificates Section -->
        <div class="bg-white p-8 rounded-lg shadow-md mb-12">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Certificates</h2>
            <div class="flex gap-6 overflow-x-auto">
                <!-- Array of square images -->
                <!-- <img v-for="image in images" :src="createImageUrl(image?.image!)" alt="certificate"
                    class="w-32 h-32 rounded-lg object-cover shadow-md"> -->
            </div>
        </div>

        <!-- Reviews Section -->
        <div class="bg-white p-8 rounded-lg shadow-md">
            <h1 class="text-2xl font-semibold text-gray-800 mb-6">Reviews</h1>
            <ReviewSlider :reviews="ReviewStore().getReviewByServiceID(serviceId)" />
        </div>
    </div>
</template>