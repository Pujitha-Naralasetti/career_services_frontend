<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import { useRouter } from 'vue-router';
import { useGlobalStore } from "../stores/globalStore";
import { storeToRefs } from "pinia";
import moment from "moment";

const props = defineProps({
  type: '',
  resume: null,
  fullProfile: null,
  isSlide: false,
  generateResume: Function
});
const globalStore = useGlobalStore();
const router = useRouter();
const { snackBar, userInfo } = storeToRefs(globalStore);

onMounted(async () => {
  if (props.resume && props.isSlide) {
    summary.value = props.resume?.profileSummary;
    let link = "";
    if (props.fullProfile?.onlineProfileDetails?.length > 0) {
      link = props.fullProfile?.onlineProfileDetails[0]?.link;
    } else {
      link = JSON.parse(props.resume?.personalInfo)?.linkedIn;
    }
    personalInfo.value = props.fullProfile?.user ? { ...props.fullProfile?.user, name: props.fullProfile?.user?.firstName + " " + props.fullProfile?.user?.lastName, linkedIn: link } : JSON.parse(props.resume?.personalInfo);

    if (props.fullProfile?.educationDetails?.length > 0) {
      let educationDetailsTemp = [];
      props.fullProfile?.educationDetails.map(item => {
        item.awards = [];
        item.courseWork = [];
        educationDetailsTemp.push(item);
      })
      educationDetails.value = educationDetailsTemp;
    } else {
      educationDetails.value = JSON.parse(props.resume?.education);
    }

    if (props.fullProfile?.experienceDetails?.length > 0) {
      let experienceDetailsTemp = [];
      props.fullProfile?.experienceDetails.map(item => {
        item.experiencePoints = [];
        experienceDetailsTemp.push(item);
      })
      experienceDetails.value = experienceDetailsTemp;
    } else {
      experienceDetails.value = JSON.parse(props.resume?.experience);
    }
  } else if (props.resume) {
    summary.value = props.resume?.profileSummary;
    personalInfo.value = JSON.parse(props.resume?.personalInfo);
    educationDetails.value = JSON.parse(props.resume?.education);
    experienceDetails.value = JSON.parse(props.resume?.experience);
  }
});
const expPointName = ref("");
const personalInfo = ref(null);
const summary = ref("");

const educationDetails = ref([]);

const experienceDetails = ref([]);

function addEducation() {
  educationDetails.value.push({
    institutionName: "",
    degree: "",
    course: "",
    startDate: null,
    endDate: null,
    gpa: "",
    address: "",
  });
}

function deleteEducation(index) {
  educationDetails.value.splice(index, 1);
}

function addExpPoints(expIndex, pointName) {
  experienceDetails.value[expIndex].experiencePoints.push(pointName);
  expPointName.value = "";
}

function deleteExpPoint(expIndex, pointIndex) {
  experienceDetails.value[expIndex].experiencePoints.splice(pointIndex, 1);
}

function addExperience() {
  experienceDetails.value.push({
    company: '',
    designation: '',
    isInternship: false,
    jobType: 'Full Time',
    startDate: null,
    endDate: null,
    address: '',
    experiencePoints: []
  });
}

function deleteExperience(index) {
  experienceDetails.value.splice(index, 1);
}

function returnResumeContent() {
  return {
    profileSummary: summary.value,
    userId: userInfo.value.id,
    personalInfo: JSON.stringify(personalInfo.value),
    education: JSON.stringify(educationDetails.value),
    experience: JSON.stringify(experienceDetails.value),
  }
}
defineExpose({
  returnResumeContent
});
</script>

