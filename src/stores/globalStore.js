import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore("dataStore", () => {
  const snackBar = ref({
    value: false,
    color: "",
    text: "",
  });
  
  const progressBar = ref(false);

  const userInfo = ref({
    id: null,
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    roleId: null,
    nationality: "",
    address: "",
    dateOfBirth: null,
  });

  return { snackBar, userInfo, progressBar };
});
