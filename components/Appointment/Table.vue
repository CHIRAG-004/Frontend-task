<script setup>
const { appointments } = defineProps(['appointments']);
const showModal = ref(false)
const selectedAppointment = ref()

function clickHandler(event) {
    const row = event.target.closest('tr');
    if (row) {
        const row = event.target.closest('tr');
        if (row) {
            const appointmentId = row.dataset.appointmentId;
            selectedAppointment.value = appointments.find(app => app.id === appointmentId);
            showModal.value = true;
        }
    }
}



const categories = ref(appointments.map((appointment) => appointment.category))
const subCategories = ref(appointments.map((appointment) => appointment.subCategory))

const selectedCategory = ref('')
const selectedSubCategory = ref('')
const filteredSubCategories = ref(subCategories.value)
const filteredCategories = ref(categories.value)

const filterContainer = ref(appointments)

watchEffect(() => {

    if (selectedCategory.value) {
        filterContainer.value = appointments.filter(appointment => appointment.category == selectedCategory.value)

        const tempFilteredSubCategories = []
        appointments.forEach(appointment => appointment.category == selectedCategory.value ? tempFilteredSubCategories.push(appointment.subCategory) : '')
        filteredSubCategories.value = tempFilteredSubCategories
    } else if (selectedCategory.value == "") {

        filteredSubCategories.value = subCategories.value
    }
    if (selectedSubCategory.value) {
        filterContainer.value = appointments.filter(appointment => appointment.subCategory == selectedSubCategory.value)
        const tempFilteredCategories = []
        appointments.forEach(appointment => appointment.subCategory == selectedSubCategory.value ? tempFilteredCategories.push(appointment.category) : '')
        filteredCategories.value = tempFilteredCategories
    } else if (selectedSubCategory.value == "") {
        filteredCategories.value = categories.value
    }
})

</script>

<template>
    <div class="flex flex-col sm:flex-row gap-5 my-5 items-center">
        <span class="flex gap-3 items-center">
            <p>Category</p>
            <CommonSearchableDropDown class="w-fit" :data="filteredCategories"
                :place-holder-text="'Search by category...'"
                @selectedCategory="(category) => selectedCategory = category" :flag="''" />
        </span>
        <span class="flex gap-3 items-center">
            <p>Sub-Category</p>
            <CommonSearchableDropDown class="w-fit" :data="filteredSubCategories"
                :place-holder-text="'Search by sub-category...'"
                @selectedCategory="(category) => selectedSubCategory = category" :flag="''" />
        </span>
    </div>
    <div class="max-h-[530px] border rounded-md border-gray-200 shadow overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <!-- Table Header -->
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-md font-semibold text-gray-500 uppercase tracking-wider">
                        Category
                    </th>
                    <th class="px-6 py-3 text-left text-md font-semibold text-gray-500 uppercase tracking-wider">
                        Subcategory
                    </th>
                    <th class="px-6 py-3 text-left text-md font-semibold text-gray-500 uppercase tracking-wider">
                        Price
                    </th>
                    <th class="px-6 py-3 text-left text-md font-semibold text-gray-500 uppercase tracking-wider">
                        {{ UserStore().getUserRole == "consumer" ? "Provider" : "Consumer" }}
                    </th>
                    <th class="px-6 py-3 text-left text-md font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                </tr>
            </thead>
            <!-- Table Body -->
            <tbody class=" divide-y divide-gray-200" @click="clickHandler">
                <tr v-if="filterContainer?.length > 0" v-for="appointment in filterContainer" :key="appointment.id"
                    class="hover:bg-gray-50 cursor-pointer transition-colors" :data-appointment-id="appointment.id">

                    <td class="px-6 py-4 text-sm text-gray-700">
                        {{ appointment.category }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-700">
                        {{ appointment.subCategory }}
                    </td>
                    <td class="px-6 py-4   text-sm text-gray-700">
                        {{ appointment.slot.price }} ₹
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-700">
                        {{ appointment.data.firstName }} {{ appointment.data.lastName }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-700">
                        {{ appointment.status }}
                    </td>
                </tr>
            </tbody>
        </table>
        <AppointmentDetails v-if="showModal" :appointment="selectedAppointment" :is-open="showModal"
            @close="showModal = false" />
    </div>
</template>