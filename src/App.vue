<script setup>
import { onMounted, ref } from 'vue';
import careerServicesBG from "./images/career-bg.jpeg";
import { useRouter } from 'vue-router';
import '@vuepic/vue-datepicker/dist/main.css'
import UserServices from "./services/UserServices";
import { useGlobalStore } from './stores/globalStore'
import { storeToRefs } from 'pinia';

const drawer = ref(true);
const rail = ref(false);
const router = useRouter();
const globalStore = useGlobalStore();
const { snackBar, userInfo, progressBar } = storeToRefs(globalStore);

const user = ref(null);

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (!user.value) {
    router.push({ name: "login" });
  }
  userInfo.value = user.value;
  progressBar.value = false;
});

const logout = () => {
  // UserServices.logoutUser()
  //   .then((data) => {
  //     console.log(data);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  localStorage.removeItem("user");
  user.value = null;
  router.push({ name: "login" });
  progressBar.value = false;
  snackBar.value = { value: true, color: "green", text: "Logout Success..." }
  userInfo.value = null;
}
const closeSnackBar = () => {
  snackBar.value = { value: false, color: "", text: "" }
}
const onLogin = () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  userInfo.value = user.value;
}
</script>

<template>
  <v-app :style="{
    'background-image': `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
                  url(${careerServicesBG})`,
    'background-attachment': 'fixed',
    'background-position': 'center',
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    'color': 'white',
  }">
    <v-main>
      <template v-if="!userInfo?.id">
        <router-view :onLogin="onLogin" />
      </template>
      <template v-else>
        <v-layout>
          <v-navigation-drawer class="bg-deep-purple leftNav" theme="dark" permanent v-model="drawer" :rail="rail"
            @click="rail = false">
            <template v-slot:prepend>
              <v-list-item :title="userInfo?.firstName + ' ' + userInfo?.lastName" nav
                :subtitle="!rail && (userInfo?.roleId == 1 ? 'STUDENT' : 'STAFF')">
                <template v-slot:prepend>
                  <v-avatar color="#7952C0">
                    <span class="white-text text-h5">{{
    `${userInfo?.firstName.charAt(0)}${userInfo?.lastName.charAt(0)}`
  }}</span>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-btn variant="text" :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
                    @click.stop="rail = !rail"></v-btn>
                </template>
              </v-list-item>
            </template>

            <v-divider></v-divider>
            <v-list density="compact" nav>
              <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard"
                :to="'/Dashboard'"></v-list-item>
              <v-list-item prepend-icon="mdi-book-alphabet" title="Resumes" value="resumes"
                :to="'/Resumes'"></v-list-item>
              <v-list-item v-if="userInfo?.roleId == 1" prepend-icon="mdi-book-plus" title="Generate Resume"
                value="generateResume" :to="'/GenerateResume'"></v-list-item>
              <v-list-item prepend-icon="mdi-account-details" title="Profile" value="profile"
                :to="'/Profile'"></v-list-item>
            </v-list>

            <template v-slot:append>
              <v-list density="compact" nav>
                <v-list-item v-bind:style="{
    'background-color': '#000000  !important',
  }" variant="tonal" prepend-icon="mdi-logout-variant" @click="logout">
                  <v-list-item-title v-bind:style="{
    'font-size': '16px',
    'font-weight': 600
  }" v-text="'Logout'"></v-list-item-title></v-list-item>
              </v-list>
            </template>
          </v-navigation-drawer>
          <v-main style="min-height: 100vh" color="transparent"><router-view /></v-main>
        </v-layout>
      </template>
    </v-main>
  </v-app>
  <v-snackbar v-model="snackBar.value" rounded="pill">
    {{ snackBar.text }}
    <template v-slot:actions>
      <v-btn :color="snackBar.color" variant="text" @click="closeSnackBar">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
<style scoped>
.leftNav {
  position: fixed !important;
}

/* .v-card {
  overflow: visible !important;
} */

.vdp-datepicker__calendar {
  z-index: 10000 !important;
  /* Ensure this is higher than other elements */
}
</style>