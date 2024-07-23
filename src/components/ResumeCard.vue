<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ResumeServices from "../services/ResumeServices";
import { useGlobalStore } from "../stores/globalStore";
import { storeToRefs } from "pinia";

const router = useRouter();

const showDeleteConf = ref(false);

const props = defineProps({
  resume: {
    required: true,
  },
  resumeNumber: 0,
  getUpdatedResumes: Function,
});
const globalStore = useGlobalStore();
const { snackBar, userInfo } = storeToRefs(globalStore);

async function deleteResume() {
  await ResumeServices.deleteResume(props.resume.id)
    .then((response) => {
      if (response.data.status == "Success") {
        snackBar.value = {
          value: true,
          color: "green",
          text: response.data?.message,
        }
        showDeleteConf.value = false;
        props.getUpdatedResumes();
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

function openDeletePopup(e) {
  e?.stopPropagation();
  showDeleteConf.value = true;
}

function closeDeletePopup() {
  showDeleteConf.value = false;
}
</script>

<template>
  <v-card class="rounded-lg elevation-5 mb-8" color="#232323">
    <v-card-title class="headline">
      <v-row align="center">
        <v-col>
          <b>
            Resume {{ props.resumeNumber + 1 }}</b>
          <v-spacer></v-spacer>Template :
          {{ props.resume.templateType }}
        </v-col>
        <v-col class="d-flex justify-end">
          <template v-if="userInfo?.id !== null">
            <router-link :to="{ name: 'resumeById', params: { id: props.resume.id } }">
              <v-icon class="mr-3" size="small" icon="mdi-eye"></v-icon>
            </router-link>
          </template>
          <template v-if="userInfo?.id !== null">
            <v-icon class="mr-3" size="small" icon="mdi-delete" @click="(e) => openDeletePopup(e)"></v-icon>
          </template>
        </v-col>
      </v-row>
    </v-card-title>
  </v-card>
  <v-dialog persistent v-model="showDeleteConf" width="600">
    <v-container>
      <v-card class="rounded-lg elevation-5" color="#232323">
        <div class="pb-2 pl-5 pt-5 pr-5">Are you sure want to delete the Resume?
          <v-row class="mt-3">
            <v-col class="d-flex justify-end">
              <v-btn class="mr-3" variant="flat" color="secondary" @click="closeDeletePopup()">Cancel</v-btn>
              <v-btn variant="flat" color="primary" @click="deleteResume()">Confirm</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-container>
  </v-dialog>
</template>