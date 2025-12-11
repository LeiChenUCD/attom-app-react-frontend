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
  //const res = await getDueDiligenceReportApi(params);
  const res = {
    apn: "28246049",
    address: "663 Chatsworth Pl, San Jose, CA 95128, USA",
    jurisdiction: "San Jose",
    latitude: 37.3153529,
    longitude: -121.9187318,
    parcel:
      "POLYGON ((-121.918466 37.315295, -121.918467 37.315406, -121.91892 37.315401, -121.918917 37.315293, -121.918916 37.315234, -121.918464 37.315238, -121.918466 37.315295))",
    footprints: [
      "POLYGON ((-121.918752 37.315239, -121.918542 37.31524, -121.91854196211366 37.31523731006979, -121.91875195825526 37.31523545169686, -121.918752 37.315239))",
      "POLYGON ((-121.918728 37.315321, -121.918877 37.315321, -121.91887794663724 37.315401464165156, -121.918547 37.315405116997795, -121.918547 37.315344, -121.918608 37.315344, -121.918608 37.315264, -121.918727 37.315263, -121.918728 37.315321))",
      "POLYGON ((-121.918882 37.315384, -121.918896 37.315384, -121.918896 37.315333, -121.91891811111111 37.315333, -121.91892 37.315401, -121.918882 37.31540141942605, -121.918882 37.315384))"
    ],
    lot_size_records: null,
    lot_size_dev_standards:
      "R-1-8 common minimum lot 5,445 ft² (legacy standard, coexists with 8 du/ac density)",
    zoning: null,
    general_plan: null,
    height_limit: "R-1-8: 35 ft / 2.5 stories",
    density: "R-1 = 1-8 du/ac (Residential Zoning Districts summary/ordinance)",
    last_updated: "2025-12-09T15:19:03.259332",
    sources: [
      {
        name: "Google Maps Geocoding API",
        url: "https://maps.googleapis.com/maps/api/geocode/json",
        fetched_at: "2025-12-09T15:19:02.648123"
      },
      {
        name: "Partner Unidata API",
        url: "https://adu-546742411362.us-west1.run.app/api/v2/unidata/search",
        fetched_at: "2025-12-09T15:19:03.259054"
      },
      {
        name: "San Jose Development Standards (MuniCode/eCode360/GP)",
        url: "https://www.sanjoseca.gov/your-government/departments-offices/planning-building-code-enforcement/planning-division/citywide-planning/rezoning-general-plan-alignment-project",
        fetched_at: "2025-12-09T15:19:03.259224"
      }
    ]
  };
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
  <div class="due-diligence-report">
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
    <div class="title">Parcel Map</div>
    <div v-if="reportData.parcel || reportData.footprints">
      <DynamicMap
        :center="[reportData.latitude, reportData.longitude]"
        :unidata="reportData"
      />
    </div>
    <div v-else className="p-4 text-gray-500">No map data available.</div>
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
