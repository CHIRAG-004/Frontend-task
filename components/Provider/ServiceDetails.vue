<script setup lang="ts">
import type { Days, Image, ProviderService, Slot } from '~/services/dataBase/schema/schemaTypes';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from 'vue-toastification';

// selected service subcategory
const props = defineProps<{
    modelValue: string
}>()
const { updateAService } = useProvider()
const providerServicesStore = ProviderServicesStore()
const imageStore = ImageStore()

// getting service details by using category 
const service = ref<ProviderService>(providerServicesStore.getServiceBySubCategory(props.modelValue)) 
const { getImageById, deleteAImage, addAImage } = useImage()
const usedSlots = ref<string[]>(providerServicesStore.getUsedSlots.map(slot => slot.time)) // used slots of a user

const days: Days[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const isUnavailable = ref<boolean>(service.value.unavailability ? true : false)
const startDate = ref<Date | null>(service.value.unavailability ? service.value.unavailability[0] : null)
const endDate = ref<Date | null>(service.value.unavailability ? service.value.unavailability[1] : null)

const images = ref<Image[]>([])

// add images from services details one by one
for (let docId of service.value.businessDocuments) {
    images.value.push(imageStore.getAImage(docId)!) // getting image from image id an adding into images
}
const bookings = [
    {
        label: "1 Week",
        value: 7
    },
    {
        label: "2 Weeks",
        value: 14
    },
    {
        label: "1 Month",
        value: 30
    },
    {
        label: "2 Months",
        value: 60
    },
    {
        label: "3 Months",
        value: 90
    }
];

const defaultSlots = [{
    time: '8:00 AM',
    price: 200,
    selected: false,
},
{
    time: '9:00 AM',
    price: 200,
    selected: false,
},
{
    time: '10:00 AM',
    price: 200,
    selected: false,
},
{
    time: '11:00 AM',
    price: 200,
    selected: false,
},
{
    time: '12:00 PM',
    price: 200,
    selected: false,
},
{
    time: '1:00 PM',
    price: 200,
    selected: false,
},
{
    time: '2:00 PM',
    price: 200,
    selected: false,
},
{
    time: '3:00 PM',
    price: 200,
    selected: false,
},
{
    time: '4:00 PM',
    price: 200,
    selected: false,
},
{
    time: '5:00 PM',
    price: 200,
    selected: false,
},
{
    time: '6:00 PM',
    price: 200,
    selected: false,
},
{
    time: '7:00 PM',
    price: 200,
    selected: false,
},
]

// creating slots using default slots and already available slots in service
const slots = ref<Slot[]>(defaultSlots.map(slot => slot.time == service.value.slots.find(s => s.time === slot.time)?.time ? service.value.slots.find(s => s.time === slot.time)! : slot))

// already used slots bu this service
let usedSlotsByService: string[] = service.value.slots.filter(slot => slot.selected).map(slot => slot.time)

const unavailability = computed(() => {
    if (isUnavailable.value) {
        return [startDate.value, endDate.value] as Date[]
    }
    return null
})

const selectedAppointmentCategory = ref('upcoming')
const appointments = ref()

/**
 * change working days
 * @param day selected day
 */
const toggleDay = (day: Days) => {
    if (service.value.workingDays.includes(day)) {
        service.value.workingDays = service.value.workingDays.filter(workingDay => workingDay !== day)
    } else {
        service.value.workingDays.push(day)
    }
};

/**
 * add event image in images 
 * @param event event from input tag
 */
const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        const file: File = target.files[0]
        // can only upload 5 images
        if(images.value.length >= 5){
            useToast().info("You can only upload 5 images")
            return 
        }
        images.value.push({
            id: uuidv4(),
            image: file
        })

    }
};

/**
 * create an url of image 
 * @param image image of File type
 */
function createImageUrl(image: File) {
    return URL.createObjectURL(image)
}

/**
 * removing image from images
 * @param image image of Image type
 */
async function deleteImage(image: Image) {
    images.value = images.value.filter(img => img.id !== image.id)
}

const isOpen = ref<boolean>(false)
function handleUnavailability() {
    const bookedDates = providerServicesStore.getAllBookedDates
    bookedDates.forEach(date => {
        if (date.getTime() > (new Date(startDate.value!)).getTime() && date.getTime() < (new Date(endDate.value!)).getTime()!) {
            isOpen.value = true
        }
    })

}

