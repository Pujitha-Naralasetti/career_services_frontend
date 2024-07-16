<script setup>
import { storeToRefs } from "pinia";
import MenuBar from "./components/MenuBar.vue";
import careerServicesBG from "./images/career-bg.jpeg";
import { useGlobalStore } from "./stores/globalStore";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const globalStore = useGlobalStore();
const { snackBar, userInfo, progressBar } = storeToRefs(globalStore);

const user = ref({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  gender: "",
  roleId: null,
  nationality: "",
  address: "",
  dateOfBirth: null,
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (!user.value) {
    router.push({ name: "login" });
  }
  userInfo.value = user.value;
});

const closeSnackBar = () => {
  snackBar.value = { value: false, color: "", text: "" }
}
</script>

<template>
  <v-app :style="{
    'background-image': `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
                  url(${careerServicesBG})`,
    'background-position': 'center',
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    'color': 'white',
  }">
    <MenuBar :key="$route.fullPath" />
    <v-main>
      <v-progress-linear v-if="progressBar" height="4" indeterminate rounded></v-progress-linear>
      <router-view />
    </v-main>
  </v-app>
  <v-snackbar v-model="snackBar.value" rounded="pill" :timeout="3000">
    {{ snackBar.text }}
    <template v-slot:actions>
      <v-btn :color="snackBar.color" variant="text" @click="closeSnackBar">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
