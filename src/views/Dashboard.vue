<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useGlobalStore } from "../stores/globalStore";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();
const { snackBar, userInfo } = storeToRefs(globalStore);

onMounted(async () => {
  console.log(userInfo.value);
});

</script>

<template>
  <v-container>
    <div id="body">
      <div :class="['text-h4']">
        welcome {{ userInfo.firstName }} {{ userInfo.lastName }}!</div>
      <v-row  class="mt-10 gc-10" justify="center">
        <v-col cols="3">
          <v-card color="#232323" class="rounded-lg" max-width="600" dark>
            <v-card-title>My Resumes</v-card-title>
            <v-card-text>
              Total Count: {{ 0 }}
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
              {{ userInfo.roleId == 1 ? "Student" : "Staff" }}
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
