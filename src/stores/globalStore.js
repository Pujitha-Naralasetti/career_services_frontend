import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore("dataStore", () => {
  const snackBar = ref({
    value: false,
    color: "",
    text: "",
  });

  const userInfo = ref({
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

  return { snackBar, userInfo };
});
