<script setup lang="ts">
import type { ProviderService } from '~/services/dataBase/schema/schemaTypes'

const categories = CategoryStore()

const providerServices = ref<ProviderService[]>(ProviderServicesStore().allProviderServices)
const selectedCategory = ref("")
const selectSubCategory = ref("")
const selectedDate = useState<Date>("selectedDate")
const selectedTime = useState<string>("selectedTime")
const categoriesData = ref<string[]>(categories.getCategories)
const subCategoriesData = ref<string[]>(categories.getSubCategories)
const isOpen = ref(false)
const showDiv = ref(false)

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

definePageMeta({
    layout: 'sidebar'
})
const isMobileScreen = ref(false)
onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
    useState('selectedTime').value = null
})

function checkScreenSize() {
    isMobileScreen.value = window.innerWidth < 1024
}

//filtering services by category and sub-category
watchEffect(() => {
    if (selectedCategory.value !== "") {
        subCategoriesData.value = categories.getSubCategoriesByCategory(selectedCategory.value)
    }
    if (selectedCategory.value !== "") {
        providerServices.value = [...providerServices.value.filter((providerService) => providerService.category === selectedCategory.value)]
    }
    if (selectSubCategory.value !== "") {
        providerServices.value = [...providerServices.value.filter((providerService) => providerService.subCategory === selectSubCategory.value)]
    }
    if (selectedCategory.value === "" && selectSubCategory.value === "") {
        providerServices.value = ProviderServicesStore().allProviderServices
    }
    else if (selectSubCategory.value === "") {
        providerServices.value = ProviderServicesStore().allProviderServices.filter((providerService) => providerService.category === selectedCategory.value)
    }

})

//filtering services by selected date and time
watchEffect(() => {
    if (selectedDate.value || selectedTime.value) {
        providerServices.value = useProvider().getServicesByDateAndTime(selectedDate.value, selectedTime.value)
    }
})
</script>

<template>

    <div v-if="!isMobileScreen">
        <div class="flex flex-col md:flex-row items-center gap-5 mt-5">
            <h1 class="text-lg font-semibold">
                Select Category
            </h1>
            <CommonSearchableDropDown :data="categoriesData" :placeHolderText="'Search categories...'"
                :flag="'appointment'" @selectedCategory="(category) => selectedCategory = category" />
            <h1 class="text-lg font-semibold">
                Select Sub-Category
            </h1>
            <CommonSearchableDropDown :data="subCategoriesData" :placeHolderText="'Search sub-categories...'"
                :flag="'appointment'" @selectedCategory="(category) => selectSubCategory = category" />
        </div>

        <div class="flex flex-col md:flex-row">
            <div class="flex flex-col gap-5 w-full md:w-1/2">
                <h1 v-if="providerServices.length < 1"
                    class="text-5xl font-extrabold text-text-300 absolute top-1/2 right-1/2">No Service found</h1>
                <ProviderServiceCard v-else v-for="providerService in providerServices" :key="providerService.id"
                    :providerService="providerService" />
            </div>
        </div>
    </div>

    <div v-else>
        <div class="flex flex-col md:flex-row justify-between">
            <div class="flex gap-2 items-center">
                <CommonSearchableDropDown :data="categoriesData" :placeHolderText="'Search categories...'"
                    :flag="'appointment'" @selectedCategory="(category) => selectedCategory = category" />
                <CommonSearchableDropDown :data="subCategoriesData" :placeHolderText="'Search sub-categories...'"
                    :flag="'appointment'" @selectedCategory="(category) => selectSubCategory = category" />
            </div>
            <div class="flex items-center justify-end gap-2">
                <span @click="isOpen = !isOpen" class="">
                    <SortingDatePicker class="p-2" :is-open="isOpen" />
                </span>
                <span @click="showDiv = !showDiv"
                    class="relative p-2 bg-primary-300 text-accent-200 font-bold rounded-md">
                    {{ useState('selectedTime').value ? useState('selectedTime').value : 'select a slot' }}
                    <div v-if="showDiv"
                        class="absolute p-1 transition-all duration-200 bg-secondary-200 rounded-md shadow-md grid w-[200px] grid-cols-2 gap-1 space-y-1 top-12 right-0.5">
                        <SortingSlot v-for="(slot, idx) in slots" :key="idx" :time="slot"
                            class=" text-gray-600 text-center h-full w-full bg-gray-100 border border-gray-300 rounded-lg shadow font-semibold hover:bg-gray-200 transition-colors duration-200" />
                    </div>
                </span>
            </div>
        </div>


        <div class="flex flex-col gap-5">
            <h1 v-if="providerServices.length < 1"
                class="text-3xl font-extrabold text-text-300 absolute top-1/2 left-[30%]">No Service found</h1>
            <ProviderServiceCard v-for="providerService in providerServices" :key="providerService.id"
                :providerService="providerService" />
        </div>



    </div>


</template>