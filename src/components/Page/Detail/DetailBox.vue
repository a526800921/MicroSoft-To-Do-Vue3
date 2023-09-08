<template>
  <div class="detailbox">
    <slot />
  </div>
</template>

<style scoped>
.detailbox {
  margin-bottom: 10px;
  border: 1px solid rgb(236, 236, 236);
  border-radius: 6px;
  padding: 2px;
  background-color: rgba(253, 253, 253, 1);
}

.detailbox:last-of-type {
  margin-bottom: 0;
}
</style>
