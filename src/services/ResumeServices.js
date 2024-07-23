import apiClient from "./services";

export default {
  getResumesByUserId(userId) {
    return apiClient.get("resumes/user/" + userId);
  },
  getResumeById(resumeId) {
    return apiClient.get("resumes/" + resumeId);
  },
  getSampleResumes() {
    return apiClient.get("resumes/getAllSampleTemplates");
  },
  addResume(userId, data) {
    return apiClient.post("resumes/" + userId, data);
  },
  deleteResume(resumeId) {
    return apiClient.delete("resumes/" + resumeId);
  },
};
