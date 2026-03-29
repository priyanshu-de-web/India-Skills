<script setup>
import VideoItem from "@/components/VideoItem.vue";

const videos = [
    "video1",
    "video2",
    "video3",
    "video4",
    "video5",
    "video6",
    "video7",
    "video8",
];

</script>

<template>
    <div v-for="video in videos" :key="video" class="video-column">
        <video-item :name="video"></video-item>
    </div>
</template>

<style scoped>
.video-column {
    width: 50%;
    height: 50%;
    padding: 1rem;
}
</style>