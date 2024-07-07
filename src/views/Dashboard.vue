<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useGlobalStore } from "../stores/globalStore";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();
const { snackBar, userInfo } = storeToRefs(globalStore);

onMounted(async () => {
  console.log(userInfo.value);
});

</script>

<template>
  <v-container>
    <div id="body">
      <div :class="['text-h4']">
        welcome {{ userInfo.firstName }} {{ userInfo.lastName }}!</div>
    </div>
  </v-container>
</template>
