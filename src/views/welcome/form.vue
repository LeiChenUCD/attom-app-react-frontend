<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import CustomEditor from '@/components/custom-editor/index.vue'
import CustomUpload from '@/components/custom-upload/index.vue'
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    _id: "",
    name: "",
    code: "",
    remark: "",
    imageUrl: "",
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const showImageUrl = ref('');

function getRef() {
  return ruleFormRef.value;
}

function onChangeEditor(value: any,key: any) {
  newFormInline.value[key] = value
}

function onGetImageUrl(value: any, key: any) {
  const { aliUrl, showUrl } = value
  newFormInline.value[key] = showUrl
  showImageUrl.value = showUrl
}

function onRemoveImage() {
  newFormInline.value['imageUrl'] = ''
  showImageUrl.value = ''
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="会议名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入会议名称"
      />
    </el-form-item>

    <el-form-item label="会议编码" prop="code">
      <el-input
        v-model="newFormInline.code"
        clearable
        placeholder="请输入会议编码"
      />
    </el-form-item>

    <el-form-item label="分享图片" prop="imageUrl">
      <div style="position: relative;">
        <CustomUpload :uploadUrl="'share-image/'" :url="newFormInline['imageUrl']" :limitSize="5"
          @ok="onGetImageUrl($event, 'imageUrl')" />
        <component :is="useRenderIcon('ant-design:delete-outlined')" @click="onRemoveImage"
          style="position: absolute;right: -5px;top: -5px;cursor: pointer;z-index: 1;" />
      </div>
    </el-form-item>

    <el-form-item label="备注">
      <!-- <el-input
        v-model="newFormInline.remark"
        placeholder="请输入备注信息"
        type="textarea"
      /> -->
      <CustomEditor style="width: 100%;"
                    :height="'500px'"
                    @onChange="onChangeEditor($event,'remark')"
                    :value="newFormInline.remark"/>
    </el-form-item>
  </el-form>
</template>
