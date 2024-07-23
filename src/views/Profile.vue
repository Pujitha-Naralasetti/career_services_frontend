<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import VueDatePicker from '@vuepic/vue-datepicker';
import UserServices from "../services/UserServices.js";
import { useGlobalStore } from "../stores/globalStore.js";
import { storeToRefs } from "pinia";
import moment from "moment";
import ProfileServices from "../services/ProfileServices.js";

const router = useRouter();

const globalStore = useGlobalStore();
const { snackBar, userInfo, progressBar } = storeToRefs(globalStore);
const genders = ref(["Male", "Female"]);
const onlineProfiles = ref(["Linked In", "GitHub"]);
const isEditProfile = ref(false);
const isEditEducation = ref(false);
const isEditCertificates = ref(false);
const isEditSkills = ref(false);
const isEditLanguages = ref(false);
const isEditOnlineProfiles = ref(false);
const isEditAwards = ref(false);
const isEditExperience = ref(false);
const isEditProjects = ref(false);
const showDeleteConf = ref(false);
const emailInValid = ref(false);
const skillName = ref("");
const languageName = ref("");
const certificateDetails = ref([]);
const awardsAndAchievements = ref([]);
const skillDetails = ref([]);
const languageDetails = ref([]);
const onlineProfileDetails = ref([]);
const experienceDetails = ref([]);
const projectDetails = ref([]);
const educationDetails = ref([]);
const user = ref({
    id: "",
    roleId: "",
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
    if (userInfo.value?.roleId == 1) {
        await getFullProfile(userInfo.value?.id);
    } else {
        await getUser(userInfo.value?.id);
    }
});

