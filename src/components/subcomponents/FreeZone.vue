<template>
    <div class="free-zone-root">
        <!-- 可以在这里加头部、导航等其它内容 -->
        <div class="free-zone-content">
            <VideoList :video-type="videoType" />
        </div>
    </div>
</template>

<script>
import VideoList from './VideoList.vue';
export default {
    components: { VideoList },
    data() {
        return {
            videoType: "免费"
        }
    }
}
</script>

<style scoped>
.free-zone-root {
    height: 90vh;
    display: flex;
    flex-direction: column;
    background: transparent;
}

.free-zone-content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}
</style>