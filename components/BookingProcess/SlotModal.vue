<script setup lang="ts">
import type { ProviderService, Slot } from '~/services/dataBase/schema/schemaTypes';
const { providerService } = defineProps<{
  providerService: ProviderService
}>()

const slots = ref(providerService.slots);

const selectedSlot = ref<Slot>();
const isSlotModalOpen = ref(false);
const isDetailsModalOpen = ref(false);
const selectedDate = useState<Date>('selectedDate')

const { createAAppointment } = useAppointment()

const router = useRouter()

function selectSlot(slot: Slot) {
  if (!UserStore().getIsAuthenticated) {
    router.push('/auth/login')
    return
  }
  selectedSlot.value = slot;
  isSlotModalOpen.value = false;
  isDetailsModalOpen.value = true
  const add = slot.time.split(" ")[1] == "PM" ? Number(slot.time.split(":")[0]) + 12 : Number(slot.time.split(":")[0]);
  selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), selectedDate.value.getDate(), add, 0, 0, 0);
}



async function confirmAppointment({ consumerDescription, consumerDocs }: {
  consumerDescription: string;
  consumerDocs: FileList | null;
}) {

  const appointmentDetailsObject = {
    bookedFor: providerService.id,
    category: providerService.category,
    subCategory: providerService.subCategory,
    slot: selectedSlot.value,
    bookedDate: selectedDate.value,
    documents: consumerDocs as unknown as string[],
    description: consumerDescription,
  }

  await createAAppointment(appointmentDetailsObject, providerService)

  isDetailsModalOpen.value = false;
  selectedSlot.value = undefined;
}


function check(slot: Slot): boolean {
  return checkSlotDisability(slot, selectedDate.value, providerService)
}

function handleClick() {
  if (UserStore().getUser?.id == providerService.userId) {
    onInfo("You can't book your own appointment")
    return
  }
  if (!selectedSlot.value) {
    if (UserStore().getUserRole == "provider") {
      onInfo("Switch your profile to consumer")
      return
    } else {
      isSlotModalOpen.value = true
    }
  }
}


</script>

<template>
  <div class="flex flex-col items-end">
    <!-- Button to open the slot modal or book appointment -->
    <button @click="handleClick"
      class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ">
      Select a Slot
    </button>

    <!-- Slot Modal -->
    <div v-if="isSlotModalOpen" class="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <!-- Slot Modal Content -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-lg w-full max-w-md overflow-hidden">
        <!-- Modal Header -->
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold">Select a time slot</h2>
        </div>

        <!-- Modal Body (Slots) -->
        <div class="p-4 grid grid-cols-2 gap-2">
          <button v-for="(slot, index) in slots" :key="index" @click="selectSlot(slot)" :disabled="check(slot)"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
            {{ slot.time }}
          </button>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 border-t border-gray-200 flex justify-end">
          <button @click="isSlotModalOpen = false"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Appointment Details Modal -->
    <BookingProcessAppointmentConfirmation v-if="isDetailsModalOpen" :selectedSlot="selectedSlot!"
      @close="isDetailsModalOpen = false, selectedSlot = undefined" @submit="confirmAppointment" />
  </div>
</template>