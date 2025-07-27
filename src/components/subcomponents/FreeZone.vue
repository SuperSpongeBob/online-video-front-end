<template>
    <div class="free-zone-root">
        <!-- 可以在这里加头部、导航等其它内容 -->
        <div class="free-zone-content">
            <VideoList :video-is-vip="videoIsVip" />
        </div>
    </div>
</template>

<script>
import VideoList from './VideoList.vue';
export default {
    components: { VideoList },
    data() {
        return {
            videoIsVip: "1"
        }
    }
}
</script>

<style scoped>
.free-zone-root {
    height: 90vh;
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
}

.free-zone-content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}
</style>