<template>
  <v-container>
    <div id="body">
      <v-row><v-col>
          <v-card color="#232323" class="rounded-lg elevation-5 d-flex align-center">
            <v-card-text v-if="props.type == 'preview'">
              <v-row align="center" class="mt-5">
                <div id="resume" class="resume">
                  <div class="header">
                    <h1>{{ personalInfo?.name }}</h1>
                    <p :style="{
            }" class="contact-info">{{ personalInfo?.address }} | {{ personalInfo?.phone }} | {{ personalInfo?.email }}
                      |
                      {{
              personalInfo?.linkedIn }}</p>
                  </div>
                  <div>
                    <h3 class="subHeading">OBJECTIVE</h3>
                    <v-divider></v-divider>
                    <p class="regularTextContent">{{ summary }}</p>
                  </div>
                  <div>
                    <h3 class="subHeading">EDUCATION</h3>
                    <v-divider></v-divider>
                    <div class="contentWrap" v-for="(education, eIndex) in educationDetails" :key="eIndex">
                      <p class="regularText">
                        <b>{{ education?.institutionName }},</b> {{ education?.address }} | {{
              moment(education?.startDate).format('YYYY-MM-DD') }} - {{
              moment(education?.endDate).format('YYYY-MM-DD') }}
                      </p>
                      <p class="regularText">{{ education?.degree }} in {{ education?.course }}</p>
                      <p class="regularText"><b>GPA:</b> {{ education?.gpa }}</p>
                    </div>
                  </div>
                  <div>
                    <h3 class="subHeading">EXPERIENCE</h3>
                    <v-divider></v-divider>
                    <div class="contentWrap" v-for="(exp, expIndex) in experienceDetails" :key="expIndex">
                      <p class="regularText">
                        <b>{{ exp?.designation }},</b> {{ exp?.company }} |
                        {{
              moment(exp?.startDate).format('YYYY-MM-DD') }} - {{
              moment(exp?.endDate).format('YYYY-MM-DD') }}
                      </p>
                      <ul v-if="exp?.experiencePoints.length > 0">
                        <li v-for="expPoint in exp?.experiencePoints" class="regularTextPoints">{{ expPoint }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </v-row>
            </v-card-text>
            <v-card-text v-else-if="props.type == 'edit'">
              <v-row>
                <v-col cols="12">
                  <v-textarea v-model="summary" label="Professional Summary*" rows="4" outlined></v-textarea>
                </v-col>
                <v-divider opacity="100"></v-divider>
                <v-col cols="12">
                  <h3 class="subHeading">EDUCATION:</h3>
                  <p v-if="educationDetails?.length == 0" colspan="8" v-bind:style="{
              color: '#707070',
              'font-size': '14px',
              textAlign: 'center',
            }">
                    No data available. Click on Add New to insert data...
                  </p>
                  <v-row v-for="(education, eIndex) in educationDetails" :key="eIndex" align="center">
                    <v-col cols="11">
                      <v-row align="center">
                        <v-col cols="6">
                          <v-text-field v-model="education.institutionName" label="College/University*"
                            required></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="education.degree" label="Degree*" required></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="education.course" label="Course"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="education.gpa" label="Percentage/GPA*" required></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <VueDatePicker v-model="education.startDate" :enable-time-picker="false" color="#232323"
                            placeholder="Start Date*" dark>
                          </VueDatePicker>
                        </v-col>
                        <v-col cols="6">
                          <VueDatePicker v-model="education.endDate" :enable-time-picker="false" color="#232323"
                            placeholder="End Date" dark>
                          </VueDatePicker>
                        </v-col>
                        <v-col cols="6">
                          <v-textarea v-model="education.address" label="Address*" rows="3" outlined></v-textarea>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="1">
                      <v-btn icon size="x-small" @click="deleteEducation(eIndex)" color="black">
                        <v-icon color="red">mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                    <v-divider v-if="eIndex < educationDetails?.length - 1" class="mb-2" inset></v-divider>
                  </v-row>
                  <v-row justify="center" class="mt-3 mb-3">
                    <v-btn @click="addEducation" color="primary">
                      <v-icon left>mdi-plus</v-icon>
                      Add New
                    </v-btn>
                  </v-row>
                </v-col>
                <v-divider opacity="100"></v-divider>
                <v-col cols="12">
                  <h3 class="subHeading">PROFESSIONAL EXPERIENCE:</h3>
                  <p v-if="experienceDetails?.length == 0" colspan="8" v-bind:style="{
              color: '#707070',
              'font-size': '14px',
              textAlign: 'center',
            }">
                    No data available. Click on Add New to insert data...
                  </p>
                  <v-row v-for="(exp, expIndex) in experienceDetails" :key="expIndex" align="center">
                    <v-col cols="11">
                      <v-row align="center">
                        <v-col cols="6">
                          <v-text-field v-model="exp.company" label="Company*" required></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="exp.designation" label="Designation*" required></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-select :items="['true', 'false']" label="Is Internship*" v-model="exp.isInternship"
                            required></v-select>
                        </v-col>
                        <v-col cols="6">
                          <v-select :items="['Full Time', 'Part Time']" label="Job Type*" v-model="exp.jobType"
                            required></v-select>
                        </v-col>
                        <v-col cols="6">
                          <VueDatePicker v-model="exp.startDate" :enable-time-picker="false" color="#232323"
                            placeholder="Start Date*" dark>
                          </VueDatePicker>
                        </v-col>
                        <v-col cols="6">
                          <VueDatePicker v-model="exp.endDate" :enable-time-picker="false" color="#232323"
                            placeholder="End Date" dark>
                          </VueDatePicker>
                        </v-col>
                        <v-col cols="6">
                          <v-textarea v-model="exp.address" label="Address*" rows="3" outlined></v-textarea>
                        </v-col>
                        <v-col cols="12">
                          <b>Experience Details:</b>
                          <template v-for="(point, pIndex) in exp.experiencePoints" :key="pIndex">
                            <li class="regularTextPoints">
                              <v-chip class="ma-2" :style="{ 'white-space': 'normal', 'height': 'auto' }" label>{{
              point }}
                                <v-icon end icon="mdi-close-circle" @click="deleteExpPoint(expIndex, pIndex)"></v-icon>
                              </v-chip>
                            </li>
                          </template>
                          <v-row justify="center" align="center" class="mt-3">
                            <v-col cols="6">
                              <v-text-field v-model="expPointName" label="Enter Experience Details..."
                                @keydown.enter="addExpPoints(expIndex, expPointName)"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                              <v-btn icon="mdi-plus" @click="addExpPoints(expIndex, expPointName)" color="#232323">
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="1">
                      <v-btn icon size="x-small" @click="deleteExperience(expIndex)" color="black">
                        <v-icon color="red">mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                    <v-divider v-if="expIndex < experienceDetails?.length - 1" class="mb-2"></v-divider>
                  </v-row>
                  <v-row justify="center" class="mt-3 mb-3">
                    <v-btn @click="addExperience" color="primary">
                      <v-icon left>mdi-plus</v-icon>
                      Add New
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.resume {
  margin: auto;
  margin-bottom: 30px;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

h1,
h3 {
  margin: 0 0 15px;
  padding: 0;
}

.mainHeading {
  text-align: center;
}

.subHeading {
  margin-top: 10px;
  margin-bottom: 2px;
}

.contact-info {
  font-size: 0.8rem;
  color: #999;
}

.regularText {
  margin: 3px 10px;
}

.contentWrap {
  margin-top: 0px;
}

.regularTextPoints {
  margin: 3px 35px;
}

.regularTextContent {
  margin: 10px;
}

.regularTextEnd {
  text-align: end;
}

.wrap-chip .v-chip__content {
  white-space: normal;
}
</style>