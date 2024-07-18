<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useGlobalStore } from "../stores/globalStore";
import { storeToRefs } from "pinia";
import ResumeServices from "../services/ResumeServices";

const globalStore = useGlobalStore();
const router = useRouter();
const { snackBar, userInfo } = storeToRefs(globalStore);
const resumeDetails = ref({
  title: ""
});

onMounted(async () => {
});

async function generateResume() {
  await ResumeServices.getResumesByUserId(userInfo.value.id)
    .then((response) => {
      resumeDetails.value = response.data?.data;
      snackBar.value = {
        value: true,
        color: "green",
        text: response.data?.message,
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
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"><v-card-title class="pl-0 text-h4 font-weight-bold">Create Resume
          </v-card-title>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card color="#232323" class="rounded-lg elevation-5 d-flex align-center">
            <v-card-text>
              <v-row align="center">
                <v-col cols="4">
                  <v-text-field class="w-100" v-model="resumeDetails.title" label="Resume Title*"
                    required></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex flex-row-reverse">
          <div>
            <v-btn variant="flat" color="primary" @click="generateResume()">Add
              Resume</v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
