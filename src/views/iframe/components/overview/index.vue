<script setup lang="ts">
import { getImagesListApi, getHouseDetailApi } from "@/api/welcome";
import { objectParamsToQueryString } from "@/utils/common";
import { ref, onMounted, watch } from "vue";
const { VITE_GOOGLE_MAP_API_KEY } = import.meta.env;
import { Loader } from "@googlemaps/js-api-loader";

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
    if (props.detailData?.MediaURLs.length > 0) {
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
              <img style="width: 100%; height: 100%" :src="item" />
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
      </div>
      <div class="item right">
        <dl>
          <!--dt class="title">Properties</dt-->
          <dd class="text">
            {{ detailData?.address }}
          </dd>
          <dd class="text">
            Size:
            {{
              detailData?.lotsize
                ? Number(detailData?.lotsize).toFixed(0)
                : "--"
            }}
          </dd>
          <dd class="text">
            BathCount:
            {{
              detailData?.bathcount
                ? Number(detailData?.bathcount).toFixed(0)
                : "--"
            }}
          </dd>
          <dd class="text">
            BedroomCount:
            {{
              detailData?.bedrooms
                ? Number(detailData?.bedrooms).toFixed(0)
                : "--"
            }}
          </dd>
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
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
  overflow: hidden;
  .content {
    width: 100%;
    .item {
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
    padding-top: 5px;
    text-align: right;
  }
}
</style>