// updating service details in db
async function save() {

    // new images data
    const newImagesIds = images.value.map(img => img.id)

    // removed images
    const deletableImageIds = service.value.businessDocuments.filter(id => !newImagesIds.includes(id))
    for (let id of deletableImageIds) {
        await deleteAImage(id) // deleting images from db
        imageStore.deleteImage(id) // deleting image from image store

        // removing image id from service details
        service.value.businessDocuments = service.value.businessDocuments.filter(imgId => imgId !== id)
    }

    // images that are newly added
    const addAbleImages = images.value.filter(img => !service.value.businessDocuments.includes(img.id))
    for (let image of addAbleImages) {
        await addAImage(image) // add image in db
        imageStore.addImage(image) // add image in image store
        service.value.businessDocuments.push(image.id) // add image id in service details
    }


    try {
        // updated service details
        const provider: Partial<ProviderService> = {
            slots: JSON.parse(JSON.stringify(slots.value.filter(slot => slot.selected))),
            workingDays: JSON.parse(JSON.stringify(service.value.workingDays)),
            cancellationAvailability: service.value.cancellationAvailability,
            businessDescription: service.value.businessDescription,
            businessDocuments: JSON.parse(JSON.stringify(service.value.businessDocuments)),
            businessAddress: service.value.businessAddress,
            futureBookingAvailability: service.value.futureBookingAvailability,
            unavailability: unavailability.value,
            status: service.value.status,
        }

        // updating service details in db
        await updateAService(service.value.id, provider)

        // updating service details in provider service store
        providerServicesStore.updateService({ ...service.value, ...provider })
        useToast().success("Service details updated.")
    } catch (error) {
        console.error(error)
    }
}

watchEffect(() => {
    appointments.value = AppointmentStore().getUpcomingAppointments("provider", props.modelValue)
})

watch([props, selectedAppointmentCategory], async () => {

    // updating service based on selected catory or subcategory
    service.value = providerServicesStore.getServiceBySubCategory(props.modelValue)

    // cahnging slots value based on new service
    slots.value = defaultSlots.map(slot => slot.time == service.value.slots.find(s => s.time === slot.time)?.time ? service.value.slots.find(s => s.time === slot.time)! : slot)
    usedSlotsByService = service.value.slots.filter(slot => slot.selected).map(slot => slot.time)
    for (let docId of service.value.businessDocuments) {
        images.value.push((await getImageById(docId))!)
    }
    if (selectedAppointmentCategory.value == "upcoming") {
        appointments.value = AppointmentStore().getUpcomingAppointments('provider', props.modelValue)
    } else if (selectedAppointmentCategory.value == "completed") {
        appointments.value = AppointmentStore().getAppointmentsByStatus("completed", 'provider', props.modelValue)
    } else if (selectedAppointmentCategory.value == "cancelled") {
        appointments.value = AppointmentStore().getAppointmentsByStatus('cancelled', 'provider', props.modelValue)
    } else {
        appointments.value = AppointmentStore().getAllAppointments('provider', props.modelValue)
    }
})

</script>

