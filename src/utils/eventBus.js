// import Vue from 'vue'
// export const eventBus = new Vue()

// import { createApp } from 'vue';
// const app = createApp({});
// // 创建一个空的 Vue 实例作为事件总线
// export const eventBus = app.config.globalProperties.$eventBus = {};

// eventBus.js
import mitt from 'mitt';

const eventBus = mitt();

export default eventBus;