<script setup lang="ts">
import type { ProviderService } from '~/services/dataBase/schema/schemaTypes';

const router = useRouter()
const props = defineProps<{
    "providerService": ProviderService
}>()
const selectedSlot = useState("slot")
const isShowSlots = ref(false)

const userData = UserStore().getUserById(props.providerService.userId)

const profileUrl = typeof userData?.profilePicture == "string" ? userData.profilePicture : URL.createObjectURL(userData?.profilePicture as File)

function clickHandler() {
    if (!selectedSlot.value) {
        isShowSlots.value = true
    }
}
</script>

<template>
    <div class="w-[85vw] md:w-[70vw] cursor-pointer lg:w-[65vw] 2xl:w-[50vw] mx-auto mt-10 my-5 flex flex-col md:flex-row rounded-lg border-1 bg-secondary-100 border-accent-50 shadow-lg hover:shadow-xl transition-shadow duration-300"
        @click="router.push(`/services/${props.providerService.id}`)">
        <!-- Image Section -->
        <div class="w-full md:w-48 h-48 flex-shrink-0 ">
            <img :src="profileUrl" alt="Category Image"
                class="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none">
        </div>

        <!-- Content Section -->
        <div class="flex flex-col p-4 md:p-6 flex-grow">
            <!-- Header Section -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
                <span class="flex flex-col gap-2">
                    <h1 class="text-md  md:text-2xl font-bold text-accent-900">
                        {{ props.providerService.category + `(${props.providerService.subCategory})` }}
                    </h1>
                    <p class="w-full md:w-[95%] text-sm md:text-base text-gray-800 leading-relaxed">
                        {{ props.providerService.businessDescription }}
                    </p>
                </span>
                <span
                    class="text-lg md:text-xl flex items-center gap-2 font-semibold text-yellow-500 bg-yellow-100 px-3 py-1 rounded-full mt-4 md:mt-0">
                    5
                    <Icon name="ic:round-star" class="w-5 h-5 md:w-6 md:h-6" />
                </span>
            </div>

            <!-- Footer Section -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between mt-4 md:mt-6">
                <h1 class="text-md font-medium text-text-800 mb-2 md:mb-0">
                    {{ userData?.firstName }} {{ userData?.lastName }}
                </h1>
                <BookingProcessSlotModal @click.stop="clickHandler" :providerService="providerService" />
            </div>
        </div>
    </div>
</template>