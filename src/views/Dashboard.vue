<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useGlobalStore } from "../stores/globalStore";
import { storeToRefs } from "pinia";
import ResumeServices from "../services/ResumeServices";

const globalStore = useGlobalStore();
const { snackBar, userInfo } = storeToRefs(globalStore);
const dashboardCounts = ref({
  resumeCount: 0,
  studentCount: 0,
});

onMounted(async () => {
  await getDashboardDetails();
});

async function getDashboardDetails() {
  let payload = {
    roleId: userInfo.value.roleId,
    userId: userInfo.value.id
  }
  await ResumeServices.getDashboardDetails(payload)
    .then((response) => {
      dashboardCounts.value = response.data?.data;
    })
    .catch((error) => {
      console.log(error);
      snackBar.value = {
        value: true,
        color: "error",
        text: error.response.data.message,
      }
    });
}
</script>

<template>
  <v-container>
    <div id="body">
      <div :class="['text-h4']">
        welcome {{ userInfo?.firstName }} {{ userInfo?.lastName }}!</div>
      <v-row class="mt-10 gc-10" justify="center">
        <v-col cols="3">
          <v-card color="#232323" class="rounded-lg" max-width="600" dark>
            <v-card-title>Resumes</v-card-title>
            <v-card-text>
              Total Count: {{ dashboardCounts.resumeCount }}
            </v-card-text>
            <v-card-action>
              <v-row justify="end" class="mb-3 mr-3">
                <v-btn :to="{ name: 'resumes' }" color="primary">
                  Open
                </v-btn>
              </v-row>
            </v-card-action>
          </v-card>
        </v-col>
        <v-col cols="3">
          <v-card color="#232323" class="rounded-lg" max-width="600" dark>
            <v-card-title>My Profile</v-card-title>
            <v-card-text>
              Student
            </v-card-text>
            <v-card-action>
              <v-row justify="end" class="mb-3 mr-3">
                <v-btn :to="{ name: 'profile' }" color="primary">
                  Open
                </v-btn>
              </v-row>
            </v-card-action>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>