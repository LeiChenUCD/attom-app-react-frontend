<script setup lang="ts">
import { getImagesListApi, getHouseDetailApi } from "@/api/welcome";
import { objectParamsToQueryString } from "@/utils/common";
import { ref, onMounted, watch } from "vue";
const { VITE_GOOGLE_MAP_API_KEY } = import.meta.env;

defineOptions({
  name: "Overview"
});
const props = defineProps({
  detailData: {
    type: Object,
    default: () => {
      return {};
    }
  }
});
const emit = defineEmits(["onComment", "onViewDetail"]);
const mapContainer = ref();
const comments = ref([]);
const imageList = ref([]);
const bannerHeight = ref("255px");
function onShowViewDetail() {
  emit("onViewDetail", props.detailData);
}

function onShowAddComment() {
  emit("onComment", props.detailData);
}

async function loadGoogleMaps() {
  if (!window.google) {
    await loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${VITE_GOOGLE_MAP_API_KEY}`
    );
  }
  initMap();
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function initMap() {
  if (mapContainer.value) {
    const fenway = {
      lat: props.detailData.lat,
      lng: props.detailData.lon
    };
    const panorama = new google.maps.StreetViewPanorama(mapContainer.value, {
      position: fenway,
      pov: { heading: 165, pitch: 0 },
      zoom: 1
    });
  }
}

function buildComments() {
  const note = props.detailData?.note || "";
  let res = [];
  if (note) {
    res = note.split("\n").map(line => line.trim());
  }
  return res;
}

async function getDataImages(listingkeynumeric: any) {
  const params = {
    attomId: listingkeynumeric || "" //"16945068"
  };
  imageList.value = [];
  const res = await getImagesListApi(params);
  if (res?.pictures?.length > 0) {
    imageList.value = res.pictures || [];
  } else {
    loadGoogleMaps();
  }
}

async function getHouseDetail() {
  const params = {
    fid: props.detailData["fid"] ?? ""
  };
  if (params.fid) {
    const queryString = objectParamsToQueryString(params);
    const res = await getHouseDetailApi(queryString, params);
    if (res?.mls?.length > 0) {
      getDataImages(res.mls[0].listingkeynumeric);
    } else {
      loadGoogleMaps();
    }
  }
}

watch(
  () => props.detailData,
  () => {
    imageList.value = [];
    getHouseDetail();
    comments.value = buildComments();
  },
  {
    deep: true
  }
);
</script>

<template>
  <div class="overview-container">
    <!--div class="address">{{detailData?.address}}</div-->
    <div class="content">
      <div class="item left">
        <div v-if="imageList?.length > 0">
          <el-carousel indicator-position="none" :height="bannerHeight">
            <el-carousel-item v-for="(item, index) in imageList" :key="index">
              <img style="width: 100%; height: 100%" :src="item" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div v-else ref="mapContainer" style="width: 100%; height: 100%" />
      </div>
      <div class="item right">
        <dl>
          <dt class="title">Properties</dt>
          <dd class="text">Size: {{ detailData?.lotsize }}</dd>
          <dd class="text">BathCount: {{ detailData?.bathcount }}</dd>
          <dd class="text">BedroomCount: {{ detailData?.bedrooms }}</dd>
        </dl>
        <dl style="margin-top: 20px">
          <dt class="title">Comments</dt>
          <dd class="text">
            <div v-for="(item, index) in comments" :key="index">{{ item }}</div>
            <!--{{detailData?.note}}-->
          </dd>
        </dl>
      </div>
    </div>
    <div class="operator">
      <el-button @click="onShowViewDetail()">View Detail</el-button>
      <el-button type="primary" @click="onShowAddComment"
        >Add Comment</el-button
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.overview-container {
  .content {
    display: flex;
    width: 100%;
    height: 255px;
    overflow: auto;
    .item {
      width: 50%;
      .title {
        font-weight: bold;
      }
      &.right {
        padding-left: 10px;
      }
    }
  }
  > .operator {
    padding-top: 5px;
    text-align: right;
  }
}
</style>
