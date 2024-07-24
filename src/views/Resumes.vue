<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useGlobalStore } from "../stores/globalStore";
import { storeToRefs } from "pinia";
import ResumeServices from "../services/ResumeServices";
import ResumeCard from "../components/ResumeCard.vue";

const globalStore = useGlobalStore();
const { snackBar, userInfo } = storeToRefs(globalStore);
const resumes = ref([]);

onMounted(async () => {
  await getResumes();
});

async function getResumes() {
  if (userInfo.value !== null && userInfo.value.id !== null) {
    await ResumeServices.getResumesByUserId(userInfo.value.id)
      .then((response) => {
        resumes.value = response.data?.data;
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
}

</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"><v-card-title class="pl-0 text-h4 font-weight-bold">Resumes
          </v-card-title>
        </v-col>
        <v-col v-if="userInfo?.roleId == 1" class="d-flex justify-end" cols="2">
          <v-btn color="accent" :to="{ name: 'generateResume' }">Generate Resume</v-btn>
        </v-col>
      </v-row>
      <template v-if="resumes?.length > 0">
        <ResumeCard v-for="(resume, pos) in resumes" :resumeNumber="pos" :key="resume.id" :resume="resume"
          :getUpdatedResumes="getResumes" />
      </template>
      <template v-else>
        <p class="font-italic text-center">No Resumes found...</p>
      </template>
    </div>
  </v-container>
</template>