<template>
    <div class="w-full">
        <!-- appointment section -->
        <section>
            <div class="mt-10 my-2 flex flex-col md:flex-row justify-between">
                <h1 class="text-3xl font-bold">My {{ selectedAppointmentCategory }} Appointments</h1>
                <select name="appointmentFilter" id="appointmentFilter"
                    class="bg-primary-100 text-accent-800 font-medium rounded px-2 py-1 mt-4 md:mt-0"
                    v-model="selectedAppointmentCategory">
                    <option value="upcoming" selected>Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="all">All</option>
                </select>
            </div>
            <hr>

            <div class="my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <h1 v-if="appointments.length < 1" class="text-2xl font-semibold">No Appointment</h1>
                <AppointmentCard v-if="selectedAppointmentCategory !== 'all'" v-for="appointment in appointments"
                    :key="appointment.id" :appointment="appointment" />
            </div>
            <AppointmentTable v-if="selectedAppointmentCategory == 'all' && appointments.length > 0"
                :appointments="appointments" />
        </section>


        <form @submit.prevent="save" class="mt-12">
            <div class="flex justify-between">
                <h2 class="text-2xl font-bold">Service details</h2>
                <div class="border border-black bg-gray-200 rounded-full text-center px-4 py-1 max-w-fit">{{
                    service.status }}</div>
            </div>
            <hr class="mt-2">
            <div class="mt-7 flex flex-col sm:flex-row gap-4 sm:gap-20 text-xl font-semibold">
                <div class="flex gap-2">
                    <h3 class="text-xl font-semibold">
                        Category:-
                    </h3>
                    <h4 class="">{{ service.category }}</h4>
                </div>
                <div class="flex gap-2">
                    <h3>
                        Sub-category
                    </h3>
                    <h4>{{ service.subCategory }}</h4>
                </div>
            </div>

            <div class="mt-12">
                <h3 class="text-xl font-semibold">Slots</h3>

                <div class="grid sm:grid-cols-4 grid-cols-2 gap-4 p-6 max-w-fit">
                    <button v-for="slot in slots" :key="slot.time" @click="slot.selected = !slot.selected;"
                        type="button" class="p-4 rounded-lg border border-black"
                        :class="slot.selected ? 'bg-gray-200 text-black' : ''"
                        :disabled="usedSlots.includes(slot.time) && !usedSlotsByService.includes(slot.time)">
                        <span class="font-bold">{{ slot.time }}</span>
                        <input v-if="slot.selected" v-model="slot.price" type="number"
                            class="ml-2 px-2 py-1 w-16 text-black border border-black rounded" @click.stop />
                    </button>
                </div>
                <p v-if="!service.slots.filter(slot => slot.selected).length" class="text-red-500 text-xl">you should
                    atleast
                    select one slot</p>
            </div>
            <div class="mt-12">
                <h3 class="text-xl font-semibold">Working days</h3>

                <div class="sm:flex grid grid-cols-3 gap-2 mt-4 max-w-fit">
                    <button type="button" v-for="day in days" :key="day" @click="toggleDay(day)"
                        class="px-4 py-3 rounded-lg max-w-20 text-[20px] font-medium border border-black"
                        :class="{ 'bg-gray-300': service.workingDays.includes(day) }">{{
                            day }}</button>

                </div>
                <p v-if="!service.workingDays.length" class="text-red-500 text-xl">you should atleast
                    select one
                    day</p>
            </div>

            <div class="mt-12">
                <h3 class="text-xl font-semibold">Cancellation availability</h3>

                <div class="mt-4">
                    <input type="number" class="border border-black rounded-md px-2 py-1 max-w-20 mr-4"
                        v-model="service.cancellationAvailability">
                    <span class="font-bold">Hours</span>
                </div>
            </div>

            <div class="mt-12">
                <h3 class="text-xl font-semibold">Future booking availability</h3>

                <div class="sm:flex grid grid-cols-2 gap-4 mt-4 max-w-fit">
                    <button type="button" v-for="option in bookings" :key="option.label" :class="[
                        'px-6 py-2 rounded-lg border cursor-pointer transition-all max-w-32 font-medium',
                        {
                            'bg-gray-200 text-black font-semibold': service.futureBookingAvailability === option.value,
                            'bg-white text-gray-700': service.futureBookingAvailability !== option.value
                        }
                    ]" @click="service.futureBookingAvailability = option.value">
                        {{ option.label }}
                    </button>
                </div>
            </div>

            <div class="mt-12">
                <label class="text-xl font-semibold mr-4">Unavailability</label>
                <input type="checkbox" name="" v-model="isUnavailable">

                <div v-if="isUnavailable" class="mt-4 flex sm:flex-row flex-col sm:gap-10 gap-5">
                    <div>
                        <label class="mr-2 text-[20px] font-semibold">from:-</label>
                        <input type="datetime-local" class="border border-black px-2 rounded-sm" v-model="startDate"
                            :min="new Date().toISOString().slice(0, 16)"
                            :max="new Date(new Date().getTime() + (90 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 16)"
                            required>
                    </div>
                    <div>
                        <label class="mr-2 text-[20px] font-semibold">to</label>
                        <input type="datetime-local" class="border border-black px-2 rounded-sm"v-model="endDate"
                            :min="new Date().toISOString().slice(0, 16)"
                            :max="new Date(new Date().getTime() + (90 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 16)"
                            :disabled="!startDate" @change="handleUnavailability" required>
                    </div>
                </div>
                <CommonConfirmationModal :is-open="isOpen" @close="isOpen = false" @confirm="startDate = null; endDate = null"
                    title="Select dates" message="You already have booked appointment between these time limits." />
            </div>

            <div class="mt-12">
                <h3 class="text-xl font-semibold">Your service address</h3>

                <textarea cols="30" rows="5" class="border border-black rounded-md p-2 mt-4"
                    v-model="service.businessAddress" required></textarea>
            </div>

            <div class="mt-12">
                <h3 class="text-xl font-semibold">Service description</h3>

                <textarea class="border border-black rounded-md p-2 mt-4" v-model="service.businessDescription"
                    required></textarea>
            </div>

            <div class="mt-12">
                <h3 class="text-xl font-semibold ">Certifications</h3>

                <input type="file" class="mt-4" @change="handleFileUpload" multiple />
                <ul class="mt-2 sm:flex gap-6 overflow-x-auto grid grid-cols-2 max-w-fit">
                    <li v-for="(file, index) in images" :key="index" class="relative text-sm max-w-fit">
                        <div class="absolute bg-gray-300 right-0 rounded-full text-2xl cursor-pointer"
                            @click="deleteImage(file)">X</div>
                        <img :src="createImageUrl(file.image)" alt=""
                            class="w-32 h-32 rounded-lg object-cover shadow-md">
                    </li>
                </ul>
            </div>

            <button class="bg-primary-500 text-white text-2xl rounded-lg py-2 px-4 mt-12" type="submit">save</button>
        </form>

        <!-- Reviews -->
        <section>
            <div class="mt-10 my-2 flex justify-between">
                <h1 class="text-3xl font-bold">Provider Reviews</h1>
            </div>
            <hr>

            <div class="my-10">
                <ReviewSlider :reviews="ReviewStore().getReviewByServiceID(service.id)" />
            </div>

        </section>

    </div>
</template>