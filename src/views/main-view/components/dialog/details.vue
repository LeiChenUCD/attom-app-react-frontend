<script setup lang="ts">
import { ref } from "vue";
import type { TabsPaneContext } from 'element-plus'
import { CommentFormProps } from "./utils/types";
import { getCensusListApi, queryContactInfo } from "@/api/welcome";

const props = withDefaults(defineProps<CommentFormProps>(), {
  formInline: () => ({
    detail: null,
    currentComment: null,
    comment: ''
  })
});
const isLoading = ref(false)
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const detail: any = ref(newFormInline.value?.detail || {})
const activeTab = ref('amortizedequity')
const detailData = ref({
  amortizedequity: null,
  recorder: null,
  taxassessor: null,
  contactinfo: null
})
const activeName = ref('1')
const tabList = ref([{
  name: 'amortizedequity',
  label: 'Amortizedequity'
}, {
  name: 'recorder',
  label: 'Recorder'
}, {
  name: 'taxassessor',
  label: 'Taxassessor'
}, {
  name: 'contactinfo',
  label: 'Contactinfo'
}])

function getRef() {
  return ruleFormRef.value;
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  activeName.value = '1';
  if (tab.paneName === 'contactinfo') {
    //getContactInfoApi()
    detailData.value[activeTab.value] = detail.value.contactInfo? detail.value?.contactInfo : [];
  } else {
    getDetailApi()
  }
}

async function getContactInfoApi() {
  isLoading.value = true;
  const data = await queryContactInfo({})
  isLoading.value = false;
}

async function getDetailApi() {
  if (detailData.value[activeTab.value]) {
    isLoading.value = false;
    return
  }
  const param = {
    "ATTOMID": detail.value['[attom id]'] ?? "",
    db: activeTab.value,
  };
  const apiParams = {
    query: `\
    SELECT \
        * \
    FROM \
        ${param.db} \
    where \
        "[attom id]" = ${param.ATTOMID} \
      `
  }
  isLoading.value = true;
  const data = await getCensusListApi(apiParams)
  isLoading.value = false;
  detailData.value[activeTab.value] = data;
}

getDetailApi();

defineExpose({ getRef });
</script>

<template>
  <div class="view-detail-box">
    <div class="address"></div>
    <div class="content" >
      <el-tabs
        v-model="activeTab" 
        class="demo-tabs" 
        @tab-click="handleClick">
        <el-tab-pane v-for="(tab, index) in tabList" 
          :key="index" :disabled="isLoading" :label="tab.label" :name="tab.name">
          <div class="loading-box" v-if="isLoading" v-loading="isLoading"></div>
          <el-collapse v-else-if="detailData[tab.name]?.length>0" v-model="activeName" accordion>
            <el-collapse-item 
              v-for="(row, index) in detailData[tab.name]" 
              :key="index" 
              :title="'Record'+(index+1).toString()" 
              :name="(index+1).toString()">
              <div style="overflow: auto;">
                <el-descriptions
                  title=""
                  v-if="activeTab==tab.name && activeName==(index+1).toString()"
                  direction="vertical"
                  :column="4"
                  size="default"
                  border
                >
                <el-descriptions-item 
                    v-for="(value, key) in row" 
                    :key="key" 
                    :label="key.toString()">{{value}}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-empty v-else description="No data" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .view-detail-box {
    .address {

    }
    .content {
      margin-bottom: 20px;
    }
    .loading-box {
      padding: 20px;
    }
  }
</style>