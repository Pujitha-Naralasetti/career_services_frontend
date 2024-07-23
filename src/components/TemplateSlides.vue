<script setup>
import { ref } from 'vue'

import ResumeServices from '../services/ResumeServices';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../stores/globalStore';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import ProfileServices from '../services/ProfileServices';


const route = useRoute();
const router = useRouter();
const globalStore = useGlobalStore();
const { snackBar, userInfo } = storeToRefs(globalStore);
const modelSelected = ref(false);
const templateRef = ref(null);
const resumePreview = ref(false);
const resumeByRoute = ref(null);
const fullProfile = ref(null);
const sampleResume1 = ref(null);
const sampleResume2 = ref(null);

const model = ref(0)
onMounted(async () => {
  if (route?.params?.id) {
    resumePreview.value = true;
    await getResumeById(route?.params?.id);
  } else {
    await getFullProfile(userInfo.value?.id);
    await getSampleResumes();
  }
});

async function getFullProfile(userId) {
  await ProfileServices.getFullProfile(userId)
    .then((response) => {
      let result = response?.data?.data[0];
      fullProfile.value = {
        user: {
          id: result?.id,
          roleId: result?.roleId,
          firstName: result?.firstName,
          lastName: result?.lastName,
          phone: result?.phone,
          email: result?.email,
          gender: result?.gender,
          nationality: result?.nationality,
          address: result?.address,
          dateOfBirth: result?.dateOfBirth,
        },
        educationDetails: result?.education,
        certificateDetails: result?.certifications,
        skillDetails: result?.skills,
        languageDetails: result?.languages,
        onlineProfileDetails: result?.onlineProfiles,
        awardsAndAchievements: result?.awards,
        experienceDetails: result?.experiences,
        projectDetails: result?.projects,
      }
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

async function getSampleResumes() {
  await ResumeServices.getSampleResumes()
    .then((response) => {
      sampleResume1.value = response.data?.data[0];
      sampleResume2.value = response.data?.data[1];
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
async function getResumeById(resumeId) {
  await ResumeServices.getResumeById(resumeId)
    .then((response) => {
      resumeByRoute.value = response.data?.data;
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
async function generateResume() {
  let payload = {
    ...templateRef.value.returnResumeContent(),
    templateType: model.value + 1
  };
  await ResumeServices.addResume(userInfo.value.id, payload)
    .then((response) => {
      if (response.data.status == "Success") {
        snackBar.value = {
          value: true,
          color: "green",
          text: response.data?.message,
        }
        router.push({ name: "resumes" });
      } else {
        snackBar.value = {
          value: true,
          color: "error",
          text: response.data?.message,
        }
      }
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
  <div v-if="modelSelected == false && resumePreview == false">
    <div class="d-flex justify-space-around align-center py-4">
      <v-btn icon="mdi-minus" variant="text" @click="model = Math.max(model - 1, 0)" dark></v-btn>
      {{ model + 1 }}
      <v-btn icon="mdi-plus" variant="text" @click="model = Math.min(model + 1, 1)" dark></v-btn>
    </div>
    <v-row>
      <v-col align="center">
        <v-btn color="primary" @click="modelSelected = true">SELECT</v-btn>
      </v-col>
    </v-row>
    <v-carousel v-model="model" :style="{
    'height': 'auto',
  }" hide-delimiter-background show-arrows>
      <template v-slot:prev="{ props }">
        <v-btn icon="mdi-chevron-left" size="large" @click="props.onClick" color="#232323"></v-btn>
      </template>
      <template v-slot:next="{ props }">
        <v-btn icon="mdi-chevron-right" size="large" @click="props.onClick" color="#232323"></v-btn>
      </template>
      <v-carousel-item v-for="(slide, i) in 2" :key="slide" :value="i">
        <v-sheet color="#232323" :rounded="rounded">
          
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </div>
  <div v-else-if="modelSelected == true && resumePreview == false">
   
  </div>
  <div v-else-if="resumePreview == true">
    <v-row class="mt-3 mb-3 mr-10">
      <v-col align="end">
        <v-btn class="mr-3" variant="flat" color="secondary" :to="{ name: 'resumes' }">Back</v-btn>
      </v-col>
    </v-row>
    
  </div>

  <v-row v-if="modelSelected == true && resumePreview == false">
    <v-col class="d-flex flex-row-reverse">
      <div>
        <v-btn @click="modelSelected = false" color="#232323" class="mr-5">Back</v-btn>
        <v-btn variant="flat" color="primary" @click="generateResume()">Add
          Resume</v-btn>
      </div>
    </v-col>
  </v-row>
</template>