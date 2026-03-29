<script setup>
import {useRoute} from "vue-router";
import {computed, onMounted, reactive, ref, watch} from "vue";

const route = useRoute();
const props = defineProps(["name"]);

const fullscreenRectInfo = {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
};
const boxRectInfo = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
};
const videoRectInfo = reactive({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
});
const $videoBox = ref(null);
const fullscreenClass = ref("");
const isAnimatingClass = ref("");
const videoSrc = ref("");
(async () => {
    videoSrc.value = (await import(`@/assets/video/${props.name}.mp4`)).default;
})()

const isCurrentPage = computed(() => {
    return props.name === route.params.videoId;
});
const visibleVideoClass = computed(() => {
    let visible = "hidden";

    if (!route.params.videoId) {
        visible = "visible";
    } else if (isCurrentPage.value) {
        visible = "visible";
    }

    return visible;
})
const linkPath = computed(() => {
    if (isCurrentPage.value) return {to: "index", params: {videoId: ""}}
    else return {to: "index", params: {videoId: props.name}};
})
const positionStyle = computed(() => {
    if (fullscreenClass.value !== "fullscreen") return {};

    return {
        left: videoRectInfo.left + "px",
        top: videoRectInfo.top + "px",
        width: videoRectInfo.width + "px",
        height: videoRectInfo.height + "px",
    }
})

const changePosition = (before, after) => {
    isAnimatingClass.value = "";

    Object.assign(videoRectInfo, before);

    setTimeout(() => {
        isAnimatingClass.value = "animating";

        Object.assign(videoRectInfo, after);
    }, 0);
}
const saveBoxRectInfo = () => {
    const {left, top, right, bottom} = $videoBox.value.getBoundingClientRect();
    boxRectInfo.left = left;
    boxRectInfo.top = top;
    boxRectInfo.width = right - left;
    boxRectInfo.height = bottom - top;
}
const freezeScroll = () => {
    document.body.classList.add("freeze");
}
const unfreezeScroll = () => {
    document.body.classList.remove("freeze");
}

watch(
    isCurrentPage,
    () => {
        if (isCurrentPage.value) {
            freezeScroll();
            saveBoxRectInfo();
            changePosition(boxRectInfo, fullscreenRectInfo);

            fullscreenClass.value = "fullscreen";
        } else {
            changePosition(fullscreenRectInfo, boxRectInfo);

            setTimeout(() => {
                unfreezeScroll();
                fullscreenClass.value = "";
            }, 300);
        }
    }
)

onMounted(() => {
    if (isCurrentPage.value) {
        freezeScroll();

        Object.assign(videoRectInfo, fullscreenRectInfo);

        fullscreenClass.value = "fullscreen";
    }
    saveBoxRectInfo()
})

</script>

<template>
    <div class="video-box" ref="$videoBox">
        <router-link :to="linkPath" class="video-item" :class="[visibleVideoClass, fullscreenClass, isAnimatingClass]"
                     :style="positionStyle">
            <video :src="videoSrc" loop muted autoplay ref="$video"></video>
        </router-link>
    </div>
</template>

<style scoped>
.video-box {
    width: 100%;
    aspect-ratio: 16/9;
}

.video-item {
    display: block;
    width: 100%;
    height: 100%;
    background: #aaa;
    transition: opacity .3s;
}

.video-item.hidden {
    opacity: 0;
}

.video-item.visible {
    opacity: 1;
}

.video-item.fullscreen {
    position: fixed;
    z-index: 2;
}

.video-item.animating {
    transition: left .3s, top .3s, width .3s, height .3s, opacity .3s;
}

video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>