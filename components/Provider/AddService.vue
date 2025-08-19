<script setup lang="ts">
import type { Days, Image, ProviderService, Slot } from '~/services/dataBase/schema/schemaTypes';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps<{
    userId: string
}>()
const { createAService } = useProvider()
const categoryStore = CategoryStore()
const usedSlots = (ProviderServicesStore().getUsedSlots.map(slot => slot.time)) // getting used slot of a user
const categories = ref<string[]>(categoryStore.getCategories)
const category = ref<string>("") // selected category


const subCategories = ref<string[]>(categoryStore.getSubCategories)

const subCategory = ref<string>("") // selected subCategory

// default slots
const slots = ref<Slot[]>([{
    time: '8:00 AM',
    price: 200,
    selected: true,
},
{
    time: '9:00 AM',
    price: 200,
    selected: true,
},
{
    time: '10:00 AM',
    price: 200,
    selected: true,
},
{
    time: '11:00 AM',
    price: 200,
    selected: true,
},
{
    time: '12:00 PM',
    price: 200,
    selected: true,
},
{
    time: '1:00 PM',
    price: 200,
    selected: true,
},
{
    time: '2:00 PM',
    price: 200,
    selected: true,
},
{
    time: '3:00 PM',
    price: 200,
    selected: true,
},
{
    time: '4:00 PM',
    price: 200,
    selected: true,
},
{
    time: '5:00 PM',
    price: 200,
    selected: true,
},
{
    time: '6:00 PM',
    price: 200,
    selected: true,
},
{
    time: '7:00 PM',
    price: 200,
    selected: true,
},
])

// changing slots based on used slots
slots.value = slots.value.map(slot => {
    return {
        ...slot,
        selected: !usedSlots.includes(slot.time)
    }
})

const days: Days[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// default working days
const workingDays = ref<Days[]>(["Mon", "Tue", "Wed", "Thu", "Fri"])

const cancellationAvailability = ref<number>(24)
const businessDescription = ref<string>('')
const isUnavailable = ref<boolean>(false)
const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)
const businessDocuments = ref<string[]>([])
const businessAddress = ref<string>('')
const images = ref<Image[]>([])

// future booking availability 
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
const futureBookingAvailability = ref<number>(30)

// if isunavailable is true 
const unavailability = computed(() => {
    if (isUnavailable.value) {
        return [startDate.value, endDate.value] as Date[]
    }
    return null
})

/**
 * change working days
 * @param day selected day
 */
