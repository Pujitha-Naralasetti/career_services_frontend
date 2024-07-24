<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import VueDatePicker from '@vuepic/vue-datepicker';
import UserServices from "../services/UserServices.js";
import { useGlobalStore } from "../stores/globalStore.js";
import { storeToRefs } from "pinia";

const router = useRouter();
const isCreateAccount = ref(false);
const emailInValid = ref(false);
const genders = ref(["Male", "Female"]);

const props = defineProps({
  onLogin: Function,
});

const globalStore = useGlobalStore();
const { snackBar, userInfo } = storeToRefs(globalStore);
const user = ref({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  gender: "",
  roleId: null,
  nationality: "",
  address: "",
  dateOfBirth: null,
});

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    router.push({ name: "dashboard" });
  }
});

async function createAccount() {
  await UserServices.addUser(user.value)
    .then(() => {
      emailInValid.value = false;
      snackBar.value = {
        value: true,
        color: "green",
        text: "Account created successfully!",
      }
      isCreateAccount.value = false;
      user.value = {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        gender: "",
        roleId: null,
        nationality: "",
        address: "",
        dateOfBirth: null,
      };
      router.push({ name: "login" });
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

async function login() {
  await UserServices.loginUser(user)
    .then((data) => {
      userInfo.value = data.data;
      window.localStorage.setItem("user", JSON.stringify(data.data));
      snackBar.value = {
        value: true,
        color: "green",
        text: "Login successful!",
      }
      user.value = {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        gender: "",
        roleId: null,
        nationality: "",
        address: "",
        dateOfBirth: null,
      };
      router.push({ name: "dashboard" });
      props.onLogin();
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

function openCreateAccount() {
  emailInValid.value = false;
  isCreateAccount.value = true;
  user.value = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    gender: "",
    roleId: null,
    nationality: "",
    address: "",
    dateOfBirth: null,
  };
}

function closeCreateAccount() {
  emailInValid.value = false;
  isCreateAccount.value = false;
  user.value = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    gender: "",
    roleId: null,
    nationality: "",
    address: "",
    dateOfBirth: null,
  };
}

function onEmailChange() {
  if (user.value.email) {
    if (user.value.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
      emailInValid.value = false;
    } else {
      emailInValid.value = true;
    }
  } else {
    emailInValid.value = false;
  }
}
</script>

<template>
  <v-container>
    <div id="wrapper">
      <v-card id="body" color="#232323" class="rounded-lg" max-width="600" dark>
        <v-card-title class="headline mb-2 text-center">Login</v-card-title>
        <v-card-text>
          <v-text-field v-model="user.email" label="Email*" :hint="emailInValid && 'Please enter valid email'"
            @input="onEmailChange" required></v-text-field>
          <v-text-field v-model="user.password" label="Password*" type="password" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="outlined" @click="openCreateAccount()">Create
            Account</v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" :disabled="emailInValid || !user.email || !user.password"
            @click="login()">Login</v-btn>
        </v-card-actions>
      </v-card>

      <v-dialog persistent v-model="isCreateAccount" width="900">
        <v-card color="#232323" class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Create Account</v-card-title>
          <v-card-text>
            <v-row align="center">
              <v-col cols="6">
                <v-text-field v-model="user.firstName" label="First Name*" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="user.lastName" label="Last Name*" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="user.phone" label="Phone*" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="user.email" label="Email*" :hint="emailInValid && 'Please enter valid email'"
                  @input="onEmailChange" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="user.password" label="Password*" required type="password"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="user.nationality" label="Nationality*" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select :items="genders" label="Gender*" v-model="user.gender" required></v-select>
              </v-col>
              <v-col cols="6">
                <VueDatePicker v-model="user.dateOfBirth" :enable-time-picker="false" color="#232323"
                  placeholder="Select DOB*" dark>
                </VueDatePicker>
              </v-col>
              <v-col cols="6">
                <v-textarea v-model="user.address" label="Address*" rows="3" outlined></v-textarea>
              </v-col>
              <v-col cols="6">
                <v-radio-group v-model="user.roleId" inline label="Select Role*">
                  <v-radio label="Student" value="1"></v-radio>
                  <v-radio label="Staff" value="2"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeCreateAccount()">Close</v-btn>
            <v-btn variant="outlined" :disabled="emailInValid ||
            !user.email ||
            !user.password ||
            !user.phone ||
            !user.nationality ||
            !user.gender ||
            !user.dateOfBirth ||
            !user.roleId ||
            !user.firstName ||
            !user.address ||
            !user.lastName" @click="createAccount()">Create Account</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<style scoped>
#wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85vh;
}

#body {
  width: 100%;
  max-width: 600px;
}
</style>
