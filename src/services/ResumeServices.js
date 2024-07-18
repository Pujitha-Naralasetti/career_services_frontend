import apiClient from "./services";

export default {
  getResumesByUserId(userId) {
    return apiClient.get("resume/" + userId);
  },
  addResume(userId, data) {
    return apiClient.post("resume/" + userId, data);
  },
};
