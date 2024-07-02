<script setup>
import { onMounted } from "vue";
import { ref } from "vue";

const user = ref({
  email: "",
  firstName: "",
  lastName: "",
  id: null,
  token: "",
});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});

function closeSnackBar() {
  snackbar.value.value = false;
}

const showSnackbar = (color, msg) => {
  snackbar.value.value = true;
  snackbar.value.color = color;
  snackbar.value.text = msg;
};

</script>

<template>
  <v-container>
    <div id="body">
      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
