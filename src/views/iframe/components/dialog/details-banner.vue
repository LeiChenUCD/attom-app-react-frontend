<script setup lang="ts">
import DetailsMap from "./map.vue";
import { ref, onMounted, watch } from "vue";
const { VITE_GOOGLE_MAP_API_KEY } = import.meta.env;
import { Loader } from "@googlemaps/js-api-loader";
import { FormatPrice } from "@/utils/common";

defineOptions({
  name: "Overview"
});
const props = defineProps({
  detailData: {
    type: Object,
    default: () => {
      return {};
    }
  },
  images: {
    type: Array,
    default: () => {
      return [];
    }
  }
});
const emit = defineEmits(["onComment", "onViewDetail"]);
const mapContainer = ref();
const comments = ref([]);
const imageList = ref([]);
const bannerHeight = ref("350px");
const loadingMap = ref(true);
const chartData = ref([
  {
    key: "yearbuilt",
    name: "Built in",
    value: 36000
  },
  {
    key: "bedrooms",
    name: "Bedrooms",
    value: 36000
  },
  {
    key: "bathcount",
    name: "Bathrooms",
    value: 36000
  },
  {
    key: "livingarea",
    name: "Living Area",
    value: 36000,
    unit: "sq.ft"
  },
  {
    key: "lotsize",
    name: "Lot Size",
    value: 36000,
    unit: "sq.ft"
  }
]);

const interiorFeatures = ref([
  {
    name: "Hardwood floors throughout"
  },
  {
    name: "Gourmet kitchen with island"
  },
  {
    name: "Stainless steel appliances"
  },
  {
    name: "Quartz countertops"
  },
  {
    name: "Walk-in closets"
  },
  {
    name: "Fireplace in living room"
  },
  {
    name: "Home office/den"
  },
  {
    name: "Smart home features"
  }
]);

const exteriorFeatures = ref([
  {
    name: "Landscaped garden"
  },
  {
    name: "Outdoor patio"
  },
  {
    name: "lrrigation system"
  },
  {
    name: "Two-car garage"
  },
  {
    name: "EV charging station"
  },
  {
    name: "Solar panels"
  },
  {
    name: "Security system"
  }
]);

function onShowViewDetail() {
  emit("onViewDetail", props.detailData);
}

function onShowAddComment() {
  emit("onComment", props.detailData);
}

