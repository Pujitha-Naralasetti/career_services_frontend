<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useGlobalStore } from "../stores/globalStore";
import { storeToRefs } from "pinia";
import ResumeServices from "../services/ResumeServices";
import ResumeCard from "../components/ResumeCard.vue";

const globalStore = useGlobalStore();
const { snackBar, userInfo } = storeToRefs(globalStore);
const filterResumes = ref("");
const resumes = ref([]);
const constResumes = ref([]);

onMounted(async () => {
  await getResumes();
});

async function getResumes() {
  if (userInfo.value !== null && userInfo.value.id !== null) {
    if (userInfo.value?.roleId == 1) {
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
    } else {
      await ResumeServices.getAllResumes()
        .then((response) => {
          resumes.value = response.data?.data;
          constResumes.value = response.data?.data;
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
}
const onFilterChange = () => {
  if (filterResumes.value) {
    let tempFilteredResumes = [];
    tempFilteredResumes = constResumes.value.filter(
      (item) =>
        JSON.parse(item?.personalInfo)?.name?.toLowerCase()?.includes(filterResumes.value?.toLowerCase())
    );
    resumes.value = tempFilteredResumes;
  } else {
    resumes.value = constResumes.value;
  }
};
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
      <v-row v-if="userInfo.roleId == 2">
        <v-col>
          <v-text-field v-if="constResumes.length > 0" v-model="filterResumes" append-icon="mdi-magnify" v-bind:style="{
          marginBottom: '10px',
          backgroundColor: 'rgba(186, 186, 203, 0.82)',
        }" label="Search by student name..." @input="onFilterChange" single-line hide-details></v-text-field>
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