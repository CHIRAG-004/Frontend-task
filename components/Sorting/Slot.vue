<script setup lang="ts">
const props = defineProps<{
    time: string
}>()
const selectedTime = useState<string | null>("selectedTime", () => null)

</script>

<template>
    <div @click="selectedTime = selectedTime == time ? null : time" :class="{ 'bg-gray-300': selectedTime == time }">
        {{ props.time }}
    </div>
</template>