function goToSchedulePage() {
  window.open("https://calendly.com/axisrealty-30min-meeting/30min");
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

function splitImages(images: any, size = 5) {
  const result = [];
  if (images?.length > 0) {
    for (let i = 0; i < images.length; i += size) {
      result.push({
        list: images.slice(i, i + size)
      });
    }
  }
  return result;
}

function goToViewTour() {
  if (props.detailData?.address === "2974 BELL AVE") {
    window.open(`https://my.matterport.com/show/?m=fASRYDxSPyn`);
  }
}
watch(
  () => props.detailData,
  () => {
    if (props.detailData?.MediaURLs?.length > 0) {
      imageList.value = splitImages(props.detailData?.MediaURLs);
    } else {
      imageList.value = [];
      loadGoogleMaps();
    }
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => props.images,
  () => {
    if (props.images?.length > 0) {
      imageList.value = splitImages(props.images);
    } else {
    }
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
          <el-carousel
            indicator-position="none"
            :autoplay="true"
            trigger="click"
            :height="bannerHeight"
          >
            <el-carousel-item
              v-for="(group, groupIndex) in imageList"
              :key="groupIndex"
            >
              <div class="img-layout">
                <div
                  v-for="(img, imgIndex) in group.list"
                  :key="imgIndex"
                  :class="imgIndex === 0 ? 'big' : 'small'"
                >
                  <el-image
                    style="width: 100%; height: 100%"
                    :src="img"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="group.list"
                    show-progress
                    :initial-index="Number(imgIndex)"
                    fit="cover"
                  />
                  <div
                    v-if="
                      imgIndex === 0 && detailData?.address === '2974 BELL AVE'
                    "
                    class="btns-operator"
                  >
                    <el-button class="btn-3d-tour" @click="goToViewTour()"
                      >3D Tour</el-button
                    >
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <el-skeleton v-else-if="loadingMap" style="width: 100%">
          <template #template>
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 350px"
            />
          </template>
        </el-skeleton>
        <div v-else ref="mapContainer" style="width: 100%; height: 100%" />
      </div>
      <div class="item right">
        <div class="flex-container price-box">
          <div class="left price">
            <span
              v-if="
                detailData?.mlsstatus == 'Active' ||
                detailData?.mlsstatus == 'PendingDoNotShow'
              "
              >{{ FormatPrice(detailData?.listprice) }}</span
            >
            <span v-else>{{ FormatPrice(detailData?.closeprice) }}</span>
          </div>
          <div class="right btn-box">
            <el-button class="btn-schedule" @click="goToSchedulePage"
              >Schedule A Tour</el-button
            >
            <el-popover placement="bottom" :width="260" trigger="click">
              <template #reference>
                <el-button class="btn-call-us">Call Us Directly</el-button>
              </template>
              <div>(833) 888-AXIS｜ (833) 888-2947</div>
            </el-popover>
          </div>
        </div>
        <div class="address">{{ detailData?.fullAddress }}</div>
        <dl>
          <dt>Property Highlights</dt>
          <dd>
            <div v-if="detailData" class="flex-container-5">
              <div v-for="(item, index) in chartData" :key="index" class="item">
                <div class="value">
                  <span>{{
                    detailData[item.key]
                      ? Number(detailData[item.key]).toFixed(0)
                      : "--"
                  }}</span>
                  <span v-if="item.unit" style="margin-left: 5px">{{
                    item.unit
                  }}</span>
                </div>
                <div class="name">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </dd>
        </dl>

        <dl>
          <dt>Property Overview</dt>
          <dd>
            <div style="margin-top: 10px">{{ detailData?.publicremarks }}</div>
          </dd>
        </dl>

        <dl>
          <dt>Property Details</dt>
          <dd>
            <div class="flex-container-2">
              <div class="item">
                <div class="title">Interior Features</div>
                <ul>
                  <li v-for="(item, index) in interiorFeatures" :key="index">
                    {{ item.name }}
                  </li>
                </ul>
              </div>
              <div class="item">
                <div class="title">Exterior Features</div>
                <ul>
                  <li v-for="(item, index) in exteriorFeatures" :key="index">
                    {{ item.name }}
                  </li>
                </ul>
              </div>
            </div>
          </dd>
        </dl>

        <dl>
          <dt>Location & Neighborhood</dt>
          <dd>
            <DetailsMap :detailData="detailData" />
          </dd>
        </dl>

        <dl>
          <dt>Schools</dt>
          <dd>{{ detailData?.elementaryschool }}</dd>
          <dd>{{ detailData?.middleorjuniorschool }}</dd>
          <dd>{{ detailData?.highschool }}</dd>
        </dl>

        <dl style="text-align: center">
          <dt>Ready to Find Your Dream Home?</dt>
          <dd style="padding: 20px 10%">
            Don't miss out on properties like this! Our expert agents are ready
            to help you navigate the market and find the perfect match for your
            lifestyle.
          </dd>
          <dd class="btn-box">
            <el-button class="btn-schedule" @click="goToSchedulePage"
              >Schedule A Consultation</el-button
            >
            <el-popover placement="top" :width="260" trigger="click">
              <template #reference>
                <el-button class="btn-schedule">Call Us Today</el-button>
              </template>
              <div>(833) 888-AXIS｜ (833) 888-2947</div>
            </el-popover>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.img-layout {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  width: 100%;
  height: 350px;
  .big {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
    height: 350px;
    position: relative;
    .btns-operator {
      position: absolute;
      bottom: 10px;
      left: 10px;
      z-index: 1;
    }
  }

  .small {
    height: 175px;
  }

  .big,
  .small {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.overview-container {
  .content {
    width: 100%;
    .item {
      .title {
        font-weight: bold;
      }
      &.right {
        padding: 10px;
        dl {
          margin-top: 20px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 20px;
          dt {
            font-weight: bold;
            font-size: 20px;
            color: #000;
          }
          dd {
            font-size: 14px;
          }
        }
      }
      &.left {
        height: 350px;
        width: 100%;
      }
    }
  }
  > .operator {
    padding-top: 5px;
    text-align: right;
  }

  .flex-container {
    display: flex;
    justify-content: space-between; /* 左右两端对齐 */
    align-items: center; /* 垂直居中（可选） */
    .left {
      text-align: left; /* 确保文本左对齐 */
    }

    .right {
      text-align: right; /* 确保文本右对齐 */
    }
  }

  @media (max-width: 768px) {
    .flex-container {
      flex-direction: column;
      .left,
      .right {
        width: 100%; /* 占满整行 */
        text-align: left; /* 移动端统一左对齐（可选） */
      }
    }
  }

  .price-box {
    .price {
      font-weight: bold;
      font-size: 20px;
      color: #000;
    }
  }

  .btn-box {
    .btn-schedule {
      background: #1f274b;
      color: #fff;
    }
  }

  .address {
    font-size: 16px;
    color: #000;
    margin-top: 10px;
  }
}

.flex-container-5 {
  margin-top: 20px;
  display: flex;
  gap: 10px; /* 可选：设置间距 */
  .item {
    flex: 1; /* 关键：让每个 item 平分宽度 */
    min-width: 0; /* 防止内容溢出 */
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 5px;
    padding: 10px;
    .value {
      font-size: 20px;
      font-weight: bold;
      color: #000;
    }
  }
}

.flex-container-2 {
  display: flex;
  .item {
    flex: 1;
    min-width: 0;
    padding: 10px;
    text-align: left;
    .title {
      margin: 20px 0;
      font-size: 18px;
      font-weight: bold;
      color: #000;
    }
  }
}

@media (max-width: 768px) {
  .flex-container-2 {
    flex-direction: column;
    .item {
      width: 100%;
    }
  }
}

@media (max-width: 768px) {
  .flex-container-5 {
    flex-direction: column; /* 改为垂直布局 */
  }
  .item {
    width: 100%; /* 每个 item 占满整行 */
  }
}
</style>
