import apiClient from "./services";

export default {
  getAllResumes() {
    return apiClient.get("resumes");
  },
  getResumesByUserId(userId) {
    return apiClient.get("resumes/user/" + userId);
  },
  getResumeById(resumeId) {
    return apiClient.get("resumes/" + resumeId);
  },
  getSampleResumes() {
    return apiClient.get("resumes/getAllSampleTemplates");
  },
  checkResumeCompatibility(data) {
    return apiClient.post("feedback/getFeedbackFromAI", data);
  },
  addResume(userId, data) {
    return apiClient.post("resumes/" + userId, data);
  },
  updateResume(resumeId, data) {
    return apiClient.put("resumes/" + resumeId, data);
  },
  deleteResume(resumeId) {
    return apiClient.delete("resumes/" + resumeId);
  },
  getDashboardDetails(data) {
    return apiClient.post("dashboard/getDashboardDetails", data);
  },
  updateFeedback(data) {
    return apiClient.post("feedback/updateFeedback", data);
  },
};
