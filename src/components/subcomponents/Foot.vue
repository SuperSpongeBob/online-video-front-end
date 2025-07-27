<template>
    <div class="footer-container">
        <div class="footer-content">
            <span class="disclaimer-text">免责声明：本系统仅限用于学习和研究目的，不得用于商业或非法用途。本站信息来自网络，版权争议与本站无关。</span>
            <span class="contact-text">联系我们：3024799675@qq.com</span>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.footer-container {
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    font-size: 11px;
    /* 增大字体到11px */
    color: #555;
    /* 稍微加深颜色提高可读性 */
    line-height: 1.2;
    width: 100%;
}

.disclaimer-text {
    flex: 2;
}

.contact-text {
    flex: 1;
    text-align: right;
}

@media (max-width: 768px) {
    .footer-content {
        flex-direction: column;
        gap: 2px;
        /* 进一步减小间距 */
        align-items: flex-start;
    }

    .contact-text {
        text-align: left;
    }
}
</style>