<template>
    <div>
        <VideoList :video-is-vip="videoIsVip"></VideoList>
    </div>
</template>

<script>
import VideoList from './VideoList.vue';
export default{
    components:{VideoList},
    data(){
        return {
            videoIsVip:"1"
        }
    }
}
</script>