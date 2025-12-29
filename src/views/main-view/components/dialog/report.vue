<script setup lang="ts">
import { ref } from "vue";
import { getDueDiligenceReportApi } from "@/api/welcome";
import DynamicMap from "./dynamic-map.vue";

defineOptions({
  name: "DueDiligenceReport"
});
const props = defineProps({
  detail: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const isLoading = ref(false);
const reportData = ref({});
const summaryData = ref({});
const parcelAssessorMapUrl = ref("");

async function getDueDiligenceReport() {
  const address = props.detail.address || "";
  const city = props.detail.city || "";
  const state = props.detail.state || "";
  const zip = props.detail.zip || "";
  const allAddress = `${address}, ${city}, ${state} ${zip}, USA`;
  const params = {
    address: allAddress
  };
  isLoading.value = true;
  const res = await getDueDiligenceReportApi(params);
  reportData.value = res;
  parcelAssessorMapUrl.value = `https://docs.google.com/gview?url=https://www.sccassessor.org/apps/ShowMapBook.aspx?apn=${res.apn}&embedded=true`;
  summaryData.value = {
    apn: res.apn,
    jurisdiction: res.jurisdiction,
    lot_size_records: res.lot_size_records,
    zoning: res.zoning,
    general_plan: res.general_plan,
    height_limit: res.height_limit,
    density: res.density,
    lot_size_dev_standards: res.lot_size_dev_standards
  };
  isLoading.value = false;
}

function init() {
  getDueDiligenceReport();
}

init();
</script>

<template>
  <div class="due-diligence-report" v-if="!isLoading">
    <el-descriptions
      title=""
      direction="vertical"
      :column="4"
      size="default"
      border
    >
      <el-descriptions-item
        v-for="(value, key) in summaryData"
        :key="key"
        :label="key.toString()"
        >{{ value }}
      </el-descriptions-item>
    </el-descriptions>
    <div class="title">Parcel Assessor's Map</div>
    <iframe
      v-if="reportData?.apn"
      :src="parcelAssessorMapUrl"
      width="100%"
      height="500px"
      title="Parcel Assessor's Map"
    />
    <div v-else className="p-4 text-gray-500">
      Parcel Assessor's Map not available.
    </div>
    <!--div class="title">Parcel Map</div>
    <div v-if="reportData.parcel || reportData.footprints">
      <DynamicMap
        :center="[reportData.latitude, reportData.longitude]"
        :unidata="reportData"
      />
    </div>
    <div v-else className="p-4 text-gray-500">No map data available.</div-->
  </div>
  <div v-else>
    <div v-loading="isLoading"></div>
  </div>
</template>
<style lang="scss" scoped>
.due-diligence-report {
  .title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 20px 0;
  }
}
</style>
