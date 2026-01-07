<template>
    <div class="member-zone-root">
        <!-- 你可以在这里加头部、导航等其它内容 -->
        <div class="member-zone-content">
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
            videoType: "VIP"
        }
    }
}
</script>

<style scoped>
.member-zone-root {
    height: 90vh;
    display: flex;
    flex-direction: column;
    background: transparent;
}

.member-zone-content {
    flex: 1;
    min-height: 0;
    /* 关键：让子元素撑满且可滚动 */
    display: flex;
    flex-direction: column;
}
</style>