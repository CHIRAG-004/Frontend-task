<script setup lang="ts">
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const props= defineProps<{
  isOpen: boolean
}>()

const months = ref<string[]>([]);
const days = ref<Month[]>([]);
const currentMonth = ref(MONTHS[new Date().getMonth()]);
const currentYear = ref(new Date().getFullYear());
const selectedMonth = ref(currentMonth.value);


const selectedDate = useState<Date | null>("selectedDate", () => null);

onMounted(() => {
  const currentDate = new Date();
  selectedDate.value = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
})


function getMonths(startMonth: number, endMonth: number) {
  for (let index = startMonth; index <= endMonth; index++) {
    months.value.push(MONTHS[index % 12]);
  }
}

getMonths(new Date().getMonth(), new Date().getMonth() + 3);


watchEffect(() => {
  if (
    new Date().getMonth() > 8 &&
    (MONTHS.indexOf(selectedMonth.value) == 0 ||
      MONTHS.indexOf(selectedMonth.value) == 1 ||
      MONTHS.indexOf(selectedMonth.value) == 2)
  ) {
    currentYear.value = currentYear.value + 1;
  } else {
    currentYear.value = new Date().getFullYear();
  }

  days.value = useCalendar(
    currentYear.value,
    MONTHS.indexOf(selectedMonth.value) + 1
  );
});


function selectionHandler(day: Month) {
  days.value.forEach((d) => (d.isSelected = false));
  day.isSelected = true;
  selectedDate.value = new Date(
    currentYear.value,
    MONTHS.indexOf(day.month),
    day.date
  );
}
onUnmounted(() => selectedDate.value = null)
</script>

<template>
  <div class="w-full relative max-w-[362px]">
    <div
      class="flex w-fit sm:w-full justify-between items-center p-2 border border-gray-300 rounded-md cursor-pointer bg-secondary-100 hover:border-gray-400">
      <h2 class="text-sm">
        <span>{{ selectedDate?.getDate() }} {{ selectedMonth }}
          {{ currentYear }}</span>
      </h2>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
      </svg>
    </div>

    <!-- Date Picker Dropdown -->
    <div v-show="isOpen" class="lg:w-full w-[265px] absolute lg:static left-0 z-50 sm:right-1  2xl:right-0  mt-2 border border-gray-300 rounded-md bg-secondary-100 shadow-lg">
      <!-- Month and Year Selector -->
      <div class="flex justify-between items-center p-2 border-b border-gray-300 text-text-900">
        <select v-model="selectedMonth" class="p-1 border border-gray-300 rounded-md text-sm">
          <option v-for="(month, index) in months" :key="index" :value="month">
            {{ month }}
          </option>
        </select>
        <h1 class="text-sm font-semibold">{{ currentYear }}</h1>
      </div>

      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 text-center text-sm text-text-900 font-semibold p-2 border-b border-gray-300">
        <div v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day">
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-1 p-2">
        <div v-for="(day, dayIdx) in days" :key="dayIdx"
          class="flex justify-center hover:rounded-full items-center w-9 h-9 p-1" :class="{
            'text-gray-400 cursor-not-allowed': !day.isCurrentMonth,
            'bg-blue-500 text-white hover:bg-blue-500 rounded-full':
              day.isSelected,
            'hover:bg-blue-100': day.isCurrentMonth && !day.isSelected,
            'bg-blue-200 rounded-full': day.isToday,
          }">
          <button type="button" :disabled="!day.isCurrentMonth" @click="selectionHandler(day)"
            class="w-8 h-8 flex justify-center items-center disabled:hover:bg-transparent">
            {{ day.date }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>