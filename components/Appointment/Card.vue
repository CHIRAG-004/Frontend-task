<script setup lang="ts">
import type { Appointment, User } from '~/services/dataBase/schema/schemaTypes';

interface NewAppointment extends Appointment {
    data?: Partial<User> & { cancellationAvailability: number };
}

const data = ref<Partial<User>>({});
const { appointment } = defineProps<{ appointment: NewAppointment }>();
const profilePictureUrl = ref<string>();
const isOpen = ref(false);

watchEffect(() => {
    data.value = appointment.data!
    profilePictureUrl.value = typeof data.value?.profilePicture === "string"
        ? data.value.profilePicture
        : data.value?.profilePicture instanceof File
            ? URL.createObjectURL(data.value.profilePicture)
            : "";
});
</script>

<template>
    <div class="max-w-[450px] w-full hover:cursor-pointer hover:shadow-2xs transition-all duration-200 flex flex-col gap-4 sm:gap-6 bg-gradient-to-r from-primary-500/85 to-primary-400 p-4 text-accent-300 rounded-lg shadow-md"
        @click="() => isOpen = true">
        <!-- Date and Status Section -->
        <div class="flex flex-col gap-3 sm:gap-5">
            <div class="flex  justify-between items-center gap-2 sm:gap-0">
                <span class="text-2xl sm:text-3xl font-semibold">
                    <h1>
                        {{
                            typeof appointment.bookedDate == "string"
                                ? new Date(appointment.bookedDate).toDateString()
                                : appointment.bookedDate.toDateString()
                        }}
                    </h1>
                    <h1 class="text-xl sm:text-2xl">
                        {{ appointment.slot.time }}
                    </h1>
                </span>
                <h3 class="text-sm sm:text-md rounded-xl font-medium px-3 py-1" :class="{
                    'bg-red-200/80 text-red-700 backdrop-blur-sm': appointment.status === 'cancelled by consumer' || appointment.status === 'cancelled by provider',
                    'bg-green-200/80 text-green-700 backdrop-blur-sm': appointment.status === 'completed',
                    'bg-yellow-200/80 text-yellow-700 backdrop-blur-sm': appointment.status === 'booked'
                }">
                    {{ appointment.status }}
                </h3>
            </div>

            <!-- Category and Subcategory -->
            <div class="flex gap-1 items-center text-lg sm:text-xl font-semibold">
                <h2>{{ appointment.category }}</h2>
                <h3>({{ appointment.subCategory }})</h3>
            </div>
        </div>

        <!-- User and Price Section -->
        <div class="flex  items-center justify-between gap-3 sm:gap-0">
            <div class="flex gap-2 sm:gap-3 items-center">
                <img :src="profilePictureUrl" alt="user-avatar" class="w-8 h-8 rounded-full">
                <p class="text-lg sm:text-xl font-medium">
                    {{ data.firstName }} {{ data.lastName }}
                </p>
            </div>

            <h2 class="text-lg sm:text-xl font-semibold">{{ appointment.slot.price }} ₹</h2>
        </div>

        <!-- Modal -->
        <AppointmentDetails :isOpen="isOpen" @close="() => isOpen = false" :appointment="appointment" />
    </div>
</template>