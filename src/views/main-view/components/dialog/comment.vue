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

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const commentHistory = props.formInline?.currentComment?.fields?.Notes || [];

function getRef() {
  return ruleFormRef.value;
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
    <el-form-item v-if="commentHistory?.length > 0" label="Comment History">
      <div class="comment-history-list">
        <div class="item" v-for="(item, index) in commentHistory" 
          :key="index">
          <div v-html="item?.text"></div>
        </div>
      </div>
    </el-form-item>

    <el-form-item label="Comment" prop="comment">
      <el-input
        v-model="newFormInline.comment"
        :rows="6"
        placeholder="Please enter comment."
        type="textarea"
      />
    </el-form-item>
  </el-form>
</template>
<style lang="scss" scoped>
  .comment-history-list {
    max-height: 300px;
    overflow: auto;
    .item {

    }
  }
</style>