<script setup lang="ts">

const { data, placeHolderText, flag } = defineProps<{
    data: string[],
    placeHolderText: string,
    flag: string
}>()

const searchQuery = ref('');
const isOpen = ref(false);
const isLoading = ref(false);

const usedCategoryAndSubcategory: { [key: string]: string[] } = ProviderServicesStore().getUsedCategogiesAndSubCategories


const filteredCategories = computed(() => {
    return data.filter((category: string) =>
        category.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});


const handleInput = () => {
    isLoading.value = true;
    setTimeout(() => {
        isLoading.value = false;
    }, 300);
};


const selectCategory = (category: string) => {
    searchQuery.value = category;
    isOpen.value = false;
    emit('selectedCategory', searchQuery.value);
};

const emit = defineEmits<{
    (event: 'selectedCategory', selectedItem: string): void;
}>();

function shouldDisable(categoryOrSubCategory: string) {
    if (flag === 'provider') {
        const providerStore = ProviderServicesStore()
        const usedCategories: string[] = Object.keys(providerStore.getUsedCategogiesAndSubCategories)
        const usedSubCategories: string[] = Object.values(providerStore.getUsedCategogiesAndSubCategories).flat()
        if (usedSubCategories.includes(categoryOrSubCategory)) {
            return true
        }
        else if (usedCategories.includes(categoryOrSubCategory)) {
            const categorieStore = CategoryStore()
            return categorieStore.getSubCategoriesByCategory(categoryOrSubCategory).every((subCategory) => usedSubCategories.includes(subCategory))
        }
        else return false
    }
    return false;
}

watchEffect(() => {
    if (searchQuery.value === "") {
        emit('selectedCategory', "");
    }
})

</script>
<template>
    <div class="relative bg-secondary-50">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon name="heroicons:magnifying-glass" class="text-gray-500" />
        </div>
        <!-- Input Field -->
        <input v-model="searchQuery" type="text" :placeholder="placeHolderText"
            class="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="handleInput" @click="isOpen = !isOpen" />

        <!-- Dropdown -->
        <div v-if="isOpen"
            class="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <!-- Loading State -->
            <div v-if="isLoading" class="p-2 text-gray-500">Loading...</div>

            <!-- No Results -->
            <div v-else-if="filteredCategories.length === 0" class="p-2 text-gray-500">
                No results found.
            </div>

            <!-- Category List -->
            <ul v-else>
                <li v-for="category in filteredCategories" :key="category"
                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    :class="{ 'opacity-50 cursor-not-allowed': shouldDisable(category) }"
                    @click="!shouldDisable(category) && selectCategory(category)">
                    {{ category }}
                </li>
            </ul>
        </div>
    </div>
</template>
