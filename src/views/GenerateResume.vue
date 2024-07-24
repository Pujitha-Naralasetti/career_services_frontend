<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useGlobalStore } from "../stores/globalStore";
import { storeToRefs } from "pinia";
import ResumeServices from "../services/ResumeServices";
import TemplateSlides from "../components/TemplateSlides.vue";

const globalStore = useGlobalStore();
const router = useRouter();
const { snackBar, userInfo } = storeToRefs(globalStore);
const resumeDetails = ref({
  title: ""
});

onMounted(async () => {
});

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
              <TemplateSlides />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>