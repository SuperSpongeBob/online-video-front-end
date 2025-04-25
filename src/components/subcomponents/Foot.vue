<!-- <template>
    <div class="foot-container">
      <div class="foot-text" style="writing-mode : tb-rl ;">
        <p>免责声明：本系统仅限用于学习和研究目的；不得将本系统用于商业或者非法用途，否则，一切后果请用户自负。</p>
        <p>本站信息来自网络，版权争议与本站无关。您必须在下载后的24个小时之内，从您的电脑中彻底删除上述内容。</p>
        <p>如有侵权请邮件与我们联系处理。</p>
        <p>email:</p>
        <p>3024799675@qq.com</p>
      </div>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .foot-container {
    width: 150px; /* 设置容器宽度，可按需调整 */
    border: 1px solid #e4e7ed; /* 可按需添加边框用于调试查看布局 */
  }
  
  .foot-text {
    column-count: 1; /* 设置列数为2，可按需调整 */
    column-gap: 10px; /* 设置列间距 */
    break-inside: avoid; /* 防止元素内部跨列 */
  }
  
  .foot-text p {
    break-before: avoid; /* 防止段落前换行 */
    break-after: avoid; /* 防止段落后换行 */
  }
  </style> -->

<template>
    <div class="one">
        免责声明：本系统仅限用于学习和研究目的；不得将本系统用于商业或者非法用途，否则，一切后果请用户自负。本站信息来自网络，版权争议与本站无关。
        您必须在下载后的24个小时之内，从您的电脑中彻底删除上述内容。如有侵权请邮件与我们联系处理。
    </div>
    email:
    3024799675@qq.com
</template>

<script setup>

</script>
<style scoped>
.one {
    margin: 0 auto;
    /* width: 150px; */
    max-height: 55vh;
    writing-mode: vertical-lr;
    /*从左向右 从右向左是 writing-mode: vertical-rl;*/
    writing-mode: tb-lr;
    /*IE浏览器的从左向右 从右向左是 writing-mode: tb-rl；*/
}
</style>