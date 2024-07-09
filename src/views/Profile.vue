<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import UserServices from "../services/UserServices.js";
import { useGlobalStore } from "../stores/globalStore.js";
import { storeToRefs } from "pinia";
import moment from "moment";

const router = useRouter();

const globalStore = useGlobalStore();
const { snackBar, userInfo } = storeToRefs(globalStore);
const genders = ref(["Male", "Female"]);
const isEditProfile = ref(false);
const showDeleteConf = ref(false);
const emailInValid = ref(false);
const user = ref({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    nationality: "",
    address: "",
    dateOfBirth: null,
});

onMounted(async () => {
    // const loggedInUser = JSON.parse(localStorage.getItem("user"));
    await getUser(userInfo.value?.id);
});

async function getUser(userId) {
    await UserServices.getUserById(userId)
        .then((response) => {
            emailInValid.value = false;
            isEditProfile.value = false;
            user.value = {
                id: response?.data?.id,
                firstName: response?.data?.firstName,
                lastName: response?.data?.lastName,
                phone: response?.data?.phone,
                email: response?.data?.email,
                gender: response?.data?.gender,
                nationality: response?.data?.nationality,
                address: response?.data?.address,
                dateOfBirth: response?.data?.dateOfBirth,
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

async function deactiveAccount() {
    await UserServices.deactivateUser(user.value?.id)
        .then((response) => {
            if (response.data.status === "Success") {
                showDeleteConf.value = false;
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data.message,
                }
                setTimeout(() => {
                    localStorage.removeItem("user");
                    userInfo.value = null;
                    router.push({ name: "login" });
                }, 2000);
            } else {
                snackBar.value = {
                    value: true,
                    color: "error",
                    text: response.data.message,
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

async function updateUser() {
    await UserServices.updateUser(user?.value?.id, user.value)
        .then((response) => {
            if (response.data.status === "Success") {
                let storedUser = JSON.parse(localStorage.getItem("user"));
                storedUser.firstName = user?.value?.firstName;
                storedUser.lastName = user?.value?.lastName;
                storedUser.phone = user?.value?.phone;
                storedUser.email = user?.value?.email;
                storedUser.gender = user?.value?.gender;
                storedUser.nationality = user?.value?.nationality;
                storedUser.address = user?.value?.address;
                storedUser.dateOfBirth = user?.value?.dateOfBirth;
                userInfo.value = storedUser;
                window.localStorage.setItem("user", JSON.stringify(storedUser));
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data.message,
                }
                getUser(user.value?.id);
            } else {
                snackBar.value = {
                    value: true,
                    color: "error",
                    text: response.data.message,
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

function openEditProfile() {
    emailInValid.value = false;
    isEditProfile.value = true;
}

function closeEditProfile() {
    emailInValid.value = false;
    isEditProfile.value = false;
    getUser(user.value?.id);
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

function openDeletePopup(e) {
    e?.stopPropagation();
    showDeleteConf.value = true;
}

function closeDeletePopup() {
    showDeleteConf.value = false;
}

</script>
<template>
    <v-container>
        <v-card class="rounded-lg elevation-5" color="#232323" dark>
            <v-card-title>
                <v-row align="center" justify="space-between">
                    <v-col cols="auto">
                        <p class="text-h4">
                            Profile
                        </p>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn class="mr-3" variant="flat" color="secondary" :to="{ name: 'dashboard' }">Back</v-btn>
                        <v-btn color="primary" @click="openEditProfile">Edit</v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <p class="mt-5 text-h5 font-italic">
                    Personal Info:
                </p>
                <v-row class="mt-1 mx-15" align="center" justify="center">
                    <v-col cols="6">
                        <p><b>First Name: </b>{{ user.firstName }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Last Name: </b>{{ user.lastName }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Phone: </b>{{ user.phone }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Email: </b>{{ user.email }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Nationality: </b>{{ user.nationality }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Gender: </b>{{ user.gender }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Date of Birth: </b>{{ moment(user?.dateOfBirth).format('YYYY-MM-DD') }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Address: </b>{{ user.address }}</p>
                    </v-col>
                </v-row>
                <p class="mt-10 text-h5 font-italic">
                    Education:
                </p>
                <v-row class="mt-1" align="center" justify="center">
                </v-row>
                <p class="mt-10 text-h5 font-italic">
                    Certifications:
                </p>
                <v-row class="mt-1" align="center" justify="center">
                </v-row>
                <p class="mt-10 text-h5 font-italic">
                    Skills:
                </p>
                <v-row class="mt-1" align="center" justify="center">
                </v-row>
                <p class="mt-10 text-h5 font-italic">
                    Awards & Achievements:
                </p>
                <v-row class="mt-1" align="center" justify="center">
                </v-row>
                <p class="mt-10 text-h5 font-italic">
                    Experience:
                </p>
                <v-row class="mt-1" align="center" justify="center">
                </v-row>
                <p class="mt-10 text-h5 font-italic">
                    Projects:
                </p>
                <v-row class="mt-1" align="center" justify="center">
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-row align="center" justify="center">
                    <v-col cols="auto">
                        <v-btn variant="flat" color="red" @click="(e) => openDeletePopup(e)"
                            :disabled="!user?.id">Deactivate
                            Account</v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-container>
    <v-dialog persistent v-model="isEditProfile" width="700">
        <v-card color="#232323" class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">Edit Profile</v-card-title>
            <v-card-text>
                <v-text-field v-model="user.firstName" label="First Name*" required></v-text-field>

                <v-text-field v-model="user.lastName" label="Last Name*" required></v-text-field>

                <v-text-field v-model="user.phone" label="Phone*" required></v-text-field>

                <v-text-field v-model="user.email" label="Email*" :hint="emailInValid && 'Please enter valid email'"
                    @input="onEmailChange" required></v-text-field>


                <v-text-field v-model="user.nationality" label="Nationality*" required></v-text-field>


                <v-select :items="genders" label="Gender*" v-model="user.gender" required></v-select>


                <VueDatePicker v-model="user.dateOfBirth" :enable-time-picker="false" color="#232323"
                    placeholder="Select DOB*" dark>
                </VueDatePicker>


                <v-textarea class="mt-4" v-model="user.address" label="Address*" rows="3" outlined></v-textarea>

            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeEditProfile()">Close</v-btn>
                <v-btn variant="outlined" :disabled="emailInValid ||
                            !user.email ||
                            !user.phone ||
                            !user.nationality ||
                            !user.gender ||
                            !user.dateOfBirth ||
                            !user.firstName ||
                            !user.address ||
                            !user.lastName" @click="updateUser()">Update Profile</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog persistent v-model="showDeleteConf" width="600">
        <v-container>
            <v-card class="rounded-lg elevation-5">
                <div class="pb-2 pl-5 pt-5 pr-5">Are you sure want to deactivate the user?
                    <v-row class="mt-3">
                        <v-col class="d-flex justify-end">
                            <v-btn class="mr-3" variant="flat" color="secondary"
                                @click="closeDeletePopup()">Cancel</v-btn>
                            <v-btn variant="flat" color="primary" @click="deactiveAccount()">Confirm</v-btn>
                        </v-col>
                    </v-row>
                </div>
            </v-card>
        </v-container>
    </v-dialog>
</template>