<script setup lang="ts">
import { getImagesListApi, getHouseDetailApi } from "@/api/welcome";
import { objectParamsToQueryString } from "@/utils/common";
import { ref, onMounted, watch } from "vue";
const { VITE_GOOGLE_MAP_API_KEY } = import.meta.env;
import { Loader } from "@googlemaps/js-api-loader";
import { mlsstatusMap } from "../filter/options";

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
const bannerHeight = ref("150px");
const loadingMap = ref(true);

function onShowViewDetail() {
  emit("onViewDetail", props.detailData);
}

function onShowAddComment() {
  emit("onComment", props.detailData);
}

async function loadGoogleMaps() {
  if (
    !(
      typeof props.detailData.lat === "number" &&
      typeof props.detailData.lon === "number"
    )
  ) {
    return;
  }
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    version: "weekly"
  });

  const google = await loader.load();

  const fenway = {
    lat: props.detailData.lat,
    lng: props.detailData.lon
  };
  loadingMap.value = false; // 地图初始化完成，切换显示

  setTimeout(() => {
    new google.maps.StreetViewPanorama(mapContainer.value, {
      position: fenway,
      pov: { heading: 165, pitch: 0 },
      zoom: 1
    });
  }, 200);
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
  const note = props.detailData?.comments || "";
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
    if (props.detailData?.MediaURLs?.length > 0) {
      imageList.value = props.detailData?.MediaURLs;
    } else {
      imageList.value = [];
      loadGoogleMaps();
    }
    //getHouseDetail();
    //comments.value = buildComments();
  },
  {
    deep: true,
    immediate: true
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
              <el-image
                style="width: 100%; height: 100%"
                :src="item"
                fit="cover"
                lazy
              />
            </el-carousel-item>
          </el-carousel>
        </div>
        <el-skeleton v-else-if="loadingMap" style="width: 100%">
          <template #template>
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 150px"
            />
          </template>
        </el-skeleton>
        <div v-else ref="mapContainer" style="width: 100%; height: 100%" />
        <div v-if="detailData?.mlsstatus" class="mlsstatus">
          <span v-if="detailData?.mlsstatus == 'PendingDoNotShow'"
            >Pending
          </span>
          <span v-else>{{ detailData?.mlsstatus }}</span>
        </div>
      </div>
      <div class="item right">
        <dl>
          <!--dt class="title">Properties</dt-->
          <dd class="text" style="font-weight: bold; font-size: 18px">
            <span
              v-if="
                detailData?.mlsstatus == 'Active' ||
                detailData?.mlsstatus == 'PendingDoNotShow'
              "
              >${{ detailData?.listprice }}</span
            >
            <span v-else>${{ detailData?.closeprice }}</span>
          </dd>
          <dd
            class="text"
            style="display: flex; align-items: center; margin-bottom: 20px"
          >
            <svg
              t="1755760665346"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5055"
              width="20"
              height="20"
            >
              <path
                d="M512 64C317.92 64 160 221.92 160 416c0 187.36 315.424 520.032 328.832 534.08C494.88 956.448 503.264 960 512 960c0.224 0 0.48 0 0.704 0 8.992 0 17.472-4.192 23.392-10.944l109.216-125.12C790.432 646.176 864 508.928 864 416 864 221.92 706.08 64 512 64zM512 576c-88.384 0-160-71.616-160-160s71.616-160 160-160 160 71.616 160 160S600.384 576 512 576z"
                p-id="5056"
              />
            </svg>
            {{ detailData?.address }}
          </dd>
          <dd class="text" style="display: flex; align-items: center">
            <div style="flex: 1; display: flex; align-items: center">
              <svg
                style="margin-right: 10px"
                t="1755761273208"
                class="icon"
                viewBox="0 0 1280 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="6052"
                width="20"
                height="20"
              >
                <path
                  d="M352 512c88.22 0 160-71.78 160-160s-71.78-160-160-160-160 71.78-160 160 71.78 160 160 160z m704-256H608c-17.68 0-32 14.32-32 32v288H128V160c0-17.68-14.32-32-32-32H32C14.32 128 0 142.32 0 160v704c0 17.68 14.32 32 32 32h64c17.68 0 32-14.32 32-32v-96h1024v96c0 17.68 14.32 32 32 32h64c17.68 0 32-14.32 32-32V480c0-123.72-100.28-224-224-224z"
                  p-id="6053"
                />
              </svg>
              {{
                detailData?.bedrooms
                  ? Number(detailData?.bedrooms).toFixed(0)
                  : "--"
              }}
              Beds
            </div>
            <div style="flex: 1; display: flex; align-items: center">
              <svg
                style="margin-right: 10px"
                t="1755761642535"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="7503"
                width="20"
                height="20"
              >
                <path
                  d="M950.857143 621.714286v109.714285q0 96.571429-73.142857 163.428572v110.857143q0 8-5.142857 13.142857t-13.142858 5.142857h-36.571428q-8 0-13.142857-5.142857t-5.142857-13.142857v-67.428572q-36 12.571429-73.142858 12.571429H292.571429q-37.142857 0-73.142858-12.571429v62.857143q0 9.714286-5.428571 16.285714T201.142857 1024h-36.571428q-7.428571 0-12.857143-6.571429T146.285714 1001.142857v-106.285714q-73.142857-66.857143-73.142857-163.428572v-109.714285h877.714286zM402.285714 384q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m36.571429-36.571429q0 8-5.142857 13.142858t-13.142857 5.142857-13.142858-5.142857-5.142857-13.142858 5.142857-13.142857 13.142858-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571429-36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m73.142857 0q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571428-36.571429q0 8-5.142857 13.142857t-13.142857 5.142858-13.142858-5.142858-5.142857-13.142857 5.142857-13.142857 13.142858-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571429-36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142858 13.142857 5.142858 5.142857 13.142857z m621.714286 292.571428v36.571429q0 8-5.142857 13.142857t-13.142857 5.142857H18.285714q-8 0-13.142857-5.142857t-5.142857-13.142857v-36.571429q0-8 5.142857-13.142857t13.142857-5.142857h54.857143V146.285714q0-60.571429 42.857143-103.428571T219.428571 0q61.714286 0 105.142858 44.571429 26.285714-10.857143 56-6.857143t53.142857 22.285714l12.571428-12.571429q6.285714-6.285714 12.571429 0l24 24q6.285714 6.285714 0 12.571429L303.428571 263.428571q-6.285714 6.285714-12.571428 0l-24-24q-6.285714-6.285714 0-12.571428l12.571428-12.571429q-20.571429-26.285714-23.142857-59.428571T269.714286 93.142857q-21.142857-20-50.285715-20-30.285714 0-51.714285 21.428572T146.285714 146.285714v365.714286h859.428572q8 0 13.142857 5.142857t5.142857 13.142857zM512 274.285714q0 8-5.142857 13.142857t-13.142857 5.142858-13.142857-5.142858-5.142858-13.142857 5.142858-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571429-36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142858 13.142857 5.142858 5.142857 13.142857z m-36.571428-36.571429q0 8-5.142857 13.142857t-13.142857 5.142857-13.142858-5.142857-5.142857-13.142857 5.142857-13.142857 13.142858-5.142857 13.142857 5.142857 5.142857 13.142857z m109.714286 36.571429q0 8-5.142858 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142858 13.142857 5.142858 5.142858 13.142857z m-36.571429-36.571429q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142858-13.142857 5.142858-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571429-36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142858 13.142857-5.142857 13.142857 5.142857 5.142857 13.142858z m109.714286 36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571428-36.571428q0 8-5.142858 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142858 13.142857-5.142857 13.142857 5.142857 5.142858 13.142858z m73.142857 0q0 8-5.142857 13.142857t-13.142858 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142858 13.142857-5.142857 13.142858 5.142857 5.142857 13.142858z"
                  p-id="7504"
                />
              </svg>
              {{
                detailData?.bathcount
                  ? Number(detailData?.bathcount).toFixed(0)
                  : "--"
              }}
              Baths
            </div>
          </dd>
        </dl>
      </div>
    </div>
    <div class="operator">
      <el-button
        style="width: 100%; background: #9a89bb; color: #fff"
        @click="onShowViewDetail()"
      >
        <svg
          style="display: inline-block; margin-right: 10px"
          t="1755762865702"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="8483"
          width="20"
          height="20"
        >
          <path
            d="M512 283.456c-165.248 0-299.392 74.304-408.128 228.864C211.072 666.432 345.152 740.544 512 740.544c166.848 0 300.928-74.112 408.128-228.224C811.392 357.76 677.248 283.52 512 283.52zM512 832C298.112 832 127.488 725.312 0 512c129.408-213.312 300.032-320 512-320 211.968 0 382.592 106.688 512 320-127.488 213.312-298.112 320-512 320z m0-137.152a182.848 182.848 0 1 0 0-365.696 182.848 182.848 0 0 0 0 365.696zM512 576a64 64 0 1 1 0-128 64 64 0 0 1 0 128z"
            fill="#ffffff"
            p-id="8484"
          />
        </svg>
        View Detail
      </el-button>
      <!--el-button type="primary" @click="onShowAddComment"
        >Add Comment</el-button
    --></div>
  </div>
</template>

<style scoped lang="scss">
.overview-container {
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
  overflow: hidden;
  .content {
    width: 100%;
    .item {
      position: relative;
      .mlsstatus {
        position: absolute;
        left: 10px;
        top: 10px;
        padding: 2px 10px;
        border-radius: 5px;
        background: #fff;
        color: #333;
        z-index: 1;
        border: 1px solid #ddd;
      }
      .title {
        font-weight: bold;
      }
      &.right {
        padding: 10px;
        dl {
          dd {
            font-size: 14px;
          }
        }
      }
      &.left {
        height: 150px;
        width: 100%;
      }
    }
  }
  > .operator {
    padding: 10px;
    text-align: center;
  }
}
</style>
