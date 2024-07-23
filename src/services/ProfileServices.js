import apiClient from "./services";

export default {
  getFullProfile(userId) {
    return apiClient.get("student/profile/" + userId);
  },
  addEducation(userId, data) {
    return apiClient.post("education/" + userId, data);
  },
  updateEducation(userId, data) {
    return apiClient.put("education/" + userId, data);
  },
  getEducationByUserId(userId) {
    return apiClient.get("education/user/" + userId);
  },
  addCertificates(userId, data) {
    return apiClient.post("certificate/" + userId, data);
  },
  updateCertificates(userId, data) {
    return apiClient.put("certificate/" + userId, data);
  },
  getCertificatesByUserId(userId) {
    return apiClient.get("certificate/user/" + userId);
  },
  addAwards(userId, data) {
    return apiClient.post("award/" + userId, data);
  },
  updateAwards(userId, data) {
    return apiClient.put("award/" + userId, data);
  },
  getAwardsByUserId(userId) {
    return apiClient.get("award/user/" + userId);
  },
  addExperience(userId, data) {
    return apiClient.post("experience/" + userId, data);
  },
  updateExperience(userId, data) {
    return apiClient.put("experience/" + userId, data);
  },
  getExperienceByUserId(userId) {
    return apiClient.get("experience/user/" + userId);
  },
  addProjects(userId, data) {
    return apiClient.post("project/" + userId, data);
  },
  updateProjects(userId, data) {
    return apiClient.put("project/" + userId, data);
  },
  getProjectsByUserId(userId) {
    return apiClient.get("project/user/" + userId);
  },
  addSkills(userId, data) {
    return apiClient.post("skills/" + userId, data);
  },
  updateSkills(userId, data) {
    return apiClient.put("skills/" + userId, data);
  },
  getSkillsByUserId(userId) {
    return apiClient.get("skills/user/" + userId);
  },
  addLanguages(userId, data) {
    return apiClient.post("languages/" + userId, data);
  },
  updateLanguages(userId, data) {
    return apiClient.put("languages/" + userId, data);
  },
  getLanguagesByUserId(userId) {
    return apiClient.get("languages/user/" + userId);
  },
  addOnlineProfiles(userId, data) {
    return apiClient.post("onlineProfile/" + userId, data);
  },
  updateOnlineProfiles(userId, data) {
    return apiClient.put("onlineProfile/" + userId, data);
  },
  getOnlineProfilesByUserId(userId) {
    return apiClient.get("onlineProfile/user/" + userId);
  },
};
