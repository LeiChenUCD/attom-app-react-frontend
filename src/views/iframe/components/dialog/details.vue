<script setup lang="ts">
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";
import { CommentFormProps } from "./utils/types";
import {
  getCensusListApi,
  getHouseDetailApi,
  queryContactInfo,
  getImagesListApi
} from "@/api/welcome";
import { objectParamsToQueryString } from "@/utils/common";
import DetailsBanner from "./details-banner.vue";

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
const activeTab = ref("mls");
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
const bodyHeight = ref(400);
const activeName = ref("1");
const tabList = ref([
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
const imageList = ref([]);

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
  if (res?.mls?.length > 0) {
    getDataImages(res.mls[0].listingkeynumeric);
  } else {
    imageList.value = [];
  }
}

const calculateMapHeight = () => {
  const windowHeight = window.innerHeight;
  let height = windowHeight - 80;
  bodyHeight.value = height;
};

async function getDataImages(listingkeynumeric: any) {
  const params = {
    attomId: listingkeynumeric || "" //"16945068"
  };
  imageList.value = [];
  const res = await getImagesListApi(params);
  if (res?.pictures?.length > 0) {
    imageList.value = res.pictures.filter(item => !item.includes("/1/"));
  } else {
  }
}

function init() {
  getHouseDetail();
  //getDetailApi(true);
  calculateMapHeight();
}

init();

defineExpose({ getRef });
</script>

<template>
  <div class="view-detail-box" :style="{ height: bodyHeight + 'px' }">
    <DetailsBanner :detailData="detail" :images="imageList" />
    <!--div class="content">
      <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="(tab, index) in tabList"
          :key="index"
          :disabled="isLoading"
          :label="tab.label"
          :name="tab.name"
        >
          <div v-if="isLoading" v-loading="isLoading" class="loading-box" />
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
        </el-tab-pane>
      </el-tabs>
    </div-->
  </div>
</template>
<style lang="scss" scoped>
.view-detail-box {
  overflow: auto;
  .content {
    margin-bottom: 20px;
  }
  .loading-box {
    padding: 20px;
  }
}
</style>
