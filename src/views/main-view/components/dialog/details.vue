<script setup lang="ts">
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";
import { CommentFormProps } from "./utils/types";
import {
  getCensusListApi,
  getHouseDetailApi,
  queryContactInfo
} from "@/api/welcome";
import { objectParamsToQueryString } from "@/utils/common";
import DueDiligenceReport from "./report.vue";
import Parcelz from "./parcelz.vue";

const props = withDefaults(defineProps<CommentFormProps>(), {
  formInline: () => ({
    detail: null,
    currentComment: null,
    comment: ""
  })
});
const isLoading = ref(false);
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const detail: any = ref(newFormInline.value?.detail || {});
const activeTab = ref("DueDiligenceReport");
const detailData = ref({
  amortizedequity: null,
  amortizedEquity: null,
  recorder: null,
  taxassessor: null,
  taxAssessor: null,
  contactinfo: null
});
const houseDetail = ref({
  amortizedEquity: [],
  mls: [],
  recorder: [],
  taxAssessor: []
});
const activeName = ref("1");
const tabList = ref([
  {
    name: "DueDiligenceReport",
    label: "Due Diligence Report"
  },
  {
    name: "Parcelz",
    label: "Parcel.z"
  },
  {
    name: "mls",
    label: "MLS"
  },
  {
    name: "amortizedEquity",
    label: "Amortizedequity"
  },
  {
    name: "recorder",
    label: "Recorder"
  },
  {
    name: "taxAssessor",
    label: "Taxassessor"
  },
  /*{
    name: "contactinfo",
    label: "Contactinfo"
  },*/
  {
    name: "alphax",
    label: "Alphax"
  }
]);

function getRef() {
  return ruleFormRef.value;
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  activeName.value = "1";
  if (tab.paneName === "contactinfo") {
    //getContactInfoApi()
    detailData.value[activeTab.value] = detail.value.contactInfo
      ? detail.value?.contactInfo
      : [];
  } else {
    detailData.value[activeTab.value] =
      houseDetail.value[activeTab.value] || [];
    //getDetailApi(false);
  }
};

async function getContactInfoApi() {
  isLoading.value = true;
  const data = await queryContactInfo({});
  isLoading.value = false;
}

async function getDetailApi(init: boolean) {
  if (detailData.value[activeTab.value]) {
    isLoading.value = false;
    return;
  }
  const param = {
    ATTOMID: detail.value["fid"] ?? "",
    db: activeTab.value
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
  };
  isLoading.value = true;
  const data = await getCensusListApi(apiParams);
  isLoading.value = false;
  detailData.value[activeTab.value] = data;
  if (init) {
    //getHouseDetail();
  }
}

async function getHouseDetail() {
  const params = {
    fid: detail.value["fid"] ?? ""
  };
  const queryString = objectParamsToQueryString(params);
  isLoading.value = true;
  const res = await getHouseDetailApi(queryString, params);
  houseDetail.value = res;
  detailData.value[activeTab.value] = res.mls || [];
  isLoading.value = false;
}

function init() {
  getHouseDetail();
  //getDetailApi(true);
}

init();

defineExpose({ getRef });
</script>

<template>
  <div class="view-detail-box">
    <div class="address">
      {{ detail.address }}, {{ detail.city || "" }}, {{ detail.state || "" }}
      {{ detail.zip || "" }}, USA
    </div>
    <div class="content">
      <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="(tab, index) in tabList"
          :key="index"
          :disabled="isLoading"
          :label="tab.label"
          :name="tab.name"
        >
          <div class="tab-content">
            <div v-if="isLoading" v-loading="isLoading" class="loading-box" />
            <DueDiligenceReport
              v-else-if="
                tab.name == 'DueDiligenceReport' && activeTab == tab.name
              "
              :detail="detail"
            />
            <Parcelz v-else-if="tab.name == 'Parcelz' && activeTab == tab.name"
              :detail="detail"/>
            <el-collapse
              v-else-if="detailData[tab.name]?.length > 0"
              v-model="activeName"
              accordion
            >
              <el-collapse-item
                v-for="(row, index) in detailData[tab.name]"
                :key="index"
                :title="'Record' + (index + 1).toString()"
                :name="(index + 1).toString()"
              >
                <div style="overflow: auto">
                  <el-descriptions
                    v-if="
                      activeTab == tab.name &&
                      activeName == (index + 1).toString()
                    "
                    title=""
                    direction="vertical"
                    :column="4"
                    size="default"
                    border
                  >
                    <el-descriptions-item
                      v-for="(value, key) in row"
                      :key="key"
                      :label="key.toString()"
                      >{{ value }}
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-collapse-item>
            </el-collapse>
            <el-empty v-else description="No data" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.view-detail-box {
  .tab-content {
    height: calc(100vh - 280px);
    overflow: auto;
  }
  .address {
    font-weight: bold;
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
  }
  .content {
    margin-bottom: 20px;
  }
  .loading-box {
    padding: 20px;
  }
}
</style>
