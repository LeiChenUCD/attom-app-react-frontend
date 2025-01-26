<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef,watch } from "vue";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import {uploadToAliyunOSS, uploadToAliyunOSS2, uploadTokenApi} from "@/api/upload";

defineOptions({
  name: "custom-editor"
});

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '200px'
  },
  uploadUrl: {
    type: String,
    default: 'config'
  },
});

const emit = defineEmits(["onChange"]);
const style = ref({
  height: props.height,
})

const mode = "default";
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref("");
const toolbarConfig: any = { excludeKeys: [
    "fullScreen",
    //'uploadImage',
    'uploadVideo',
  ]
};
/*toolbarConfig.toolbarKeys = [
  // 菜单 key
  'headerSelect',

  // 分割线
  '|',

  // 菜单 key
  'bold', 'italic',

  // 菜单组，包含多个菜单
  {
    key: 'group-more-style', // 必填，要以 group 开头
    title: '更多样式', // 必填
    iconSvg: '<svg>....</svg>', // 可选
    menuKeys: ["through", "code", "clearStyle"] // 下级菜单 key ，必填
  },
  // 继续配置其他菜单...
]*/

const editorConfig = { placeholder: "请输入内容...", MENU_CONF: {
    /*// 禁用图片按钮
    img: false,
    // 禁用视频按钮（如果存在）
    video: false,*/
  }
};

// 更多详细配置看 https://www.wangeditor.com/v5/menu-config.html#%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87
editorConfig.MENU_CONF["uploadImage"] = {
  async customUpload(file: any, insertFn: any) {
    uploadToken(file, insertFn)
  }
};

const handleCreated = editor => {
  // 记录 editor 实例，重要！
  editorRef.value = editor;
};

async function uploadToken(rawFile: any, insertFn: any) {
  //const res = await uploadTokenApi({})
  //const {data} = res || {}
  //if (data) {
    const aliRes = await uploadToAliyunOSS2(rawFile, props.uploadUrl)
    const {showUrl} = aliRes || {}
    insertFn(showUrl);
  //}
  return
}

function handleEditorChange() {
  emit('onChange', valueHtml.value)
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

watch(
  () => props.value,
  val => {
    valueHtml.value = `${val}`
  },
  {
    deep: true,
    immediate: true
  }
);
</script>

<template>
  <div class="wangeditor">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onChange="handleEditorChange"
      :style="style"
      @onCreated="handleCreated"
    />
  </div>
</template>