const toggleDay = (day: Days) => {
    if (workingDays.value.includes(day)) {
        workingDays.value = workingDays.value.filter(workingDay => workingDay !== day)
    } else {
        workingDays.value.push(day)
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

        // can only upload only 5 images
        if (images.value.length >= 5) {
            onInfo("You can only upload 5 images")
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
function deleteImage(image: Image) {
    images.value = images.value.filter(img => img.id !== image.id)
}

/**
 * create provider service
 */
async function add() {

    // checks from required fields
    if (category.value == "" || subCategory.value == "" || !slots.value.filter(slot => slot.selected).length) {
        onFailure('All fields are required.')
        return
    }

    // adding images into db one by one
    for (let image of images.value) {
        await useImage().addAImage(image) // add in db
        ImageStore().addImage(image) // add in image store
        businessDocuments.value.push(image.id) // add image in in servie details
    }


    try {
        const provider: ProviderService = {
            id: uuidv4(),
            userId: props.userId,
            category: category.value,
            subCategory: subCategory.value,
            slots: JSON.parse(JSON.stringify(slots.value.filter(slot => slot.selected))),
            workingDays: JSON.parse(JSON.stringify(workingDays.value)),
            cancellationAvailability: cancellationAvailability.value,
            businessDescription: businessDescription.value,
            businessDocuments: JSON.parse(JSON.stringify(businessDocuments.value)),
            businessAddress: businessAddress.value,
            futureBookingAvailability: futureBookingAvailability.value,
            unavailability: unavailability.value,
            status: "active",
        }
        // create a new provider service
        await createAService(provider)
        const providerIds = UserStore().getUser?.providerServicesIds || []

        // add provider service id in user details in db
        await useAppointment().updateUserDetails({ providerServicesIds: [...providerIds, provider.id] })

        // relading the window
        window.location.reload()
    } catch (error) {
        console.error(error)

    }
}
watchEffect(() => {

    // changing selected category and subcategory value
    if (category.value) {
        subCategories.value = categoryStore.getSubCategoriesByCategory(category.value)
        subCategory.value = subCategories.value[0]
    }
})

</script>

<template>
    <div class="w-full mt-8">

        <!-- service details form -->
        <form @submit.prevent="add">
            <div class="flex justify-between mt-4">
                <h2 class="text-2xl font-bold">Service details</h2>
                <div class="flex gap-4">
                    <div class="border border-black bg-gray-200 rounded-full text-center px-4 py-1 max-w-fit">status
                    </div>
                </div>
            </div>
            <hr class="mt-4">
            <div class="mt-7 flex flex-col sm:flex-row gap-4 sm:gap-20 text-xl  ">

                <!-- category selection -->
                <div>
                    <h3 class="text-xl font-semibold mb-2">
                        Select Category
                    </h3>
                    <CommonSearchableDropDown :data="categories" :placeHolderText="'Search categories...'"
                        :flag="'provider'" @selectedCategory="(value) => category = value" class="max-w-fit" />
                </div>

                <!-- subcategory selection -->
                <div class="">
                    <h3 class="text-xl font-semibold mb-2">
                        select sub-category
                    </h3>
                    <CommonSearchableDropDown :data="subCategories" :placeHolderText="'Search sub-categories...'"
                        :flag="'provider'" @selectedCategory="(value) => subCategory = value" class="max-w-fit" />
                </div>

            </div>
            <hr class="mt-4">

            <!-- slots selection -->
            <div class="mt-12">
                <h3 class="text-xl font-semibold">Slots</h3>
                <div class="grid sm:grid-cols-4 grid-cols-2 gap-4 p-6 max-w-fit">
                    <button v-for="slot in slots" :key="slot.time" @click="slot.selected = !slot.selected;"
                        type="button" class="p-4 rounded-lg border border-black"
                        :class="slot.selected ? 'bg-gray-200 text-black' : ''"
                        :disabled="usedSlots.includes(slot.time)">
                        <span class="font-bold">{{ slot.time }}</span>
                        <input v-if="slot.selected" v-model="slot.price" type="number"
                            class="ml-2 px-2 py-1 w-16 text-black border border-black rounded" @click.stop />
                    </button>
                </div>
                <p v-if="!slots.filter(slot => slot.selected).length" class="text-red-500 text-xl">you should atleast
                    select one slot</p>
            </div>
            <hr class="mt-4">

            <!--  working days selection -->
            <div class="mt-12">
                <h3 class="text-xl font-semibold">Working days</h3>
                <div class="sm:flex grid grid-cols-3 gap-2 mt-4 max-w-fit">
                    <button type="button" v-for="day in days" :key="day" @click="toggleDay(day)"
                        class="px-4 py-3 rounded-lg max-w-20 text-[20px] font-medium border border-black"
                        :class="{ 'bg-gray-300': workingDays.includes(day) }">{{ day }}</button>

                </div>
                <p v-if="!workingDays.length" class="text-red-500 text-xl">you should atleast select one
                    day</p>
            </div>
            <hr class="mt-4">

            <!-- cancellation availability selection  -->
            <div class="mt-12">
                <h3 class="text-xl font-semibold">Cancellation availability</h3>
                <div class="mt-4">
                    <input type="text" class="border border-black rounded-md px-2 py-1 max-w-20 mr-4"
                        v-model="cancellationAvailability">
                    <span class="font-bold">Hours</span>
                </div>
            </div>
            <hr class="mt-4">

            <!-- future booking availability selection  -->
            <div class="mt-12">
                <h3 class="text-xl font-semibold">Future booking availability</h3>
                <div class="sm:flex grid grid-cols-2 gap-4 mt-4 max-w-fit">
                    <button type="button" v-for="option in bookings" :key="option.label" :class="[
                        'px-6 py-2 rounded-lg border cursor-pointer transition-all',
                        {
                            'bg-gray-200 text-black font-semibold': futureBookingAvailability === option.value,
                            'bg-white text-gray-700': futureBookingAvailability !== option.value
                        }
                    ]" @click="futureBookingAvailability = option.value">
                        {{ option.label }}
                    </button>
                </div>
            </div>
            <hr class="mt-4">

            <!-- unavailability selection  -->
            <div class="mt-12">
                <label class="text-xl font-semibold mr-4">Unavailability</label>
                <input type="checkbox" name="" v-model="isUnavailable">
                <div v-if="isUnavailable" class="mt-4 flex sm:flex-row flex-col sm:gap-10 gap-5">
                    <div>
                        <label class="mr-2 text-[20px] font-semibold">from</label>
                        <input type="datetime-local" name="" v-model="startDate"
                            class="border border-black px-2 rounded-sm" :min="new Date().toISOString().slice(0, 16)"
                            :max="new Date(new Date().getTime() + (90 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 16)"
                            required>
                    </div>
                    <div>
                        <label class="mr-2 text-[20px] font-semibold">to</label>
                        <input type="datetime-local" name="" v-model="endDate"
                            class="border border-black px-2 rounded-sm" :min="new Date().toISOString().slice(0, 16)"
                            :max="new Date(new Date().getTime() + (90 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 16)"
                            :disabled="!startDate" required>
                    </div>
                </div>
            </div>
            <hr class="mt-4">

            <!-- service address  -->
            <div class="mt-12">
                <h3 class="text-xl font-semibold">Your service address</h3>
                <textarea cols="30" rows="5" class="border border-black rounded-md p-2 mt-4" v-model="businessAddress"
                    required></textarea>
            </div>
            <hr class="mt-4">

            <!-- service description  -->
            <div class="mt-4">
                <h3 class="text-xl font-semibold">Service description</h3>
                <textarea cols="30" rows="10" class="border border-black rounded-md p-2 mt-4"
                    v-model="businessDescription" required></textarea>
            </div>
            <hr class="mt-4">

            <!-- certificates upload section  -->
            <div class="mt-12">
                <h3 class="text-xl font-semibold">Certifications</h3>
                <input type="file" class="mt-4" @change="handleFileUpload" multiple />
                <ul class="mt-2 sm:flex gap-6 overflow-x-auto grid grid-cols-2 max-w-fit">
                    <li v-for="(file, index) in images" :key="index" class="relative text-sm max-w-fit">
                        <div class="absolute text-red-500 right-0 rounded-full text-2xl cursor-pointer"
                            @click="deleteImage(file)">
                            <Icon name="akar-icons:cross" />
                        </div>
                        <img :src="createImageUrl(file.image)" alt=""
                            class="w-32 h-32 rounded-lg object-cover shadow-md">
                    </li>
                </ul>
            </div>

            <button class="bg-primary-500 text-white text-2xl rounded-lg px-4 py-2 mt-12" type="submit">Add</button>
        </form>
    </div>
</template>