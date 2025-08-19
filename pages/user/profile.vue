<script setup lang="ts">
import { useToast } from "vue-toastification";
const { getUser } = UserStore();
let dbRole = ref(getUser?.role)
ProviderServicesStore().setAProviderServices(getUser?.id!)
const { updateUserDetails, updateUserProfile } = useAppointment()
const toast = useToast()
const usedServices = ref<string[]>(ProviderServicesStore().aProviderServices.map(service => service.subCategory))
const selectedService = ref<string>(usedServices.value.length > 0 ? usedServices.value[0] : "Add")
const activeValue = ref(getUser?.role || "consumer");
const firstName = ref(getUser?.firstName || '');
const lastName = ref(getUser?.lastName || '');
const email = ref(getUser?.email || '');
const phoneNo = ref(getUser?.phoneNo || '');
const profilePictureFile = ref<string | null>(null);
const showModal = ref(false)

const profileUrl = ref("")
const selectedAppointmentCategory = ref('upcoming')

const appointments = ref()

// setting the default values and watched for changes
watchEffect(() => {
    appointments.value = AppointmentStore().getAllAppointments('consumer')
    usedServices.value = ProviderServicesStore().aProviderServices.map(service => service.subCategory)
    appointments.value = AppointmentStore().getUpcomingAppointments('consumer')
    profileUrl.value =
        typeof getUser?.profilePicture === 'string'
            ? getUser.profilePicture
            : getUser?.profilePicture instanceof File
                ? URL.createObjectURL(getUser.profilePicture)
                : '';
})

// form verify
const isFormValid = computed(() => {
    return (
        email.value == UserStore().getUser?.email &&
        firstName.value == UserStore().getUser?.firstName &&
        lastName.value == UserStore().getUser?.lastName &&
        phoneNo.value == ''
    )
})


// Handle form submission
async function clickHandler() {
    const newDetails = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phoneNo: phoneNo.value
    }
    await updateUserDetails(newDetails)
}


//handle profile picture changes
async function changePicture(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file.');
            event.preventDefault();
            return
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePictureFile.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
        await updateUserProfile(file)

    }

}

//handle user role switch
async function handleConfirm() {
    //switched the role
    if (UserStore().getUser?.role !== "provider" && dbRole.value !== "provider") {
        await updateUserDetails({ role: "provider" })
        dbRole.value = "provider"
    } else toast.success(`Switched to ${activeValue.value === 'consumer' ? 'provider' : 'consumer'}`)

    UserStore().updateUserDetails({
        role: activeValue.value == 'consumer' ? 'provider' : 'consumer'
    })
    activeValue.value = activeValue.value === 'consumer' ? 'provider' : 'consumer';
}

// this watch effect react when selceted appointment category value changed
watch(selectedAppointmentCategory, () => {
    if (selectedAppointmentCategory.value == "upcoming") {
        appointments.value = AppointmentStore().getUpcomingAppointments('consumer')
    } else if (selectedAppointmentCategory.value == "completed") {
        appointments.value = AppointmentStore().getAppointmentsByStatus("completed", 'consumer')
    } else if (selectedAppointmentCategory.value == "cancelled") {
        appointments.value = AppointmentStore().getAppointmentsByStatus('cancelled', 'consumer')
    } else {
        appointments.value = AppointmentStore().getAllAppointments('consumer')
    }
})

</script>

