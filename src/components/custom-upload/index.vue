<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadUserFile, UploadRawFile } from 'element-plus'
import {message} from "@/utils/message";
import {uploadToAliyunOSS, uploadToAliyunOSS2, uploadTokenApi} from "@/api/upload";

// 定义 porps
const props = defineProps({
  url: {
    type: String,
    default: '',
  },
  fileType: {
    type: String,
    default: '',
  },
  fileName: {
    type: String,
    default: '',
  },
  isShowFileList: {
    type: Boolean,
    default: false,
  },
  isReset: {
    type: Boolean,
    default: false,
  },
  uploadUrl: {
    type: String,
    default: 'alliance-category/',
  },
  width: {
    type: String,
    default: '108px',
  },
  height: {
    type: String,
    default: '108px',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  limitSize: {
    type: Number,
    default: 1,
  },
})

// 声明 emit
const emit = defineEmits(['ok','remove'])
const imageUrl = ref('')

const upload = ref<UploadInstance>()

const fileList = ref<UploadUserFile[]>([
])

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  emit('remove', file)
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  uploadToken(uploadFile?.raw)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/svg+xml') {
    message('只支持png、svg、jpeg格式的图片', { type: "error" });
    return false
  } else if (rawFile.size / 1024 / 1024 > props.limitSize) {
    message(`图片大小不能超过${props.limitSize}M`, { type: "error" });
    return false
  } else {
    uploadToken(rawFile)
    return false
  }
}

async function uploadToken(rawFile: any) {
  //const res = await uploadTokenApi(rawFile)
  // const {data} = res || {}
  // const data = {
  //   OSSAccessKeyId: "LTAI5tCo435JoWkgVWg89cLM",
  //   domain: "https://leceng-vip.oss-cn-shanghai.aliyuncs.com",
  //   invalidAt: 1728156897,
  //   policy: "eyJleHBpcmF0aW9uIjoiMjAyNC0xMC0wNlQwMzozNDo1N1oiLCJjb25kaXRpb25zIjpbWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwxMDQ4NTc2MF1dfQ==",
  //   signature: "wxExVOlFiaIfKDw7CTfBK9lb5wg="
  // }
  // if (data) {
    //const aliRes = await uploadToAliyunOSS(props.uploadUrl,rawFile, data);
    const aliRes = await uploadToAliyunOSS2(rawFile, props.uploadUrl)
    const {showUrl} = aliRes || {}
    if (!props.isReset) {
      showImage(showUrl, rawFile.name)
    }
    const newObj = {
        ...aliRes, // 使用扩展运算符复制 obj 的所有属性
        fileName: rawFile.name // 添加新的 fileName 属性
    };
    emit('ok',newObj)
  //}
}

function showImage(url: any, fileName: string) {
  imageUrl.value = `${url}`
  console.dir([fileName])
  if (props.isShowFileList && url) {
    const parts = url.split('/');
    //const filename = parts[parts.length - 1];
    fileList.value = [{
      name: fileName,
      url: url
    }]
  }
}

watch(
  () => props.url,
  val => {
    showImage(val, props.fileName)
  },
  {
    deep: true,
    immediate: true
  }
);
</script>

<template>
  <div v-if="fileType=='file'">
    <el-upload
      ref="upload"
      v-model:file-list="fileList"
      :auto-upload="false"
      :limit="limitSize"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
    >
      <template #trigger>
        <el-button type="primary">上传文件</el-button>
      </template>
    </el-upload>
  </div>
  <div v-else>
    <div v-if="disabled" class="avatar-uploader">
      <img v-if="imageUrl"
          :src="imageUrl"
          :style="{width: width,height:height}"
          class="avatar" />
    </div>
    <el-upload
      v-else
      class="avatar-uploader"
      :show-file-list="false"
      :auto-upload="true"
      :limit="limitSize"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl"
          :src="imageUrl"
          :style="{width: width,height:height}"
          class="avatar" />
      <el-icon v-else
              :style="{width: width,height:height}"
              class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<style scoped>
  .avatar-uploader .avatar {
    width: 108px;
    height: 108px;
    display: block;
  }
</style>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 108px;
    height: 108px;
    text-align: center;
  }
</style>