async function getUser(userId) {
    progressBar.value = true;
    await UserServices.getUserById(userId)
        .then((response) => {
            progressBar.value = false;
            emailInValid.value = false;
            isEditProfile.value = false;
            user.value = {
                id: response?.data?.id,
                roleId: response?.data?.roleId,
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
async function getFullProfile(userId) {
    progressBar.value = true;
    await ProfileServices.getFullProfile(userId)
        .then((response) => {
            progressBar.value = false;
            emailInValid.value = false;
            isEditProfile.value = false;
            let result = response?.data?.data[0];
            user.value = {
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
            }
            educationDetails.value = result?.education;
            certificateDetails.value = result?.certifications;
            skillDetails.value = result?.skills;
            languageDetails.value = result?.languages;
            onlineProfileDetails.value = result?.onlineProfiles;
            awardsAndAchievements.value = result?.awards;
            experienceDetails.value = result?.experiences;
            projectDetails.value = result?.projects;
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

function addEducation() {
    educationDetails.value.push({
        userId: user.value.id,
        institutionName: '',
        degree: '',
        course: '',
        startDate: null,
        endDate: null,
        gpa: '',
        address: ''
    });
}

function deleteEducation(index) {
    educationDetails.value.splice(index, 1);
}

function openEditEducation() {
    isEditEducation.value = true;
}

function closeEditEducation() {
    isEditEducation.value = false;
    getEducation();
}

async function updateEducationDetails() {
    await ProfileServices.updateEducation(user?.value?.id, educationDetails.value)
        .then((response) => {
            if (response.data.status === "Success") {
                isEditEducation.value = false;
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data.message,
                }
                educationDetails.value = response.data.data;
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

function addCertificates() {
    certificateDetails.value.push({
        userId: user.value.id,
        name: '',
        issuedBy: '',
        startDate: null,
        endDate: null,
        grade: ''
    });
}

function deleteCertificates(index) {
    certificateDetails.value.splice(index, 1);
}

function openEditCertificates() {
    isEditCertificates.value = true;
}

function closeEditCertificates() {
    isEditCertificates.value = false;
    getCertificates();
}

async function updateCertificatesDetails() {
    await ProfileServices.updateCertificates(user?.value?.id, certificateDetails.value)
        .then((response) => {
            if (response.data.status === "Success") {
                isEditCertificates.value = false;
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data.message,
                }
                certificateDetails.value = response.data.data;
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

function addAwards() {
    awardsAndAchievements.value.push({
        userId: user.value.id,
        title: '',
        issuedBy: '',
        date: null,
        description: '',
    });
}

function deleteAwards(index) {
    awardsAndAchievements.value.splice(index, 1);
}

function openEditAwards() {
    isEditAwards.value = true;
}

function closeEditAwards() {
    isEditAwards.value = false;
    getAwards();
}

async function updateAwardsDetails() {
    await ProfileServices.updateAwards(user?.value?.id, awardsAndAchievements.value)
        .then((response) => {
            if (response.data.status === "Success") {
                isEditAwards.value = false;
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data.message,
                }
                awardsAndAchievements.value = response.data.data;
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

function addExperience() {
    experienceDetails.value.push({
        userId: user.value.id,
        company: '',
        designation: '',
        isInternship: false,
        jobType: 'Full Time',
        startDate: null,
        endDate: null,
        address: ''
    });
}

function deleteExperience(index) {
    experienceDetails.value.splice(index, 1);
}

function openEditExperience() {
    isEditExperience.value = true;
}

function closeEditExperience() {
    isEditExperience.value = false;
    getExperience();
}

async function updateExperienceDetails() {
    await ProfileServices.updateExperience(user?.value?.id, experienceDetails.value)
        .then((response) => {
            if (response.data.status === "Success") {
                isEditExperience.value = false;
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data.message,
                }
                experienceDetails.value = response.data.data;
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

function addProjects() {
    projectDetails.value.push({
        userId: user.value.id,
        title: '',
        company: '',
        description: '',
        link: '',
        startDate: null,
        endDate: null,
    });
}

function deleteProjects(index) {
    projectDetails.value.splice(index, 1);
}

function openEditProjects() {
    isEditProjects.value = true;
}

function closeEditProjects() {
    isEditProjects.value = false;
    getProjects();
}

async function updateProjectsDetails() {
    await ProfileServices.updateProjects(user?.value?.id, projectDetails.value)
        .then((response) => {
            if (response.data.status === "Success") {
                isEditProjects.value = false;
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data.message,
                }
                projectDetails.value = response.data.data;
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

function addOnlineProfiles() {
    onlineProfileDetails.value.push({
        userId: user.value.id,
        name: '',
        link: '',
    });
}

function deleteOnlineProfiles(index) {
    onlineProfileDetails.value.splice(index, 1);
}

function openEditOnlineProfiles() {
    isEditOnlineProfiles.value = true;
}

function closeEditOnlineProfiles() {
    isEditOnlineProfiles.value = false;
    getOnlineProfiles();
}

async function updateOnlineProfilesDetails() {
    await ProfileServices.updateOnlineProfiles(user?.value?.id, onlineProfileDetails.value)
        .then((response) => {
            if (response.data.status === "Success") {
                isEditOnlineProfiles.value = false;
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data.message,
                }
                onlineProfileDetails.value = response.data.data;
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

function addSkills(skill) {
    skillDetails.value.push({
        userId: user.value.id,
        id: null,
        name: skill,
    });
    skillName.value = "";
}

function deleteSkills(index) {
    skillDetails.value.splice(index, 1);
}

function openEditSkills() {
    isEditSkills.value = true;
}

function closeEditSkills() {
    isEditSkills.value = false;
    getSkills();
}

async function updateSkillsDetails() {
    await ProfileServices.updateSkills(user?.value?.id, skillDetails.value)
        .then((response) => {
            if (response.data.status === "Success") {
                isEditSkills.value = false;
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data.message,
                }
                skillDetails.value = response.data.data;
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

function addLanguages(language) {
    languageDetails.value.push({
        userId: user.value.id,
        id: null,
        name: language,
    });
    languageName.value = "";
}

function deleteLanguages(index) {
    languageDetails.value.splice(index, 1);
}

function openEditLanguages() {
    isEditLanguages.value = true;
}

function closeEditLanguages() {
    isEditLanguages.value = false;
    getLanguages();
}

async function updateLanguagesDetails() {
    await ProfileServices.updateLanguages(user?.value?.id, languageDetails.value)
        .then((response) => {
            if (response.data.status === "Success") {
                isEditLanguages.value = false;
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data.message,
                }
                languageDetails.value = response.data.data;
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

async function getEducation() {
    await ProfileServices.getEducationByUserId(user?.value?.id)
        .then((response) => {
            if (response.data.status === "Success") {
                educationDetails.value = response.data.data;
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
async function getCertificates() {
    await ProfileServices.getCertificatesByUserId(user?.value?.id)
        .then((response) => {
            if (response.data.status === "Success") {
                certificateDetails.value = response.data.data;
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
async function getSkills() {
    await ProfileServices.getSkillsByUserId(user?.value?.id)
        .then((response) => {
            if (response.data.status === "Success") {
                skillDetails.value = response.data.data;
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
async function getLanguages() {
    await ProfileServices.getLanguagesByUserId(user?.value?.id)
        .then((response) => {
            if (response.data.status === "Success") {
                languageDetails.value = response.data.data;
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
async function getOnlineProfiles() {
    await ProfileServices.getOnlineProfilesByUserId(user?.value?.id)
        .then((response) => {
            if (response.data.status === "Success") {
                onlineProfileDetails.value = response.data.data;
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
async function getAwards() {
    await ProfileServices.getAwardsByUserId(user?.value?.id)
        .then((response) => {
            if (response.data.status === "Success") {
                awardsAndAchievements.value = response.data.data;
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
async function getExperience() {
    await ProfileServices.getExperienceByUserId(user?.value?.id)
        .then((response) => {
            if (response.data.status === "Success") {
                experienceDetails.value = response.data.data;
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
async function getProjects() {
    await ProfileServices.getProjectsByUserId(user?.value?.id)
        .then((response) => {
            if (response.data.status === "Success") {
                projectDetails.value = response.data.data;
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
</script>
<template>
    <v-container>
        <v-row align="center" justify="space-between">
            <v-col cols="auto">
                <p class="text-h4">
                    Profile
                </p>
            </v-col>
            <v-col cols="auto">
                <v-btn class="mr-3" variant="flat" color="secondary" :to="{ name: 'dashboard' }">Back</v-btn>
            </v-col>
        </v-row>
        <v-card class="mt-3 rounded-lg elevation-5" color="#232323" dark>
            <v-card-title>
                <v-row align="center" justify="space-between">
                    <v-col cols="auto">
                        <p class="text-h5 font-italic">
                            Personal Info:
                        </p>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn class="ma-2" color="black" size="x-small" icon="mdi-pencil"
                            @click="openEditProfile"></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-row class="mt-1 mx-15" align="center">
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
            </v-card-text>
        </v-card>

        <v-card v-if="user.roleId == 1" class="mt-3 rounded-lg elevation-5" color="#232323" dark>
            <v-card-title>
                <v-row align="center" justify="space-between">
                    <v-col cols="auto">
                        <p class="text-h5 font-italic">
                            Education:
                        </p>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn class="ma-2" color="black" size="x-small" icon="mdi-pencil"
                            @click="openEditEducation"></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <p v-if="educationDetails?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available...
                </p>
                <v-row v-for="(education, eIndex) in educationDetails" :key="eIndex" class="mt-1 mx-15" align="center">
                    <v-col cols="6">
                        <p><b>College/University: </b>{{ education.institutionName }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Degree: </b>{{ education.degree }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Course: </b>{{ education.course }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Duration: </b>{{ moment(education.startDate).format('YYYY-MM-DD') }} <i>to</i> {{
                    moment(education.endDate).format('YYYY-MM-DD') }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Percentage/gpa: </b>{{ education.gpa }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Address: </b>{{ education.address }}</p>
                    </v-col>
                    <v-divider v-if="eIndex < educationDetails?.length - 1" class="mb-2"></v-divider>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card v-if="user.roleId == 1" class="mt-3 rounded-lg elevation-5" color="#232323" dark>
            <v-card-title>
                <v-row align="center" justify="space-between">
                    <v-col cols="auto">
                        <p class="text-h5 font-italic">
                            Certifications:
                        </p>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn class="ma-2" color="black" size="x-small" icon="mdi-pencil"
                            @click="openEditCertificates"></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <p v-if="certificateDetails?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available...
                </p>
                <v-row v-for="(cert, cIndex) in certificateDetails" :key="cIndex" class="mt-1 mx-15" align="center">
                    <v-col cols="6">
                        <p><b>Name: </b>{{ cert.name }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Issued By: </b>{{ cert.issuedBy }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Duration: </b>{{ moment(cert.startDate).format('YYYY-MM-DD') }} - {{
                    moment(cert.endDate).format('YYYY-MM-DD') }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Percentage/Grade: </b>{{ cert.grade }}</p>
                    </v-col>
                    <v-divider v-if="cIndex < certificateDetails?.length - 1" class="mb-2"></v-divider>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card v-if="user.roleId == 1" class="mt-3 rounded-lg elevation-5" color="#232323" dark>
            <v-card-title>
                <v-row align="center" justify="space-between">
                    <v-col cols="auto">
                        <p class="text-h5 font-italic">
                            Skills:
                        </p>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn class="ma-2" color="black" size="x-small" icon="mdi-pencil"
                            @click="openEditSkills"></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <p v-if="skillDetails?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available...
                </p>
                <v-row v-for="(skill, sIndex) in skillDetails" :key="sIndex" class="mt-1 mx-15" align="center">
                    <li class="mb-4">{{ skill.name }}
                    </li>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card v-if="user.roleId == 1" class="mt-3 rounded-lg elevation-5" color="#232323" dark>
            <v-card-title>
                <v-row align="center" justify="space-between">
                    <v-col cols="auto">
                        <p class="text-h5 font-italic">
                            Languages:
                        </p>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn class="ma-2" color="black" size="x-small" icon="mdi-pencil"
                            @click="openEditLanguages"></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <p v-if="languageDetails?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available...
                </p>
                <v-row v-for="(language, lIndex) in languageDetails" :key="lIndex" class="mt-1 mx-15" align="center">
                    <li class="mb-4">{{ language.name }}
                    </li>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card v-if="user.roleId == 1" class="mt-3 rounded-lg elevation-5" color="#232323" dark>
            <v-card-title>
                <v-row align="center" justify="space-between">
                    <v-col cols="auto">
                        <p class="text-h5 font-italic">
                            Awards & Achievements:
                        </p>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn class="ma-2" color="black" size="x-small" icon="mdi-pencil"
                            @click="openEditAwards"></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <p v-if="awardsAndAchievements?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available...
                </p>
                <v-row v-for="(award, aIndex) in awardsAndAchievements" :key="aIndex" class="mt-1 mx-15" align="center">
                    <v-col cols="6">
                        <p><b>Title: </b>{{ award.title }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Issued By: </b>{{ award.issuedBy }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Date: </b>{{ moment(award.date).format('YYYY-MM-DD') }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Description: </b>{{ award.description }}</p>
                    </v-col>
                    <v-divider v-if="aIndex < awardsAndAchievements?.length - 1" class="mb-2"></v-divider>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card v-if="user.roleId == 1" class="mt-3 rounded-lg elevation-5" color="#232323" dark>
            <v-card-title>
                <v-row align="center" justify="space-between">
                    <v-col cols="auto">
                        <p class="text-h5 font-italic">
                            Experience:
                        </p>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn class="ma-2" color="black" size="x-small" icon="mdi-pencil"
                            @click="openEditExperience"></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <p v-if="experienceDetails?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available...
                </p>
                <v-row v-for="(exp, eIndex) in experienceDetails" :key="eIndex" class="mt-1 mx-15" align="center">
                    <v-col cols="6">
                        <p><b>Company: </b>{{ exp.company }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Designation: </b>{{ exp.designation }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Is Internship: </b>{{ exp.isInternship }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Job Type: </b>{{ exp.jobType }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Duration: </b>{{ moment(exp.startDate).format('YYYY-MM-DD') }} - {{
                    exp.endDate ? moment(exp.endDate).format('YYYY-MM-DD') : "On Going" }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Address: </b>{{ exp.address }}</p>
                    </v-col>
                    <v-divider v-if="eIndex < experienceDetails?.length - 1" class="mb-2"></v-divider>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card v-if="user.roleId == 1" class="mt-3 rounded-lg elevation-5" color="#232323" dark>
            <v-card-title>
                <v-row align="center" justify="space-between">
                    <v-col cols="auto">
                        <p class="text-h5 font-italic">
                            Projects:
                        </p>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn class="ma-2" color="black" size="x-small" icon="mdi-pencil"
                            @click="openEditProjects"></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <p v-if="projectDetails?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available...
                </p>
                <v-row v-for="(project, pIndex) in projectDetails" :key="pIndex" class="mt-1 mx-15" align="center">
                    <v-col cols="6">
                        <p><b>Title: </b>{{ project.title }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Company: </b>{{ project.company }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Description: </b>{{ project.description }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Duration: </b>{{ moment(project.startDate).format('YYYY-MM-DD') }} - {{
                    project.endDate ? moment(project.endDate).format('YYYY-MM-DD') : "On Going" }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Project Link: </b>{{ project.link }}</p>
                    </v-col>
                    <v-divider v-if="pIndex < projectDetails?.length - 1" class="mb-2"></v-divider>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card v-if="user.roleId == 1" class="mt-3 rounded-lg elevation-5" color="#232323" dark>
            <v-card-title>
                <v-row align="center" justify="space-between">
                    <v-col cols="auto">
                        <p class="text-h5 font-italic">
                            Online Profiles:
                        </p>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn class="ma-2" color="black" size="x-small" icon="mdi-pencil"
                            @click="openEditOnlineProfiles"></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <p v-if="onlineProfileDetails?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available...
                </p>
                <v-row v-for="(profile, profileIndex) in onlineProfileDetails" :key="profileIndex" class="mt-1 mx-15"
                    align="center">
                    <v-col cols="6">
                        <p><b>Name: </b>{{ profile.name }}</p>
                    </v-col>
                    <v-col cols="6">
                        <p><b>Link: </b>{{ profile.link }}</p>
                    </v-col>
                    <v-divider v-if="profileIndex < onlineProfileDetails?.length - 1" class="mb-2"></v-divider>
                </v-row>
            </v-card-text>
        </v-card>
        <v-row class="mt-4" align="center" justify="center">
            <v-col cols="auto">
                <v-btn variant="flat" color="red" @click="(e) => openDeletePopup(e)" :disabled="!user?.id">Deactivate
                    Account</v-btn>
            </v-col>
        </v-row>
    </v-container>
    <v-dialog persistent v-model="isEditEducation" width="700">
        <v-card color="#232323" class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">Edit Education</v-card-title>
            <v-card-text>
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
                    <v-divider v-if="eIndex < educationDetails?.length - 1" class="mb-2"></v-divider>
                </v-row>
                <v-row justify="center" class="mt-3">
                    <v-btn @click="addEducation" color="primary">
                        <v-icon left>mdi-plus</v-icon>
                        Add New
                    </v-btn>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeEditEducation">Close</v-btn>
                <v-btn variant="outlined" @click="updateEducationDetails">Update Education</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog persistent v-model="isEditCertificates" width="700">
        <v-card color="#232323" class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">Edit Certificates</v-card-title>
            <v-card-text>
                <p v-if="certificateDetails?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available. Click on Add New to insert data...
                </p>
                <v-row v-for="(cert, cIndex) in certificateDetails" :key="cIndex" align="center">
                    <v-col cols="11">
                        <v-row align="center">
                            <v-col cols="6">
                                <v-text-field v-model="cert.name" label="Name*" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="cert.issuedBy" label="Issued By"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="cert.grade" label="Percentage/Grade*" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <VueDatePicker v-model="cert.startDate" :enable-time-picker="false" color="#232323"
                                    placeholder="Start Date*" dark>
                                </VueDatePicker>
                            </v-col>
                            <v-col cols="6">
                                <VueDatePicker v-model="cert.endDate" :enable-time-picker="false" color="#232323"
                                    placeholder="End Date" dark>
                                </VueDatePicker>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="1">
                        <v-btn icon size="x-small" @click="deleteCertificates(cIndex)" color="black">
                            <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                    </v-col>
                    <v-divider v-if="cIndex < certificateDetails?.length - 1" class="mb-2"></v-divider>
                </v-row>
                <v-row justify="center" class="mt-3">
                    <v-btn @click="addCertificates" color="primary">
                        <v-icon left>mdi-plus</v-icon>
                        Add New
                    </v-btn>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeEditCertificates">Close</v-btn>
                <v-btn variant="outlined" @click="updateCertificatesDetails">Update Certificates</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog persistent v-model="isEditSkills" width="700">
        <v-card color="#232323" class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">Edit Skills</v-card-title>
            <v-card-text>
                <p v-if="skillDetails?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available. Click on Add New to insert data...
                </p>
                <template v-for="(skill, sIndex) in skillDetails" :key="sIndex">
                    <v-chip class="ma-2" label>{{ skill?.name }}
                        <v-icon end icon="mdi-close-circle" @click="deleteSkills(sIndex)"></v-icon>
                    </v-chip>
                </template>
                <v-row justify="center" align="center" class="mt-3">
                    <v-col cols="4">
                        <v-text-field v-model="skillName" label="Enter skill..."
                            @keydown.enter="addSkills(skillName)"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-btn @click="addSkills(skillName)" color="primary">
                            <v-icon left>mdi-plus</v-icon>
                            Add
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeEditSkills">Close</v-btn>
                <v-btn variant="outlined" @click="updateSkillsDetails">Update Skills</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog persistent v-model="isEditLanguages" width="700">
        <v-card color="#232323" class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">Edit Languages</v-card-title>
            <v-card-text>
                <p v-if="languageDetails?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available. Click on Add New to insert data...
                </p>
                <template v-for="(language, lIndex) in languageDetails" :key="lIndex">
                    <v-chip class="ma-2" label>{{ language?.name }}
                        <v-icon end icon="mdi-close-circle" @click="deleteLanguages(lIndex)"></v-icon>
                    </v-chip>
                </template>
                <v-row justify="center" align="center" class="mt-3">
                    <v-col cols="4">
                        <v-text-field v-model="languageName" label="Enter language..."
                            @keydown.enter="addLanguages(languageName)"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-btn @click="addLanguages(languageName)" color="primary">
                            <v-icon left>mdi-plus</v-icon>
                            Add
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeEditLanguages">Close</v-btn>
                <v-btn variant="outlined" @click="updateLanguagesDetails">Update Languages</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog persistent v-model="isEditAwards" width="700">
        <v-card color="#232323" class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">Edit Awards</v-card-title>
            <v-card-text>
                <p v-if="awardsAndAchievements?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available. Click on Add New to insert data...
                </p>
                <v-row v-for="(award, aIndex) in awardsAndAchievements" :key="aIndex" align="center">
                    <v-col cols="11">
                        <v-row align="center">
                            <v-col cols="6">
                                <v-text-field v-model="award.title" label="Title*" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="award.issuedBy" label="Issued By*" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="award.description" label="Description" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <VueDatePicker v-model="award.date" :enable-time-picker="false" color="#232323"
                                    placeholder="Issued Date" dark>
                                </VueDatePicker>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="1">
                        <v-btn icon size="x-small" @click="deleteAwards(aIndex)" color="black">
                            <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                    </v-col>
                    <v-divider v-if="aIndex < awardsAndAchievements?.length - 1" class="mb-2"></v-divider>
                </v-row>
                <v-row justify="center" class="mt-3">
                    <v-btn @click="addAwards" color="primary">
                        <v-icon left>mdi-plus</v-icon>
                        Add New
                    </v-btn>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeEditAwards">Close</v-btn>
                <v-btn variant="outlined" @click="updateAwardsDetails">Update Awards</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog persistent v-model="isEditExperience" width="700">
        <v-card color="#232323" class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">Edit Experience</v-card-title>
            <v-card-text>
                <p v-if="experienceDetails?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available. Click on Add New to insert data...
                </p>
                <v-row v-for="(exp, eIndex) in experienceDetails" :key="eIndex" align="center">
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
                        </v-row>
                    </v-col>
                    <v-col cols="1">
                        <v-btn icon size="x-small" @click="deleteExperience(eIndex)" color="black">
                            <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                    </v-col>
                    <v-divider v-if="eIndex < experienceDetails?.length - 1" class="mb-2"></v-divider>
                </v-row>
                <v-row justify="center" class="mt-3">
                    <v-btn @click="addExperience" color="primary">
                        <v-icon left>mdi-plus</v-icon>
                        Add New
                    </v-btn>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeEditExperience">Close</v-btn>
                <v-btn variant="outlined" @click="updateExperienceDetails">Update Experience</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog persistent v-model="isEditProjects" width="700">
        <v-card color="#232323" class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">Edit Projects</v-card-title>
            <v-card-text>
                <p v-if="projectDetails?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available. Click on Add New to insert data...
                </p>
                <v-row v-for="(project, pIndex) in projectDetails" :key="pIndex" align="center">
                    <v-col cols="11">
                        <v-row align="center">
                            <v-col cols="6">
                                <v-text-field v-model="project.title" label="Title*" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="project.company" label="Company*" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="project.link" label="Project Link" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="project.description" label="Description" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <VueDatePicker v-model="project.startDate" :enable-time-picker="false" color="#232323"
                                    placeholder="Start Date*" dark>
                                </VueDatePicker>
                            </v-col>
                            <v-col cols="6">
                                <VueDatePicker v-model="project.endDate" :enable-time-picker="false" color="#232323"
                                    placeholder="End Date" dark>
                                </VueDatePicker>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="1">
                        <v-btn icon size="x-small" @click="deleteProjects(pIndex)" color="black">
                            <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                    </v-col>
                    <v-divider v-if="pIndex < projectDetails?.length - 1" class="mb-2"></v-divider>
                </v-row>
                <v-row justify="center" class="mt-3">
                    <v-btn @click="addProjects" color="primary">
                        <v-icon left>mdi-plus</v-icon>
                        Add New
                    </v-btn>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeEditProjects">Close</v-btn>
                <v-btn variant="outlined" @click="updateProjectsDetails">Update Projects</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog persistent v-model="isEditOnlineProfiles" width="700">
        <v-card color="#232323" class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">Edit Online Profiles</v-card-title>
            <v-card-text>
                <p v-if="onlineProfileDetails?.length == 0" colspan="8" v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                    textAlign: 'center',
                }">
                    No data available. Click on Add New to insert data...
                </p>
                <v-row v-for="(project, profileIndex) in onlineProfileDetails" :key="profileIndex" align="center">
                    <v-col cols="11">
                        <v-row align="center">
                            <v-col cols="6">
                                <v-select :items="onlineProfiles" label="Profile Name*" v-model="project.name"
                                    required></v-select>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="project.link" label="Profile Link*" required></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="1">
                        <v-btn icon size="x-small" @click="deleteOnlineProfiles(profileIndex)" color="black">
                            <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                    </v-col>
                    <v-divider v-if="profileIndex < onlineProfileDetails?.length - 1" class="mb-2"></v-divider>
                </v-row>
                <v-row justify="center" class="mt-3">
                    <v-btn @click="addOnlineProfiles" color="primary">
                        <v-icon left>mdi-plus</v-icon>
                        Add New
                    </v-btn>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeEditOnlineProfiles">Close</v-btn>
                <v-btn variant="outlined" @click="updateOnlineProfilesDetails">Update OnlineProfiles</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
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