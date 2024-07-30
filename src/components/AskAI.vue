<script setup>
import { ref } from 'vue'
import ResumeServices from '../services/ResumeServices';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../stores/globalStore';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';


const props = defineProps({
  isCheckJob: false,
  resumeId: null,
  closeCheckJob: Function
});
const router = useRouter();
const globalStore = useGlobalStore();
const { snackBar, userInfo } = storeToRefs(globalStore);
const jobTitle = ref("");
const loader = ref(false);
const resultsFetched = ref(false);
const feedback = ref({
  comments: "",
  matchingScore: "",
});

onMounted(async () => {
});

function clearData() {
  resultsFetched.value = false;
  feedback.value = {
    comments: "",
    matchingScore: "",
  };
}

async function askAI() {
  let payload = {
    userId: userInfo.value.id,
    resumeId: props?.resumeId,
    jobTitle: jobTitle.value,

  };
  loader.value = true;
  await ResumeServices.checkResumeCompatibility(payload)
    .then((response) => {
      loader.value = false;
      if (response.data.status == "Success") {
        resultsFetched.value = true;
        feedback.value = { ...response.data?.data, matchingScore: response.data.data?.matchingScore?.replace("%", "") };
        snackBar.value = {
          value: true,
          color: "green",
          text: response.data?.message,
        }
      } else {
        snackBar.value = {
          value: true,
          color: "error",
          text: response.data?.message,
        }
      }
    })
    .catch((error) => {
      loader.value = false;
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

  <v-dialog persistent v-model="props.isCheckJob" width="700">
    <v-card color="#232323" class="rounded-lg elevation-5">
      <v-card-title class="headline mb-2">Check Job Match</v-card-title>
      <v-card-text v-if="!loader && !resultsFetched">
        <ul v-bind:style="{
    color: '#707070',
    'font-size': '14px',
  }">
          <li>Enter your desired job title and click 'Ask AI' to see how well your resume matches the job requirements.
          </li>
          <li>Our AI will analyze your resume and provide a matching percentage to help you understand your job fit.
          </li>
        </ul>
        <v-row align="center">
          <v-col cols="12">
            <v-row justify="center" align="center" class="mt-3">
              <v-col cols="6">
                <v-text-field v-model="jobTitle" @keydown.enter="askAI" label="Enter Job Title..."></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-row v-else align="center">
        <v-col align="center" v-if="resultsFetched" cols="12">
          <div v-if="feedback?.matchingScore >= 75" class="success alert">
            <div class="alert-body">
              {{ jobTitle }} - {{ feedback?.matchingScore }}% Match
            </div>
          </div>
          <div v-else-if="feedback?.matchingScore < 75 && feedback?.matchingScore >= 50" class="warning alert">
            <div class="alert-body">
              {{ jobTitle }} - {{ feedback?.matchingScore }}% Match
            </div>
          </div>
          <div v-else class="error alert">
            <div class="alert-body">
              {{ jobTitle }} - {{ feedback?.matchingScore }}% Match
            </div>
          </div>
          <p v-bind:style="{
    color: '#707070',
    'font-size': '14px',
  }">{{ feedback?.comments }}
          </p>
        </v-col>
        <v-col v-else cols="12">
          <v-skeleton-loader type="card" color="#232323"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="props.closeCheckJob" class="mr-3">Close</v-btn>
        <v-btn v-if="!resultsFetched" variant="flat" color="primary mr-5" :disabled="!jobTitle || loader"
          @click="askAI">Ask
          AI</v-btn>
        <v-btn v-else="resultsFetched" variant="flat" color="primary mr-5" @click="clearData">Clear</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.alert {
  background-color: #232323;
  font-size: 25px;
  font-family: sans-serif;
  text-align: center;
  min-width: 300px;
  min-height: 100px;
  padding-top: 150px;
  position: relative;
  border-radius: 2%;
}

.alert::before {
  width: 100px;
  height: 100px;
  position: absolute;
  border-radius: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;
  line-height: 100px;
  border: 5px solid gray;
  animation-name: reveal;
  animation-duration: 1.5s;
  animation-timing-function: ease-in-out;
}

.alert>.alert-body {
  opacity: 0;
  animation-name: reveal-message;
  animation-duration: 1s;
  animation-timing-function: ease-out;
  animation-delay: 1.5s;
  animation-fill-mode: forwards;
}

@keyframes reveal-message {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.success {
  color: green;
}

.success::before {
  content: '✓';
  background-color: #232323;
  box-shadow: 0px 0px 12px 7px rgba(67, 94, 42, 0.8) inset;
  border: 5px solid green;
}

.warning {
  color: rgb(244, 170, 32);
}

.warning::before {
  content: '!';
  background-color: #232323;
  box-shadow: 0px 0px 12px 7px rgba(112, 84, 33, 0.8) inset;
  border: 5px solid rgb(244, 170, 32);
}

.error {
  color: red;
}

.error::before {
  content: '✗';
  background-color: #232323;
  box-shadow: 0px 0px 12px 7px rgba(72, 39, 39, 0.8) inset;
  border: 5px solid red;
}

@keyframes reveal {
  0% {
    border: 5px solid transparent;
    color: transparent;
    box-shadow: 0px 0px 12px 7px rgba(255, 250, 250, 0.8) inset;
    transform: rotate(1000deg);
  }

  25% {
    border-top: 5px solid gray;
    color: transparent;
    box-shadow: 0px 0px 17px 10px rgba(255, 250, 250, 0.8) inset;
  }

  50% {
    border-right: 5px solid gray;
    border-left: 5px solid gray;
    color: transparent;
    box-shadow: 0px 0px 17px 10px rgba(200, 200, 200, 0.8) inset;
  }

  75% {
    border-bottom: 5px solid gray;
    color: gray;
    box-shadow: 0px 0px 12px 7px rgba(200, 200, 200, 0.8) inset;
  }

  100% {
    border: 5px solid gray;
    box-shadow: 0px 0px 12px 7px rgba(200, 200, 200, 0.8) inset;
  }
}
</style>