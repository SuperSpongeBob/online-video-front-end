<template>
    <div id="particle-container"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { loadFull } from "tsparticles";
import { tsParticles } from "tsparticles-engine";
import eventBus from '../utils/eventBus';

// const isParticlesRunning = ref(true)
// 从 localStorage 中获取开关状态，默认为 false
const isParticlesRunning = ref(localStorage.getItem('switch') === null ? false : localStorage.getItem('switch') === 'true');

let particlesInstance;

const particlesInit = async () => {
    await loadFull(tsParticles);
    particlesInstance = await tsParticles.load("particle-container", {
        // Particle configuration here
        background: {
            color: "#FFF",
        },
        fpsLimit: 60,
        interactivity: {
            detectsOn: "canvas",
            events: {
                resize: true,
                // 添加鼠标悬停事件
                onHover: {
                    enable: true,
                    mode: "grab", // 鼠标悬停时粒子会被吸引
                },
                // 添加鼠标点击事件
                onClick: {
                    enable: true,
                    mode: "push", // 鼠标点击时会推出新粒子
                },
            },
            modes: {
                // 鼠标悬停模式配置
                grab: {
                    distance: 200, // 吸引距离
                    line_linked: {
                        opacity: 1
                    }
                },
                // 鼠标点击模式配置
                push: {
                    particles_nb: 2 // 点击时推出的粒子数量
                }
            }
        },
        particles: {
            number: {
                value: 150,
                density: {
                    enable: true,
                    value_area: 800,
                },
            },
            color: {
                value: "#888888",
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000",
                },
                polygon: {
                    nb_sides: 5,
                },
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false,
                },
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false,
                },
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#888888",
                opacity: 0.4,
                width: 1,
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200,
                },
            },
        },
    });
    isParticlesRunning.value = true
};

const handleCloseParticles = () => {
    if (particlesInstance) {
        particlesInstance.destroy();
        isParticlesRunning.value = false;
        localStorage.setItem('switch', 'false')
    }
};
const handleOpenParticles = async () => {
    if (!isParticlesRunning.value) {
        await particlesInit();
        localStorage.setItem('switch', 'true')
    }
};

onMounted(async () => {
    if (isParticlesRunning.value) {
        await particlesInit()
    }
    eventBus.on('close-particles', handleCloseParticles);
    eventBus.on('open-particles', handleOpenParticles);
});

onUnmounted(() => {
    eventBus.off('close-particles', handleCloseParticles);
    eventBus.off('open-particles', handleOpenParticles);
});
</script>


<!-- <template>
    <div id="particle-container"></div>
</template>

<script>
import { onMounted } from 'vue';
import { loadFull } from "tsparticles";
import { tsParticles } from "tsparticles-engine";

export default {
    name: 'ParticleBackground',
    setup() {
        onMounted(() => {
            const particlesInit = async () => {
                await loadFull(tsParticles);
                tsParticles.load("particle-container", {
                    // Particle configuration here
                    background: {
                        color: "#FFF",
                    },
                    fpsLimit: 60,
                    interactivity: {
                        detectsOn: "canvas",
                        events: {
                            resize: true,
                            // 添加鼠标悬停事件
                            onHover: {
                                enable: true,
                                mode: "grab", // 鼠标悬停时粒子会被吸引
                            },
                            // 添加鼠标点击事件
                            onClick: {
                                enable: true,
                                mode: "push", // 鼠标点击时会推出新粒子
                            },
                        },
                        modes: {
                            // 鼠标悬停模式配置
                            grab: {
                                distance: 200, // 吸引距离
                                line_linked: {
                                    opacity: 1
                                }
                            },
                            // 鼠标点击模式配置
                            push: {
                                particles_nb: 2 // 点击时推出的粒子数量
                            }
                        }
                    },
                    particles: {
                        number: {
                            value: 150,
                            density: {
                                enable: true,
                                value_area: 800,
                            },
                        },
                        color: {
                            value: "#888888",
                        },
                        shape: {
                            type: "circle",
                            stroke: {
                                width: 0,
                                color: "#000000",
                            },
                            polygon: {
                                nb_sides: 5,
                            },
                        },
                        opacity: {
                            value: 0.5,
                            random: false,
                            anim: {
                                enable: false,
                                speed: 1,
                                opacity_min: 0.1,
                                sync: false,
                            },
                        },
                        size: {
                            value: 3,
                            random: true,
                            anim: {
                                enable: false,
                                speed: 40,
                                size_min: 0.1,
                                sync: false,
                            },
                        },
                        line_linked: {
                            enable: true,
                            distance: 150,
                            color: "#888888",
                            opacity: 0.4,
                            width: 1,
                        },
                        move: {
                            enable: true,
                            speed: 2,
                            direction: "none",
                            random: false,
                            straight: false,
                            out_mode: "out",
                            bounce: false,
                            attract: {
                                enable: false,
                                rotateX: 600,
                                rotateY: 1200,
                            },
                        },
                    },
                });
            };
            particlesInit();
        });
       
    }, 
};
</script>-->

<style scoped>
#particle-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    /* Ensure it stays behind other content */
    pointer-events: auto;
}
</style>
