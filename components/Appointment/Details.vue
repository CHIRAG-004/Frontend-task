<script setup lang="ts">
import { useToast } from 'vue-toastification';
import type { User } from '~/services/dataBase/schema/schemaTypes';
import type { Appointment } from '~/services/dataBase/schema/schemaTypes';

const { cancelAppointment } = useAppointment();

interface NewAppointment extends Appointment {
    data?: Partial<User> & { cancellationAvailability: number }
}

const toast = useToast();
const props = defineProps<{
    isOpen: boolean;
    appointment: NewAppointment;
}>();

const emit = defineEmits(['close']);

const showModal = ref(false);
const imagePreview = ref();
const showImage = ref(false)

const closeModal = () => {
    emit('close');
};

async function handleConfirm() {
    await cancelAppointment(props.appointment);
    toast.success('Appointment cancelled');
    closeModal();
}

function createUrl(docId: string): string {
    const image: File = ImageStore().getAImage(docId)?.image!;
    return URL.createObjectURL(image);
}

function clickHandler(e: Event) {
    const link = (e.target as HTMLImageElement).src;
    showImage.value = true
    imagePreview.value = link;
}

function handleCancleClick() {
    if (props.appointment.data?.cancellationAvailability! < (new Date(props.appointment.bookedDate).getTime() - new Date().getTime()) / (1000 * 60 * 60)) {
        showModal.value = true
    } else useToast().info("cancellation Availability Exceeds")
}
</script>

<template>
    <!-- Image Preview Modal -->
    <div v-if="showImage"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-xs bg-opacity-50">
        <div class=" rounded-lg p-4 max-w-[90vw] max-h-[90vh] overflow-hidden">
            <img :src="imagePreview" alt="Preview" class="object-cover" />
        </div>
        <button @click="showImage = false" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Close Preview
        </button>
    </div>

    <!-- Appointment Details Modal -->
    <div v-if="props.isOpen" class="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-xs">
        <div class="bg-white rounded-lg shadow-xl p-6 w-[90vw] max-w-3xl">
            <!-- Modal Body -->
            <div class="flex flex-col gap-4 mb-6">
                <h1 class="text-2xl flex justify-between items-center font-bold text-gray-800">
                    <span>Appointment Details</span>
                    <span class="text-red-600 cursor-pointer" @click.stop="closeModal">
                        <Icon name="akar-icons:cross" />
                    </span>
                </h1>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="text-lg font-medium text-gray-700 space-y-2">
                        <p>Date & Time</p>
                        <p>Status</p>
                        <p>Category & Sub-Category</p>
                        <p>{{ appointment.data?.role == 'consumer' ? 'Provider' : 'Consumer' }} Contact Information</p>
                        <p>Payment Information</p>
                        <p>cancellation Availability</p>
                    </div>
                    <div class="text-lg font-normal text-gray-600 space-y-2">
                        <p>{{ appointment.bookedDate.toLocaleString().split(", ")[0] }}, {{ appointment.slot.time }}</p>
                        <p>{{ appointment.status }}</p>
                        <p>{{ appointment.category }}, {{ appointment.subCategory }}</p>
                        <p>{{ appointment.data?.email }} {{ appointment.data?.phoneNo && ',' + appointment.data?.phoneNo
                        }}</p>
                        <p>{{ appointment.slot.price }} ₹</p>
                        <p>{{ appointment.data?.cancellationAvailability }} hours</p>
                    </div>

                    <div class="flex gap-2 flex-wrap">
                        <img v-for="docId in appointment.documents" :key="docId" :src="createUrl(docId)" alt="Document"
                            class="w-24 h-24 rounded-lg object-cover shadow-md cursor-pointer" @click="clickHandler" />
                    </div>
                </div>

                <div class="mt-4">
                    <CommonConfirmationModal :isOpen="showModal" :title="'Do you want to cancel the appointment?'"
                        :message="'If you cancel the appointment, you may have to pay some charges.'"
                        @confirm="handleConfirm" @close="() => showModal = false" class="z-50" />
                    <button v-if="appointment.status == 'booked'"
                        class="w-fit px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                        @click="() => handleCancleClick()">
                        Cancel Appointment
                    </button>

                    <div v-else-if="appointment.status == 'completed'">
                        <ReviewCreationModal :appointment="appointment" :providerId="appointment.data?.id" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>