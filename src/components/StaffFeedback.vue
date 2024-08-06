<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../stores/globalStore';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const props = defineProps({
  resumeId: null,
  feedback: [],
});
const router = useRouter();
const globalStore = useGlobalStore();
const { userInfo } = storeToRefs(globalStore);
const staffFeedback = ref([]);
const editingReplyIndex = ref(null);
const editingCommentIndex = ref(null);

onMounted(async () => {
  staffFeedback.value = props?.feedback;
});

function addFeedback() {
  editingCommentIndex.value = staffFeedback.value.length;
  staffFeedback.value.push({
    staffId: userInfo.value?.id,
    staff: userInfo.value,
    comments: "",
    reply: "",
  });
}

function deleteFeedback(index) {
  staffFeedback.value.splice(index, 1);
}

function editComment(index) {
  editingCommentIndex.value = index;
}

function editReply(index) {
  editingReplyIndex.value = index;
}

function closeReply() {
  editingReplyIndex.value = null;
}

function closeComment() {
  editingCommentIndex.value = null;
}
function returnFeedbackContent() {
  editingReplyIndex.value = null;
  editingCommentIndex.value = null;
  return staffFeedback.value;
}
defineExpose({
  returnFeedbackContent
});
</script>

<template>
  <v-card color="#232323" class="rounded-lg elevation-5">
    <v-card-title class="headline mb-2">Staff Feedback</v-card-title>
    <v-card-text>
      <v-row align="center">
        <v-col cols="12">
          <v-row justify="center" align="center" class="mt-3">
            <v-col cols="12">
              <p v-if="staffFeedback?.length == 0" v-bind:style="{
                color: '#707070',
                'font-size': '14px',
                textAlign: 'center',
              }">
                {{ userInfo.roleId === 1 ? "You didn't received any feedback from staff yet..." :
                "No data available. Click on Add New to give Feedback..." }}
              </p>
              <v-row v-for="(feedback, fIndex) in staffFeedback" :key="fIndex" align="center">
                <v-col cols="11">
                  <v-row justify="space-between" align="center">
                    <v-col cols="8">
                      <v-textarea v-if="editingCommentIndex === fIndex" v-model="feedback.comments" label="Comments*"
                        required rows="2" outlined>
                        <template #append>
                          <v-btn @click="closeComment(fIndex)" color="primary">OK</v-btn>
                        </template>
                      </v-textarea>
                      <v-row v-else>
                        <v-col cols="2" class="d-flex flex-row-reverse">
                          <v-avatar color="#7952C0" :style="{ 'cursor': 'pointer' }">
                            <span class="white-text text-h5">{{
                `${feedback?.staff?.firstName?.toUpperCase().charAt(0)}${feedback?.staff?.lastName?.toUpperCase().charAt(0)}`
              }}</span><v-tooltip activator="parent" location="bottom">{{ feedback?.staff?.firstName +
                " " +
                feedback?.staff?.lastName
                              }}</v-tooltip>
                          </v-avatar>
                        </v-col>
                        <v-col cols="10">
                          <v-card :class="!feedback.comments ? 'redBorder' : ''" color="#3a3a3a"
                            :style="{ 'padding': '10px', 'min-height': '50px' }">
                            <v-row>
                              <v-col cols="10">
                                <p>{{ feedback.comments }}</p>
                              </v-col>
                              <v-col cols="2" align="end">
                                <v-btn v-if="userInfo.roleId === 2" :disabled="userInfo?.id != feedback?.staffId" icon
                                  size="x-small" @click="editComment(fIndex)" color="black">
                                  <v-icon color="blue">mdi-pencil</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row align="center" class="flex-row-reverse">
                    <v-col cols="7">
                      <v-textarea v-if="editingReplyIndex === fIndex" v-model="feedback.reply" label="Reply" rows="2"
                        outlined>
                        <template #append>
                          <v-btn v-if="editingReplyIndex === fIndex" @click="closeReply(fIndex)"
                            color="primary">OK</v-btn>
                        </template>
                      </v-textarea>
                      <v-card v-else color="#3a3a3a" :style="{ 'padding': '10px', 'min-height': '50px' }">
                        <v-row>
                          <v-col cols="1">
                            <v-icon color="#232323">mdi-reply</v-icon>
                          </v-col>
                          <v-col cols="9">
                            <p v-if="feedback.reply">{{ feedback.reply }}</p>
                            <p v-else v-bind:style="{
                color: '#707070',
                'font-size': '12px',
                'margin-top': '4px'
              }">{{ userInfo.roleId === 1 ? "Enter your response here..." : "This space is for Student reply..." }}</p>
                          </v-col>
                          <v-col cols="2" align="end">
                            <v-btn v-if="userInfo.roleId === 1" icon size="x-small" @click="editReply(fIndex)"
                              color="black">
                              <v-icon color="blue">mdi-pencil</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider inset vertical></v-divider>
                <v-col cols="1">
                  <v-btn v-if="userInfo.roleId === 2" :disabled="userInfo?.id != feedback?.staffId" icon size="x-small"
                    @click="deleteFeedback(fIndex)" color="black">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                </v-col>
                <v-divider v-if="fIndex < staffFeedback?.length - 1" class="mb-2"></v-divider>
              </v-row>
              <v-row v-if="userInfo.roleId === 2" justify="center" class="mt-3 mb-3">
                <v-btn @click="addFeedback" color="primary">
                  <v-icon left>mdi-plus</v-icon>
                  Add New
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<style scoped>
.redBorder {
  border: 1px solid red;
}
</style>