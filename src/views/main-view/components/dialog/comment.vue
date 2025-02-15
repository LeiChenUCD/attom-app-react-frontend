<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { CommentFormProps } from "./utils/types";
//import CustomEditor from '@/components/custom-editor/index.vue'
//import CustomUpload from '@/components/custom-upload/index.vue'
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const props = withDefaults(defineProps<CommentFormProps>(), {
  formInline: () => ({
    detail: null,
    currentComment: null,
    comment: ''
  })
});

const commentList = ref([{
  value: 'Called, cannot reach',
  label: 'Called, cannot reach'
}, {
  value: 'Called owner, not interested',
  label: 'Called owner, not interested'
}, {
  value: 'Called owner, need to follow up',
  label: 'Called owner, need to follow up'
}, {
  value: '(Priority) called owner, show interest of selling, FOLLOW UP',
  label: '(Priority) called owner, show interest of selling, FOLLOW UP'
}, {
  value: 'Replied to REI with interest',
  label: 'Replied to REI with interest'
}, {
  value: 'Replied to mail chimp with interest',
  label: 'Replied to mail chimp with interest'
}])
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const commentHistory = buildCommentHistory();

function buildCommentHistory() {
  const notes = props.formInline?.currentComment?.fields?.Notes || [];
  if (notes?.length > 0) {
    for (let i = 0; i < notes.length; i++) {
      const item = notes[i];
      if (item?.text) {
        const list = item.text.split('\n').map(line => line.trim());
        item.list = list;
      } else {
        item.list = [];
      }
    }
  }
  return notes;
}

function getRef() {
  return ruleFormRef.value;
}

function onAddQuickComment(item: any) {
  const comment = newFormInline.value.comment || '';
  let newComment = '';
  if (comment) {
    newComment = `${comment}${item.value}`;
  } else {
    newComment = `${item.value}`;
  }
  newFormInline.value.comment = `${newComment}`;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="160px"
  >
    <el-form-item v-if="commentHistory?.length > 0" label-position="top" label="Comment History">
      <div class="comment-history-list">
        <div class="item" 
          v-for="(comment, index) in commentHistory" 
          :key="index">
          <div v-for="(item, index) in comment.list" :key="index">{{ item }}</div>
          <!--div v-html="comment?.text"></div-->
        </div>
      </div>
    </el-form-item>

    <el-form-item label="Comment" label-position="top" prop="comment">
      <el-input
        v-model="newFormInline.comment"
        :rows="6"
        placeholder="Please enter comment."
        type="textarea"
      />
      <div class="comment-list">
        <div class="item" 
          v-for="(item, index) in commentList" 
          :key="index">
          <el-link @click="onAddQuickComment(item)">{{ item.label }}</el-link>
        </div>
    </div>
    </el-form-item>
  </el-form>
</template>
<style lang="scss" scoped>
  .comment-history-list {
    width: 100%;
    max-height: 150px;
    overflow: auto;
    .item {

    }
  }
</style>