<template>
    <CommonConfirmationModal :isOpen="showModal" :title="'Do you want to switch ?'" @confirm='handleConfirm'
        @close="() => showModal = false" />
    <div class="flex flex-col p-4">
        <!-- appointment section -->
        <section v-if="activeValue == 'consumer'">
            <div class="mt-10 my-2 flex flex-col md:flex-row justify-between">
                <h1 class="text-3xl text-text-900 font-bold">My {{ selectedAppointmentCategory }} Appointments</h1>
                <select name="appointmentFilter" id="appointmentFilter"
                    class="bg-primary-100 text-accent-800 font-medium rounded px-2 py-1 mt-4 md:mt-0"
                    v-model="selectedAppointmentCategory">
                    <option value="upcoming" selected>Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="all">All</option>
                </select>
            </div>
            <hr class="text-secondary-400">

            <div class="my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <h1 v-if="appointments.length < 1" class="text-text-500 font-bold text-3xl">No Appointment</h1>
                <AppointmentCard v-if="selectedAppointmentCategory !== 'all'" v-for="appointment in appointments"
                    :key="appointment.id" :appointment="appointment" />
            </div>
            <AppointmentTable v-if="selectedAppointmentCategory == 'all' && appointments.length > 0"
                :appointments="appointments" />
        </section>

        <!-- consumer section  -->
        <section>
            <div class="mt-10 my-2 flex flex-col md:flex-row justify-between">
                <h1 class="text-3xl text-text-900 font-bold">{{ UserStore().getUser?.role == 'provider' ? 'Provider' :
                    'Consumer' }} Details</h1>
                <div class="flex items-center space-x-4 mt-4 md:mt-0">
                    <span
                        :class="{ 'text-text-500': activeValue !== 'consumer', 'font-bold': activeValue === 'consumer' }">Consumer</span>
                    <button @click="() => dbRole == 'provider' ? handleConfirm() : showModal = true"
                        class="w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300"
                        :class="{ 'bg-blue-500': activeValue === 'provider' }">
                        <span
                            class="w-6 h-6 bg-primary-400 rounded-full shadow-md transform transition-transform duration-300"
                            :class="{ 'translate-x-6': activeValue === 'provider' }"></span>
                    </button>
                    <span
                        :class="{ 'text-gray-500': activeValue !== 'provider', 'font-bold': activeValue === 'provider' }">Provider</span>
                </div>
            </div>
            <hr class="text-secondary-400">

            <div class="flex flex-col md:flex-row items-center mt-5 justify-between">
                <!-- right side div for form -->
                <form @submit.prevent="clickHandler" class="flex flex-col gap-5 w-full md:w-1/2">
                    <!-- full name  -->
                    <div class="flex flex-col sm:flex-row justify-between items-center gap-5">
                        <span class="flex flex-col gap-1 w-full">
                            <label for="firstName" class="text-xl font-medium">First Name</label>
                            <input type="text" v-model="firstName"
                                :placeholder="getUser?.firstName || 'Enter your first name.'"
                                class="w-full bg-secondary-200 text-text-900 px-2 py-1 rounded">
                        </span>

                        <span class="flex flex-col gap-1 w-full">
                            <label for="lastName" class="text-xl font-medium">Last Name</label>
                            <input type="text" v-model="lastName"
                                :placeholder="getUser?.lastName || 'Enter your last name.'"
                                class="w-full bg-secondary-200 text-text-900 px-2 py-1 rounded">
                        </span>
                    </div>

                    <!-- email & phone no  -->
                    <div class="flex flex-col sm:flex-row justify-between items-center gap-5">
                        <span class="flex flex-col gap-1 w-full">
                            <label for="email" class="text-xl font-medium">Email</label>
                            <input type="email" v-model="email" :placeholder="getUser?.email || 'xyz@gmail.com'"
                                class="w-full bg-secondary-200 text-text-900 px-2 py-1 rounded">
                        </span>

                        <span class="flex flex-col gap-1 w-full">
                            <label for="phoneNumber" class="text-xl font-medium">Phone No.</label>
                            <input type="tel" v-model="phoneNo" :placeholder="getUser?.phoneNo || '9999999999'"
                                class="w-full bg-secondary-200 text-text-900 px-2 py-1 rounded">
                        </span>
                    </div>

                    <!-- save button  -->
                    <button type="submit" :disabled="isFormValid"
                        class="bg-primary-500 rounded px-4 py-1 text-xl text-accent-100 w-fit hover:bg-primary-600 hover:text-accent-200 transition-all duration-200 font-semibold disabled:cursor-not-allowed disabled:bg-blue-400">Save</button>
                </form>

                <!-- Left side div for image -->
                <div class="flex flex-col gap-3 mt-5 md:mt-0">
                    <img :src="profilePictureFile || profileUrl as string" alt="user-avatar"
                        class="rounded-full w-48 h-48 aspect-square object-cover">
                    <label for="profilePictureFile"
                        class="text-xl bg-gray-200 text-center cursor-pointer font-semibold text-gray-500 hover:bg-gray-300 rounded-full py-2">Change</label>
                    <input type="file" class="hidden" accept="image/*" id="profilePictureFile"
                        @change="changePicture" />
                </div>
            </div>
        </section>

        <!-- Provider services  -->
        <section v-if="activeValue == 'provider'">

            <div class="mt-10 my-2">
                <div class="flex flex-col justify-center sm:flex-row sm:justify-between gap-3">
                    <h1 class="text-3xl font-bold">Provider services</h1>
                    <select name="service" class="border border-black bg-gray-200 rounded-full px-10 py-1 max-w-fit"
                        @change="(e) => selectedService = (e.target as HTMLSelectElement).value">
                        <!-- <option value="services" v-if="!usedServices.length">Services</option> -->
                        <option v-for="usedService in usedServices" :value="usedService">{{ usedService
                        }}</option>
                        <option value="Add">Add Service++</option>
                    </select>
                </div>
                <hr class="mt-3">
                <div class="flex items-center space-x-4">
                    <ProviderAddService :userId="getUser?.id!"
                        v-if="selectedService == 'Add' || !usedServices.length" />
                    <ProviderServiceDetails v-else v-model="selectedService" />
                </div>
            </div>

        </section>

        <!-- Reviews -->
        <section v-if="activeValue == 'consumer'">
            <div class="mt-10 my-2 flex justify-between">
                <h1 class="text-3xl font-bold">Consumer Reviews</h1>
            </div>
            <hr>

            <div class="my-10">
                <ReviewSlider :reviews="ReviewStore().getConsumerReview" />
            </div>

        </section>
    </div>
</template>