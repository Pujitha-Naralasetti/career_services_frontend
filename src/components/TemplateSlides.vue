<script setup>
import { ref } from 'vue'
import Template1 from './Template1.vue';
import Template2 from './Template2.vue';
import Template3 from './Template3.vue';
import Template4 from './Template4.vue';
import ResumeServices from '../services/ResumeServices';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../stores/globalStore';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import ProfileServices from '../services/ProfileServices';
import AskAI from './AskAI.vue';
import html2pdf from "html2pdf.js";
import html2canvas from 'html2canvas';
import CommonServices from '../services/CommonServices';


const route = useRoute();
const router = useRouter();
const globalStore = useGlobalStore();
const { snackBar, userInfo } = storeToRefs(globalStore);
const modelSelected = ref(false);
const templateRef = ref(null);
const resumeId = ref(null);
const isCheckJob = ref(false);
const savedResume = ref(false);
const resumeByRoute = ref(null);
const fullProfile = ref(null);
const sampleResume1 = ref(null);
const sampleResume2 = ref(null);
const sampleResume3 = ref(null);
const sampleResume4 = ref(null);
const accessType = ref("");
const alert = ref({
  show: false,
  value: ""
});

const model = ref(0)
onMounted(async () => {
  if (route?.params?.id) {
    const pathName = route.path.toLowerCase();
    accessType.value = pathName.startsWith("/resume/view/") ? "preview" : "edit";
    resumeId.value = route?.params?.id;
    savedResume.value = true;
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
      sampleResume3.value = response.data?.data[2];
      sampleResume4.value = response.data?.data[3];
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

function closeAlert() {
  alert.value = {
    show: false,
    value: ""
  }
}

async function generateResume() {
  let payload = {
    ...templateRef.value.returnResumeContent(),
    templateType: model.value + 1,
    id: resumeId.value
  };
  let checkMandatory = CommonServices.checkMandatoryFields(payload);
  if (checkMandatory != "cool") {
    alert.value = {
      show: true,
      value: checkMandatory
    }
  } else {
    if (savedResume.value && accessType.value == 'edit') {
      await ResumeServices.updateResume(resumeId.value, payload)
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
    } else {
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
  }
}

function checkJob() {
  isCheckJob.value = true;
}

function closeCheckJob() {
  isCheckJob.value = false;
}

const downloadPDF = async () => {
  const element = document.getElementById("resume-container");

  element.classList.add('print-friendly');

  const opt = {
    margin: 0,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(element).set(opt).save().finally(() => {
    element.classList.remove('print-friendly');
  });
};



</script>
<template>
  <div v-if="modelSelected == false && savedResume == false">
    <div class="d-flex justify-space-around align-center py-4">
      <v-btn icon="mdi-minus" variant="text" @click="model = Math.max(model - 1, 0)" dark></v-btn>
      {{ model + 1 }}
      <v-btn icon="mdi-plus" variant="text" @click="model = Math.min(model + 1, 3)" dark></v-btn>
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
      <v-carousel-item v-for="(slide, i) in 4" :key="slide" :value="i">
        <v-sheet color="#232323" :rounded="rounded">
          <Template1 type="preview" :fullProfile="fullProfile" :isSlide="true" :resume="sampleResume1"
            v-if="slide == 1 && fullProfile && sampleResume1" />
          <Template2 type="preview" :fullProfile="fullProfile" :isSlide="true" :resume="sampleResume2"
            v-else-if="slide == 2 && fullProfile && sampleResume2" />
          <Template3 type="preview" :fullProfile="fullProfile" :isSlide="true" :resume="sampleResume3"
            v-else-if="slide == 3 && fullProfile && sampleResume3" />
          <Template4 type="preview" :fullProfile="fullProfile" :isSlide="true" :resume="sampleResume4"
            v-else-if="slide == 4 && fullProfile && sampleResume4" />
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </div>
  <div v-else-if="modelSelected == true && savedResume == false">
    <Template1 type="edit" :generateResume="generateResume" :fullProfile="fullProfile" :isSlide="true"
      :resume="sampleResume1" ref="templateRef" v-if="model == 0 && fullProfile && sampleResume1" />
    <Template2 type="edit" :generateResume="generateResume" :fullProfile="fullProfile" :isSlide="true"
      :resume="sampleResume2" ref="templateRef" v-else-if="model == 1 && fullProfile && sampleResume2" />
    <Template3 type="edit" :generateResume="generateResume" :fullProfile="fullProfile" :isSlide="true"
      :resume="sampleResume3" ref="templateRef" v-else-if="model == 2 && fullProfile && sampleResume3" />
    <Template4 type="edit" :generateResume="generateResume" :fullProfile="fullProfile" :isSlide="true"
      :resume="sampleResume4" ref="templateRef" v-else-if="model == 3 && fullProfile && sampleResume4" />
  </div>
  <div v-else-if="savedResume == true">
    <v-row class="mt-3 mb-3 mr-10">
      <v-col align="end">
        <v-btn class="mr-3" variant="flat" color="secondary" :to="{ name: 'resumes' }">Back</v-btn>
        <template v-if="accessType == 'preview'">
          <v-btn class="mr-3" v-if="userInfo?.roleId == 1" variant="flat" color="primary" @click="checkJob">Check Job
            Compatibility</v-btn>
          <v-btn variant="flat" color="primary" @click="downloadPDF">Download PDF<v-icon icon="mdi-download"
              end></v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-btn variant="flat" color="primary" @click="generateResume()">Update
            Resume</v-btn>
        </template>
      </v-col>
    </v-row>
    <div :id="accessType == 'preview' ? 'resume-container' : ''">
      <Template1 :type="accessType" ref="templateRef" :resume="resumeByRoute" v-if="resumeByRoute?.templateType == 1" />
      <Template2 :type="accessType" ref="templateRef" :resume="resumeByRoute"
        v-else-if="resumeByRoute?.templateType == 2" />
      <Template3 :type="accessType" ref="templateRef" :resume="resumeByRoute"
        v-else-if="resumeByRoute?.templateType == 3" />
      <Template4 :type="accessType" ref="templateRef" :resume="resumeByRoute"
        v-else-if="resumeByRoute?.templateType == 4" />
    </div>
  </div>

  <v-row v-if="modelSelected == true && savedResume == false">
    <v-col class="d-flex flex-row-reverse">
      <div>
        <v-btn @click="modelSelected = false" color="#232323" class="mr-5">Back</v-btn>
        <v-btn variant="flat" color="primary" @click="generateResume()">Add
          Resume</v-btn>
      </div>
    </v-col>
  </v-row>
  <AskAI v-if="savedResume == true && isCheckJob" :isCheckJob="isCheckJob" :closeCheckJob="closeCheckJob"
    :resumeId="resumeId" />
  <v-snackbar v-model="alert.show" :timeout="4000" color="#D53737" elevation="24">
    <b>{{ alert.value }}</b> is Mandatory to Add Resume...
    <template v-slot:actions>
      <v-btn variant="text" @click="closeAlert">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
<style scoped>
html,
body {
  background-color: #232323;
  margin: 0;
  padding: 0;
}

#resume-container {
  background-color: #232323;
  padding: 20px;
  width: 210mm;
  box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  color: white;
}

.print-friendly,
.print-friendly * {
  background-color: transparent !important;
  color: black !important;
}
</style>
